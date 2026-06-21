#!/usr/bin/env bash
set -euo pipefail

BASE="/Users/clawrl/clawd/findalocalpro/nextdoor"
PROXY_PORT=18883
CDP_PORT=18803
STATE_FILE="$BASE/pa-proxy/state-franconia.json"
QUIET=0
if [ "${1:-}" = "--quiet" ]; then QUIET=1; fi

fail(){ echo "ERROR: $*" >&2; exit 1; }
info(){ if [ "$QUIET" -eq 0 ]; then echo "$*"; fi; }

lsof -nP -iTCP:$PROXY_PORT -sTCP:LISTEN >/dev/null 2>&1 || fail "Franconia local proxy is not listening on 127.0.0.1:$PROXY_PORT"
lsof -nP -iTCP:$CDP_PORT -sTCP:LISTEN >/dev/null 2>&1 || fail "Franconia Chrome/CDP is not listening on 127.0.0.1:$CDP_PORT"

version_json=$(curl -fsS "http://127.0.0.1:$CDP_PORT/json/version") || fail "Could not read Chrome CDP /json/version"

geo_json=$(curl -fsS --max-time 15 --proxy "http://127.0.0.1:$PROXY_PORT" "http://ip-api.com/json/?fields=status,country,regionName,city,query,isp") || fail "Could not verify proxy geolocation through local proxy"

python3 - "$geo_json" "$version_json" "$STATE_FILE" <<'PY'
import json, sys, pathlib, datetime
geo=json.loads(sys.argv[1])
version=json.loads(sys.argv[2])
state_path=pathlib.Path(sys.argv[3])
if geo.get('status') != 'success':
    raise SystemExit(f"proxy geolocation failed: {geo}")
region=(geo.get('regionName') or '').lower()
country=(geo.get('country') or '').lower()
if country != 'united states' or region != 'pennsylvania':
    raise SystemExit(f"proxy is not Pennsylvania: country={geo.get('country')} region={geo.get('regionName')} city={geo.get('city')}")
state={}
if state_path.exists():
    try: state=json.loads(state_path.read_text())
    except Exception: state={}
state.update({
    'mode':'pa-franconia-static-isp',
    'market':'Franconia Township PA / Montgomery County',
    'proxy_port':18883,
    'cdp_port':18803,
    'profile':'pa-franconia-nextdoor',
    'checked_at':datetime.datetime.now().isoformat(timespec='seconds'),
    'city':geo.get('city'),
    'region':geo.get('regionName'),
    'country':geo.get('country'),
    'ip':geo.get('query'),
    'isp':geo.get('isp'),
    'browser':version.get('Browser')
})
state_path.write_text(json.dumps(state, indent=2)+"\n")
print(f"OK: Franconia proxy/CDP healthy — {geo.get('city')}, {geo.get('regionName')} via CDP 18803")
PY

info "Reminder: before public posting, the cron/helper must still verify visible Nextdoor context is Franconia/Montgomery PA and not Illinois."

if [ "${SKIP_VISIBLE_CONTEXT_CHECK:-0}" != "1" ]; then
  visible_args=(--market franconia)
  if [ "$QUIET" -eq 1 ]; then visible_args+=(--json); fi
  CDP_HTTP="http://127.0.0.1:$CDP_PORT" node "$BASE/nextdoor-visible-context-check.mjs" "${visible_args[@]}" >/tmp/pa-franconia-visible-context-check.json 2>/tmp/pa-franconia-visible-context-check.err || {
    cat /tmp/pa-franconia-visible-context-check.err >&2 || true
    cat /tmp/pa-franconia-visible-context-check.json >&2 || true
    fail "Franconia CDP/proxy is healthy, but visible Nextdoor context is not safely Franconia/Montgomery PA"
  }
  if [ "$QUIET" -eq 0 ]; then cat /tmp/pa-franconia-visible-context-check.json 2>/dev/null || true; fi
fi
