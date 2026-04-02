#!/bin/bash
# Nextdoor Lead Scanner - CDP-based workaround for OpenClaw browser bug
# Uses direct Chrome DevTools Protocol instead of browser tool snapshot/act

TARGET_URL="https://nextdoor.com/news_feed/"
CDP_URL="http://127.0.0.1:18800"

# Function to get page content via CDP
get_page_text() {
    local target_id="$1"
    python3 -c "
import json, asyncio, websockets

async def get_content():
    uri = 'ws://127.0.0.1:18800/devtools/page/${target_id}'
    try:
        async with websockets.connect(uri) as ws:
            # Get body text
            await ws.send(json.dumps({
                'id': 1,
                'method': 'Runtime.evaluate',
                'params': {'expression': 'document.body.innerText', 'returnByValue': True}
            }))
            resp = json.loads(await ws.recv())
            text = resp['result']['result']['value']
            print(text[:10000])  # First 10k chars
    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)

asyncio.run(get_content())
" 2>/dev/null
}

# Function to click an element by selector
click_element() {
    local target_id="$1"
    local selector="$2"
    python3 -c "
import json, asyncio, websockets

async def click():
    uri = 'ws://127.0.0.1:18800/devtools/page/${target_id}'
    async with websockets.connect(uri) as ws:
        # Find and click element
        js = \"\"\"
            var el = document.querySelector('${selector}');
            if (el) { el.click(); return 'clicked'; }
            return 'not found';
        \"\"\"
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {'expression': js, 'returnByValue': True}
        }))
        resp = json.loads(await ws.recv())
        print(resp['result']['result']['value'])

asyncio.run(click())
" 2>/dev/null
}

# Function to type text into an element
type_text() {
    local target_id="$1"
    local selector="$2"
    local text="$3"
    python3 -c "
import json, asyncio, websockets

async def type_text():
    uri = 'ws://127.0.0.1:18800/devtools/page/${target_id}'
    async with websockets.connect(uri) as ws:
        # Focus and type
        js = \"\"\"
            var el = document.querySelector('${selector}');
            if (el) { 
                el.focus();
                el.value = '${text}';
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                return 'typed';
            }
            return 'not found';
        \"\"\"
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {'expression': js, 'returnByValue': True}
        }))
        resp = json.loads(await ws.recv())
        print(resp['result']['result']['value'])

asyncio.run(type_text())
" 2>/dev/null
}

echo "Nextdoor CDP Helper Functions Loaded"
echo "Usage: source this file, then:"
echo "  get_page_text <target_id>"
echo "  click_element <target_id> '<selector>'"
echo "  type_text <target_id> '<selector>' '<text>'"
