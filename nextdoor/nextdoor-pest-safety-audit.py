#!/usr/bin/env python3
"""
Nextdoor pest safety audit for FindALocalPro.

Purpose:
- Block pest-control replies for animal removal / wildlife / rodent requests.
- Audit activity logs after runs and queue any accidental public replies for manual deletion.

This script DOES NOT delete Nextdoor comments by itself. Public deletion is intentionally
approval-gated because it is an external/destructive action.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
NEXTDOOR = ROOT / "nextdoor"
DEFAULT_LOGS = [
    NEXTDOOR / "activity-log.json",
    NEXTDOOR / "activity-log-dad-nextdoor.json",
    NEXTDOOR / "activity-log-pa-franconia.json",
]
DEFAULT_QUEUE = NEXTDOOR / "safety-delete-queue.jsonl"

BAD_ANIMAL_PATTERNS = {
    "wildlife": r"\bwildlife\b",
    "animal_removal": r"\banimal\s+removal\b",
    "animal_control": r"\banimal\s+control\b",
    "bird": r"\bbirds?\b",
    "bat": r"\bbats?\b",
    "raccoon": r"\braccoons?\b",
    "squirrel": r"\bsquirrels?\b",
    "chipmunk": r"\bchipmunks?\b",
    "skunk": r"\bskunks?\b",
    "possum": r"\b(?:opossums?|possums?)\b",
    "coyote": r"\bcoyotes?\b",
    "rabbit_bunny": r"\b(?:rabbits?|bunn(?:y|ies))\b",
    "deer": r"\bdeer\b",
    "groundhog": r"\bgroundhogs?\b",
    "mole": r"\bmoles?\b",
    "vole": r"\bvoles?\b",
    "snake": r"\bsnakes?\b",
    "mouse_mice": r"\b(?:mouse|mice)\b",
    "rat": r"\brats?\b",
    "rodent": r"\brodents?\b",
    "humane_no_kill": r"\b(?:humane|no[- ]?kill)\b",
    "attic_animal": r"\battic\b.{0,40}\b(?:animal|raccoon|squirrel|bird|bat|mouse|mice|rat|rodent)s?\b|\b(?:animal|raccoon|squirrel|bird|bat|mouse|mice|rat|rodent)s?\b.{0,40}\battic\b",
    "garage_animal": r"\bgarage\b.{0,40}\b(?:animal|raccoon|squirrel|bird|bat|mouse|mice|rat|rodent)s?\b|\b(?:animal|raccoon|squirrel|bird|bat|mouse|mice|rat|rodent)s?\b.{0,40}\bgarage\b",
}
BAD_RE = {k: re.compile(v, re.I) for k, v in BAD_ANIMAL_PATTERNS.items()}

PEST_VERTICAL_RE = re.compile(r"\b(pest|exterminator|pest_control|pest-control)\b", re.I)
POSTED_ACTIONS = {"replied", "posted", "commented", "submitted"}
SKIP_WORDS_RE = re.compile(r"\b(skip|skipped|observed|tracked_only|duplicate|not_covered|no post|no_post|blocked)\b", re.I)

TEXT_KEYS = {
    "post_text", "summary", "need", "topic", "phrase", "distinctive_phrase",
    "reply", "reply_text", "comment", "notes", "status", "skip_reason",
    "vertical", "service_promoted", "category", "query", "post_topic",
}


def parse_time(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value.strip():
        return None
    s = value.strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def flatten(obj: Any, path: str = "") -> Iterable[tuple[str, dict[str, Any]]]:
    if isinstance(obj, dict):
        yield path or "$", obj
        for key, val in obj.items():
            child = f"{path}.{key}" if path else str(key)
            yield from flatten(val, child)
    elif isinstance(obj, list):
        for i, val in enumerate(obj):
            child = f"{path}[{i}]" if path else f"[{i}]"
            yield from flatten(val, child)


def compact_text(obj: dict[str, Any]) -> str:
    parts: list[str] = []
    for key, value in obj.items():
        if key in TEXT_KEYS and value is not None:
            if isinstance(value, (dict, list)):
                try:
                    value = json.dumps(value, ensure_ascii=False)
                except Exception:
                    value = str(value)
            parts.append(f"{key}: {value}")
    return "\n".join(parts)


def bad_terms(text: str) -> list[str]:
    return [name for name, rx in BAD_RE.items() if rx.search(text or "")]


def is_pest_related(obj: dict[str, Any], text: str) -> bool:
    vertical = " ".join(str(obj.get(k, "")) for k in ("vertical", "service_promoted", "category"))
    return bool(PEST_VERTICAL_RE.search(vertical) or PEST_VERTICAL_RE.search(text or ""))


def is_posted_or_public_reply(obj: dict[str, Any], text: str) -> bool:
    action = str(obj.get("action_taken") or obj.get("action") or obj.get("type") or "").lower()
    if action in POSTED_ACTIONS or any(word in action for word in POSTED_ACTIONS):
        return True
    for key in ("replied", "posted", "submitted"):
        if obj.get(key) is True:
            return True
    if obj.get("posted_count") or obj.get("service_responses_posted"):
        return bool(bad_terms(text)) and not SKIP_WORDS_RE.search(text or "")
    if obj.get("reply") or obj.get("reply_text") or obj.get("comment"):
        return not SKIP_WORDS_RE.search(str(obj.get("status", "")) + " " + str(obj.get("skip_reason", "")))
    return False


def object_timestamp(obj: dict[str, Any], parent_ts: datetime | None = None) -> datetime | None:
    for key in ("timestamp", "observed_at", "created_at", "time", "date"):
        dt = parse_time(obj.get(key))
        if dt:
            return dt
    return parent_ts


def scan_log(path: Path, since: datetime | None) -> list[dict[str, Any]]:
    try:
        data = json.loads(path.read_text())
    except FileNotFoundError:
        return []
    except Exception as e:
        return [{"severity": "error", "file": str(path), "error": f"could not parse JSON: {e}"}]

    violations: list[dict[str, Any]] = []
    # Track ancestor timestamps for nested shapes like entries[123].posted[0].
    parent_times: dict[str, datetime] = {}

    def inherited_time(obj_path: str) -> datetime | None:
        cur = obj_path
        while cur:
            if cur in parent_times:
                return parent_times[cur]
            if "." in cur:
                cur = cur.rsplit(".", 1)[0]
            elif "[" in cur:
                cur = cur.rsplit("[", 1)[0]
            else:
                break
        return parent_times.get("$")

    for obj_path, obj in flatten(data):
        if not isinstance(obj, dict):
            continue
        own_dt = object_timestamp(obj)
        if own_dt:
            parent_times[obj_path] = own_dt
        dt = own_dt or inherited_time(obj_path)
        if since and (not dt or dt < since):
            continue

        text = compact_text(obj)
        terms = bad_terms(text)
        if not terms:
            continue
        if not is_pest_related(obj, text):
            continue
        if not is_posted_or_public_reply(obj, text):
            continue

        ts = dt.isoformat() if dt else None
        violations.append({
            "severity": "violation",
            "file": str(path),
            "path": obj_path,
            "timestamp": ts,
            "bad_terms": terms,
            "author": obj.get("author") or obj.get("author_name"),
            "url": obj.get("post_url") or obj.get("url"),
            "vertical": obj.get("vertical") or obj.get("service_promoted") or obj.get("category"),
            "reply": obj.get("reply") or obj.get("reply_text") or obj.get("comment"),
            "excerpt": re.sub(r"\s+", " ", text)[:700],
        })
    return violations


def write_queue(queue: Path, violations: list[dict[str, Any]]) -> None:
    if not violations:
        return
    queue.parent.mkdir(parents=True, exist_ok=True)
    existing: set[tuple[str, str, str]] = set()
    if queue.exists():
        for line in queue.read_text(encoding="utf-8").splitlines():
            try:
                old = json.loads(line)
            except Exception:
                continue
            existing.add((str(old.get("url") or ""), str(old.get("reply") or ""), str(old.get("author") or "")))
    with queue.open("a", encoding="utf-8") as f:
        for v in violations:
            key = (str(v.get("url") or ""), str(v.get("reply") or ""), str(v.get("author") or ""))
            if key in existing:
                continue
            existing.add(key)
            item = {
                "queued_at": datetime.now(timezone.utc).isoformat(),
                "reason": "pest_animal_removal_safety_violation",
                "status": "needs_manual_delete_approval",
                **v,
            }
            f.write(json.dumps(item, ensure_ascii=False) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Audit/block Nextdoor pest replies for animal-removal/wildlife mistakes.")
    ap.add_argument("--text", help="Check a proposed post/candidate text instead of scanning logs.")
    ap.add_argument("--vertical", default="", help="Candidate vertical for --text checks.")
    ap.add_argument("--logs", nargs="*", default=[str(p) for p in DEFAULT_LOGS], help="Activity log JSON files to scan.")
    ap.add_argument("--since-hours", type=float, default=72, help="Only scan entries with timestamps within this many hours. Use 0 for all time.")
    ap.add_argument("--queue-delete", action="store_true", help="Append violations to safety-delete-queue.jsonl for manual deletion approval.")
    ap.add_argument("--queue-file", default=str(DEFAULT_QUEUE))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    if args.text is not None:
        text = args.text
        terms = bad_terms(text)
        blocked = bool(terms and PEST_VERTICAL_RE.search(args.vertical + " " + text))
        result = {
            "mode": "candidate_text",
            "blocked": blocked,
            "decision": "block_not_covered_animal_removal" if blocked else "pass",
            "bad_terms": terms,
            "rule": "FindALocalPro pest coverage is bugs/insects only; animal/wildlife/rodent requests are not covered.",
        }
        print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result["decision"])
        return 3 if blocked else 0

    since = None
    if args.since_hours and args.since_hours > 0:
        since = datetime.now(timezone.utc) - timedelta(hours=args.since_hours)

    violations: list[dict[str, Any]] = []
    for log in args.logs:
        violations.extend(scan_log(Path(os.path.expanduser(log)), since))

    raw_real_violations = [v for v in violations if v.get("severity") == "violation"]
    seen_keys: set[tuple[str, str, str]] = set()
    real_violations: list[dict[str, Any]] = []
    for v in raw_real_violations:
        key = (str(v.get("url") or ""), str(v.get("reply") or ""), str(v.get("author") or ""))
        if key in seen_keys:
            continue
        seen_keys.add(key)
        real_violations.append(v)
    if args.queue_delete and real_violations:
        write_queue(Path(os.path.expanduser(args.queue_file)), real_violations)

    parse_errors = [v for v in violations if v.get("severity") == "error"]
    result = {
        "mode": "activity_log_audit",
        "since_hours": args.since_hours,
        "checked_logs": args.logs,
        "violation_count": len(real_violations),
        "violations": real_violations + parse_errors,
        "delete_queue": str(Path(os.path.expanduser(args.queue_file))) if args.queue_delete and real_violations else None,
        "decision": "needs_manual_delete_approval" if real_violations else "pass",
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else f"violations={len(real_violations)} decision={result['decision']}")
    return 4 if real_violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
