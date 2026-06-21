#!/usr/bin/env python3
"""Shared Nextdoor dedupe guard for FindALocalPro scans.

Checks all local Nextdoor activity logs before a cron agent posts or promotes a
lead as "best/next". It is intentionally conservative for posting: exact post
ID/URL matches block immediately; author+need fuzzy matches are flagged for
human/agent review.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parent
LOGS = [
    ROOT / "activity-log.json",                 # Illinois / primary legacy
    ROOT / "activity-log-dad-nextdoor.json",    # PA Dad / Warrington
    ROOT / "activity-log-pa-franconia.json",    # PA Franconia
]

POST_ID_RE = re.compile(r"nextdoor\.com/p/([^/?#]+)|\bpost_id['\"]?\s*[:=]\s*['\"]?([A-Za-z0-9_-]+)")
WORD_RE = re.compile(r"[a-z0-9]+")

POSTED_TYPES = {
    "service_response",
    "reply",
    "posted_reply",
    "nextdoor_service_reply",
}
POSTED_KEYS = ("posted_leads", "posted", "posted_responses", "replies")
LEAD_KEYS = (
    "posted_leads",
    "posted",
    "posted_responses",
    "replies",
    "best_leads",
    "other_logged_leads",
    "logged_leads",
    "observed_leads",
    "tracked_leads",
    "blocked_retryable",
    "needs_followup",
    "observed_only",
    "duplicates_already_handled",
    "duplicates_or_already_handled",
    "duplicate_or_prior",
    "blocked_candidate",
)
DUPLICATE_WORDS = (
    "duplicate",
    "prior_reply",
    "prior reply",
    "already handled",
    "already_handled",
    "already replied",
    "already_replied",
    "reply visible",
    "prior visible reply",
)


def norm_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(WORD_RE.findall(str(value).lower()))


def post_id(value: Any) -> str:
    text = str(value or "")
    m = POST_ID_RE.search(text)
    if not m:
        return ""
    return (m.group(1) or m.group(2) or "").strip()


def similarity(a: str, b: str) -> float:
    a = norm_text(a)
    b = norm_text(b)
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def iter_records(obj: Any, source: str) -> Iterable[dict[str, Any]]:
    """Yield top-level entries/runs and nested lead objects with context."""
    if isinstance(obj, dict):
        for section in ("entries", "runs"):
            for idx, item in enumerate(obj.get(section, []) or []):
                if isinstance(item, dict):
                    rec = dict(item)
                    rec["_source"] = source
                    rec["_section"] = section
                    rec["_index"] = idx
                    yield rec
                    for key in LEAD_KEYS:
                        val = item.get(key)
                        if isinstance(val, list):
                            for n, child in enumerate(val):
                                if isinstance(child, dict):
                                    cre = dict(child)
                                else:
                                    cre = {"value": child}
                                cre["_source"] = source
                                cre["_section"] = f"{section}.{key}"
                                cre["_index"] = f"{idx}.{n}"
                                cre["_parent_timestamp"] = item.get("timestamp") or item.get("started_at")
                                cre["_parent_type"] = item.get("type")
                                yield cre
                        elif isinstance(val, dict):
                            cre = dict(val)
                            cre["_source"] = source
                            cre["_section"] = f"{section}.{key}"
                            cre["_index"] = f"{idx}.0"
                            cre["_parent_timestamp"] = item.get("timestamp") or item.get("started_at")
                            cre["_parent_type"] = item.get("type")
                            yield cre
    elif isinstance(obj, list):
        for idx, item in enumerate(obj):
            if isinstance(item, dict):
                rec = dict(item)
                rec["_source"] = source
                rec["_section"] = "list"
                rec["_index"] = idx
                yield rec


def load_records() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for path in LOGS:
        if not path.exists():
            continue
        try:
            data = json.loads(path.read_text())
        except Exception as exc:  # keep cron safe; report partial evidence
            out.append({"_source": str(path), "_error": str(exc)})
            continue
        out.extend(iter_records(data, str(path)))
    return out


def record_text(rec: dict[str, Any]) -> str:
    return json.dumps(rec, ensure_ascii=False, sort_keys=True)


def is_posted_record(rec: dict[str, Any]) -> bool:
    section = str(rec.get("_section", ""))
    typ = str(rec.get("type") or rec.get("_parent_type") or "").lower()
    if typ in POSTED_TYPES:
        return True
    if rec.get("replied") is True:
        return True
    if norm_text(rec.get("action_taken")) in {"posted", "public reply posted"}:
        return True
    if any(k in section for k in POSTED_KEYS):
        if rec.get("replied") is False:
            return False
        status = norm_text(rec.get("status"))
        if "tracked only" in status or "observed" in status:
            return False
        return True
    text = norm_text(record_text(rec))
    return (
        "posted visible" in text
        or "reply posted" in text
        or "posted text only" in text
        or ("verified" in text and "reply" in text)
    )


def has_duplicate_status(rec: dict[str, Any]) -> bool:
    text = record_text(rec).lower()
    return any(w in text for w in DUPLICATE_WORDS)


def summarize(rec: dict[str, Any], reason: str, confidence: str) -> dict[str, Any]:
    return {
        "reason": reason,
        "confidence": confidence,
        "source": rec.get("_source"),
        "section": rec.get("_section"),
        "index": rec.get("_index"),
        "timestamp": rec.get("timestamp") or rec.get("_parent_timestamp"),
        "type": rec.get("type") or rec.get("_parent_type"),
        "author": rec.get("author") or rec.get("author_name") or rec.get("post_author") or rec.get("original_poster"),
        "url": rec.get("url") or rec.get("post_url"),
        "post_id": post_id(rec.get("url") or rec.get("post_url") or rec.get("post_id") or record_text(rec)),
        "status": rec.get("status"),
        "excerpt": record_text(rec)[:700],
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Check Nextdoor candidate against shared PA/Illinois activity logs")
    ap.add_argument("--url", default="", help="Candidate stable Nextdoor /p URL")
    ap.add_argument("--post-id", default="", help="Candidate Nextdoor post id if known")
    ap.add_argument("--author", default="", help="Candidate author/homeowner")
    ap.add_argument("--need", default="", help="Distinctive need/phrase/post text")
    ap.add_argument("--vertical", default="", help="Service vertical")
    ap.add_argument("--mode", choices=["post", "report"], default="post", help="post blocks actual prior posts; report also hides already-handled observations")
    ap.add_argument("--json", action="store_true", help="Emit JSON only")
    args = ap.parse_args()

    cid = args.post_id or post_id(args.url)
    cauthor = norm_text(args.author)
    cneed = norm_text(" ".join([args.need, args.vertical]))

    matches: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []

    for rec in load_records():
        text = record_text(rec)
        rid = post_id(rec.get("url") or rec.get("post_url") or rec.get("post_id") or text)
        posted = is_posted_record(rec)
        duplicate_status = has_duplicate_status(rec)
        mode_blocks_status = args.mode == "report" and duplicate_status

        if cid and rid and cid == rid:
            if posted or mode_blocks_status:
                matches.append(summarize(rec, "same_post_id_already_handled", "high"))
            else:
                warnings.append(summarize(rec, "same_post_id_seen_but_not_posted", "medium"))
            continue

        rauthor = norm_text(
            rec.get("author")
            or rec.get("author_name")
            or rec.get("post_author")
            or rec.get("original_poster")
        )
        rneed = norm_text(" ".join(str(rec.get(k, "")) for k in (
            "need",
            "summary",
            "phrase",
            "post_topic",
            "post_text",
            "subcategory",
            "title",
            "vertical",
            "notes",
            "value",
        )))
        author_hit = cauthor and rauthor and (cauthor == rauthor or cauthor in rauthor or rauthor in cauthor)
        need_score = similarity(cneed, rneed)
        if author_hit and need_score >= 0.52:
            if posted or mode_blocks_status:
                matches.append(summarize(rec, f"same_author_similar_need_score_{need_score:.2f}", "medium"))
            else:
                warnings.append(summarize(rec, f"same_author_similar_need_seen_score_{need_score:.2f}", "low"))

    result = {
        "candidate": {
            "url": args.url,
            "post_id": cid,
            "author": args.author,
            "need": args.need,
            "vertical": args.vertical,
            "mode": args.mode,
        },
        "decision": "duplicate_block" if matches else ("seen_warn" if warnings else "clear"),
        "should_post": not matches,
        "should_include_in_best_leads": not matches,
        "matches": matches[:10],
        "warnings": warnings[:10],
        "log_files_checked": [str(p) for p in LOGS if p.exists()],
    }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    return 2 if matches else 0


if __name__ == "__main__":
    sys.exit(main())
