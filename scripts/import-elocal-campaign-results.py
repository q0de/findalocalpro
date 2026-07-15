#!/usr/bin/env python3
"""Import eLocal Affiliate campaign-results v2 calls into Supabase.

This pulls eLocal's accounting truth: payable_status, payout/call_price,
credit reasons, quality tags, and call_ping_token. It then matches rows back to
our elocal_leads table, preferably by elocal_token/call_ping_token, otherwise by
time + duration + category + zip.

Required environment, read from environment or webhook/.env:
  SUPABASE_URL
  SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY
  ELOCAL_AFFILIATE_API_KEY

Usage:
  python3 scripts/import-elocal-campaign-results.py --start-date 2026-07-01 --end-date 2026-07-15 --dry-run
  python3 scripts/import-elocal-campaign-results.py --start-date 2026-07-01 --end-date 2026-07-15 --apply
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

CAMPAIGNS = {
    "all_campaigns": "48349a81-1ca0-4c1d-92a6-e9342c8317b1",
    "grand_design_call_api": "5f61d096-bb39-4434-b474-5d2cabfac916",
}

CATEGORY_MAP = {
    "Air Conditioning Contractors": "air conditioning",
    "HVAC": "hvac",
    "Plumbing Contractors": "plumbing",
    "Plumbing": "plumbing",
    "Appliance Repair": "appliance repair",
    "Electricians": "electrical",
    "Electrical": "electrical",
    "Exterminators": "pest control",
    "Pest Control": "pest control",
}


def load_env() -> dict[str, str]:
    env = dict(os.environ)
    env_path = Path(__file__).resolve().parents[1] / "webhook" / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            env.setdefault(key, value.strip().strip('"').strip("'"))
    return env


def parse_dt(value: str | None) -> str | None:
    if not value:
        return None
    text = str(value).strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).isoformat()


def as_int(value: Any) -> int | None:
    if value in (None, ""):
        return None
    try:
        return int(float(str(value)))
    except ValueError:
        return None


def as_float(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(str(value))
    except ValueError:
        return None


def fetch_campaign(api_key: str, campaign_uuid: str, start_date: str, end_date: str) -> list[dict[str, Any]]:
    url = f"https://apis.elocal.com/affiliates/v2/campaign-results/{campaign_uuid}/calls.json"
    res = requests.get(
        url,
        headers={"x-api-key": api_key},
        params={"start_date": start_date, "end_date": end_date, "sortBy": "callStartTime", "sortOrder": "asc"},
        timeout=60,
    )
    res.raise_for_status()
    data = res.json()
    calls = data.get("calls")
    if not isinstance(calls, list):
        raise RuntimeError(f"Unexpected eLocal response shape for {campaign_uuid}: {json.dumps(data)[:500]}")
    return calls


def supabase_headers(key: str, prefer: str | None = None) -> dict[str, str]:
    headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    if prefer:
        headers["Prefer"] = prefer
    return headers


def fetch_leads(url: str, key: str, since_date: str) -> list[dict[str, Any]]:
    params = {
        "select": "id,created_at,caller_phone,zip_code,service_category,call_duration,call_status,twilio_call_sid,elocal_token",
        "created_at": f"gte.{since_date}T00:00:00Z",
        "order": "created_at.asc",
        "limit": "5000",
    }
    res = requests.get(f"{url}/rest/v1/elocal_leads", headers=supabase_headers(key), params=params, timeout=30)
    res.raise_for_status()
    return res.json()


def service_norm(value: str | None) -> str:
    if not value:
        return ""
    return CATEGORY_MAP.get(value, value).strip().lower().replace(" contractors", "")


def match_lead(call: dict[str, Any], leads: list[dict[str, Any]], used: set[str]) -> tuple[dict[str, Any] | None, float, str | None]:
    token = call.get("call_ping_token")
    if token:
        for lead in leads:
            if lead.get("id") not in used and lead.get("elocal_token") == token:
                return lead, 0.99, "call_ping_token"

    call_dt = parse_dt(call.get("call_date"))
    if not call_dt:
        return None, 0, None
    call_ts = datetime.fromisoformat(call_dt).timestamp()
    call_duration = as_int(call.get("call_duration")) or 0
    call_service = service_norm(call.get("category_name"))
    call_zip = str(call.get("zip_code") or "").strip()

    candidates: list[tuple[float, dict[str, Any], str]] = []
    for lead in leads:
        if lead.get("id") in used:
            continue
        try:
            lead_ts = datetime.fromisoformat(str(lead["created_at"]).replace("Z", "+00:00")).timestamp()
        except Exception:
            continue
        dt = abs(lead_ts - call_ts)
        if dt > 240:
            continue
        lead_duration = lead.get("call_duration") or 0
        dd = abs(lead_duration - call_duration)
        if dd > 10:
            continue
        score = 0.68
        method = "time_duration"
        if service_norm(lead.get("service_category")) == call_service:
            score += 0.14
            method += "+category"
        if str(lead.get("zip_code") or "") == call_zip:
            score += 0.08
            method += "+zip"
        score -= min(dt / 240, 1) * 0.06
        score -= min(dd / 10, 1) * 0.04
        candidates.append((score, lead, method))

    if not candidates:
        return None, 0, None
    candidates.sort(key=lambda item: item[0], reverse=True)
    score, lead, method = candidates[0]
    return lead, max(0, min(score, 0.95)), method


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start-date", required=True, help="YYYY-MM-DD, Eastern Time for eLocal API")
    parser.add_argument("--end-date", required=True, help="YYYY-MM-DD, Eastern Time for eLocal API")
    parser.add_argument("--campaign", choices=sorted(CAMPAIGNS), default="grand_design_call_api")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    env = load_env()
    supabase_url = env.get("SUPABASE_URL")
    supabase_key = env.get("SUPABASE_SERVICE_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY")
    api_key = env.get("ELOCAL_AFFILIATE_API_KEY")
    if not supabase_url or not supabase_key:
        raise SystemExit("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY")
    if not api_key:
        raise SystemExit("Missing ELOCAL_AFFILIATE_API_KEY. Create/copy it from eLocal API Details and store it outside git.")

    campaign_uuid = CAMPAIGNS[args.campaign]
    calls = fetch_campaign(api_key, campaign_uuid, args.start_date, args.end_date)
    leads = fetch_leads(supabase_url.rstrip("/"), supabase_key, args.start_date)
    used: set[str] = set()
    payload: list[dict[str, Any]] = []

    for call in calls:
        call_id = str(call.get("call_id") or "").strip()
        if not call_id:
            continue
        lead, confidence, method = match_lead(call, leads, used)
        if lead:
            used.add(lead["id"])
        payload.append({
            "campaign_uuid": campaign_uuid,
            "campaign_name": args.campaign,
            "call_id": call_id,
            "provider_call_id": call.get("provider_call_id"),
            "call_ping_token": call.get("call_ping_token"),
            "call_date": parse_dt(call.get("call_date")),
            "caller_phone": call.get("caller_phone"),
            "did_phone": call.get("did_phone"),
            "zip_code": str(call.get("zip_code") or "") or None,
            "category_id": as_int(call.get("category_id")),
            "category_name": call.get("category_name"),
            "call_duration_seconds": as_int(call.get("call_duration")),
            "call_price": as_float(call.get("call_price")),
            "gross_call_value": as_float(call.get("gross_call_value")),
            "payable_status": call.get("payable_status"),
            "payable_status_reason": call.get("payable_status_reason"),
            "is_adjusted": call.get("is_adjusted"),
            "adjustment_category": call.get("adjustment_category"),
            "credit_reason": call.get("credit_reason"),
            "call_quality_tags": call.get("call_quality_tags"),
            "raw_row": call,
            "matched_elocal_lead_id": lead.get("id") if lead else None,
            "matched_twilio_call_sid": lead.get("twilio_call_sid") if lead else None,
            "match_confidence": round(confidence, 3) if lead else None,
            "match_method": method,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

    summary = {
        "campaign": args.campaign,
        "campaign_uuid": campaign_uuid,
        "start_date": args.start_date,
        "end_date": args.end_date,
        "rows": len(payload),
        "matched": sum(1 for row in payload if row["matched_elocal_lead_id"]),
        "payout": round(sum((row["call_price"] or 0) for row in payload), 2),
        "statuses": {},
    }
    for row in payload:
        key = row.get("payable_status") or "unknown"
        summary["statuses"][key] = summary["statuses"].get(key, 0) + 1
    print(json.dumps(summary, indent=2))

    if args.apply and payload:
        res = requests.post(
            f"{supabase_url.rstrip('/')}/rest/v1/elocal_campaign_results?on_conflict=campaign_uuid,call_id",
            headers=supabase_headers(supabase_key, "resolution=merge-duplicates"),
            data=json.dumps(payload),
            timeout=60,
        )
        if res.status_code >= 300:
            print(res.status_code, res.text, file=sys.stderr)
            return 1
        print(f"Imported {len(payload)} rows")
    elif not args.apply:
        print("Dry run only. Add --apply to insert.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
