#!/usr/bin/env bash
set -euo pipefail

BASE="/Users/clawrl/clawd/findalocalpro/nextdoor"
CONF="$BASE/pa-proxy/static-isp.json"
PROXY_PORT=18883
CDP_PORT=18803
PROFILE_DIR="/Users/clawrl/.openclaw/browser/pa-franconia-nextdoor/user-data"
PROXY_JS="/Users/clawrl/clawd/tmp/local-auth-http-proxy.mjs"
PID_FILE="$BASE/pa-proxy/local-proxy-franconia.pid"
STATE_FILE="$BASE/pa-proxy/state-franconia.json"
LOG_FILE="$BASE/pa-proxy/local-proxy-franconia.log"
CHROME_LOG="/tmp/pa-franconia-nextdoor-chrome.log"

mkdir -p "$BASE/pa-proxy" "$PROFILE_DIR" /Users/clawrl/clawd/tmp

cat > "$PROXY_JS" <<'JS'
import http from 'node:http';
import net from 'node:net';
const listenPort = Number(process.env.LISTEN_PORT || 18883);
const upstreamHost = process.env.UPSTREAM_HOST;
const upstreamPort = Number(process.env.UPSTREAM_PORT);
const auth = Buffer.from(`${process.env.UPSTREAM_USER}:${process.env.UPSTREAM_PASS}`).toString('base64');
const server = http.createServer((req, res) => {
  let target;
  try { target = new URL(req.url); } catch { res.writeHead(400); res.end('bad proxy url'); return; }
  const opts = {host: upstreamHost, port: upstreamPort, method: req.method, path: req.url, headers: {...req.headers, 'Proxy-Authorization': `Basic ${auth}`}};
  delete opts.headers['proxy-authorization'];
  const pr = http.request(opts, pres => { res.writeHead(pres.statusCode || 502, pres.headers); pres.pipe(res); });
  pr.on('error', e => { res.writeHead(502); res.end(String(e.message || e)); });
  req.pipe(pr);
});
server.on('connect', (req, client, head) => {
  const upstream = net.connect(upstreamPort, upstreamHost, () => {
    upstream.write(`CONNECT ${req.url} HTTP/1.1\r\nHost: ${req.url}\r\nProxy-Authorization: Basic ${auth}\r\nProxy-Connection: keep-alive\r\n\r\n`);
    if (head?.length) upstream.write(head);
  });
  let buffered = Buffer.alloc(0);
  const onData = chunk => {
    buffered = Buffer.concat([buffered, chunk]);
    const s = buffered.toString('latin1');
    const idx = s.indexOf('\r\n\r\n');
    if (idx === -1) return;
    const header = s.slice(0, idx);
    if (!/^HTTP\/1\.[01] 200/i.test(header)) { client.end(buffered); upstream.end(); return; }
    client.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    const rest = buffered.slice(idx + 4);
    if (rest.length) client.write(rest);
    upstream.off('data', onData);
    upstream.pipe(client); client.pipe(upstream);
  };
  upstream.on('data', onData);
  upstream.on('error', () => client.destroy());
  client.on('error', () => upstream.destroy());
});
server.listen(listenPort, '127.0.0.1', () => console.log(`local proxy listening 127.0.0.1:${listenPort}`));
JS

read_json(){ python3 - "$CONF" "$1" <<'PY'
import json, sys
print(json.load(open(sys.argv[1]))[sys.argv[2]])
PY
}

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  kill "$(cat "$PID_FILE")" || true
  sleep 1
fi

UPSTREAM_HOST=$(read_json host) \
UPSTREAM_PORT=$(read_json port) \
UPSTREAM_USER=$(read_json username) \
UPSTREAM_PASS=$(read_json password) \
LISTEN_PORT=$PROXY_PORT \
nohup node "$PROXY_JS" > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
sleep 1

if lsof -nP -iTCP:$CDP_PORT -sTCP:LISTEN >/dev/null 2>&1; then
  lsof -tiTCP:$CDP_PORT -sTCP:LISTEN | xargs kill || true
  sleep 2
fi

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=$CDP_PORT \
  --remote-allow-origins=http://127.0.0.1:$CDP_PORT \
  --user-data-dir="$PROFILE_DIR" \
  --window-size=1280,900 --window-position=80,80 \
  --no-first-run --no-default-browser-check --disable-sync \
  --disable-background-networking --disable-component-update \
  --disable-features=Translate,MediaRouter \
  --disable-session-crashed-bubble --hide-crash-restore-bubble \
  --password-store=basic \
  --proxy-server="http://127.0.0.1:$PROXY_PORT" \
  "https://nextdoor.com/news_feed/?feed=recent" >"$CHROME_LOG" 2>&1 &

sleep 3
curl -fsS "http://127.0.0.1:$CDP_PORT/json/version" >/dev/null

python3 - <<PY
import json, datetime, pathlib
state={
  'mode':'pa-franconia-static-isp',
  'market':'Franconia Township PA / Montgomery County',
  'proxy_location_configured':'Pennsylvania static ISP',
  'proxy_port':$PROXY_PORT,
  'cdp_port':$CDP_PORT,
  'profile':'pa-franconia-nextdoor',
  'proxy_pid':int(open('$PID_FILE').read()),
  'started_at':datetime.datetime.now().isoformat(timespec='seconds')
}
path=pathlib.Path('$STATE_FILE')
path.write_text(json.dumps(state, indent=2)+"\n")
PY

"$BASE/check-pa-franconia-nextdoor.sh" --quiet
printf 'PA Franconia Nextdoor profile ready: CDP %s, local proxy %s\n' "$CDP_PORT" "$PROXY_PORT"
