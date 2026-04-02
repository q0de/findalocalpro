#!/usr/bin/env python3
"""
Nextdoor CDP Helper - Chrome DevTools Protocol wrapper
Works around OpenClaw browser tool bug (snapshot/act broken)
Usage: python3 nextdoor-cdp.py <command> [args]
"""

import sys
import json
import urllib.request
import urllib.error

CDP_URL = "http://127.0.0.1:18800"

def get_tabs():
    """List all open tabs"""
    try:
        with urllib.request.urlopen(f"{CDP_URL}/json/list") as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"Error getting tabs: {e}", file=sys.stderr)
        return []

def get_nextdoor_tab():
    """Find the Nextdoor tab"""
    tabs = get_tabs()
    for tab in tabs:
        if "nextdoor" in tab.get("url", "").lower():
            return tab
    return None

def get_page_text(tab_id=None, max_chars=15000):
    """Get page text content via CDP"""
    if tab_id is None:
        tab = get_nextdoor_tab()
        if not tab:
            print("No Nextdoor tab found", file=sys.stderr)
            return None
        tab_id = tab["id"]
    
    # Use Runtime.evaluate via HTTP API
    expr = f"document.body.innerText.slice(0, {max_chars})"
    url = f"{CDP_URL}/json/activate/{tab_id}"  # Ensure tab is active
    
    try:
        urllib.request.urlopen(url).read()  # Activate
        
        # Now use WebSocket or CDP protocol to evaluate
        # For simplicity, use the json/new endpoint to create a session
        with urllib.request.urlopen(f"{CDP_URL}/json/new") as resp:
            session = json.loads(resp.read())
        
        # Actually, let's use a simpler approach - execute script via HTTP
        # Chrome doesn't expose evaluate directly via HTTP, so we use a workaround
        # by creating a new tab with javascript: URL
        js_url = f"javascript:document.title + '|||' + document.body.innerText.slice(0,{max_chars})"
        with urllib.request.urlopen(f"{CDP_URL}/json/new?{urllib.parse.quote(js_url)}") as resp:
            result = json.loads(resp.read())
            return result
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None

def execute_js(tab_id, script):
    """Execute JavaScript on a tab"""
    # Note: This requires WebSocket. For HTTP-only, we need a different approach.
    pass

def main():
    if len(sys.argv) < 2:
        print("Usage: nextdoor-cdp.py <command> [args]")
        print("Commands:")
        print("  tabs              - List all tabs")
        print("  nextdoor-tab      - Find Nextdoor tab ID")
        print("  text [max_chars]  - Get page text")
        return
    
    cmd = sys.argv[1]
    
    if cmd == "tabs":
        tabs = get_tabs()
        for tab in tabs:
            print(f"{tab['id'][:20]}... | {tab.get('title', 'No title')[:40]} | {tab.get('url', 'No URL')[:50]}")
    
    elif cmd == "nextdoor-tab":
        tab = get_nextdoor_tab()
        if tab:
            print(tab["id"])
        else:
            print("NOT_FOUND")
            sys.exit(1)
    
    elif cmd == "text":
        max_chars = int(sys.argv[2]) if len(sys.argv) > 2 else 15000
        tab = get_nextdoor_tab()
        if not tab:
            print("No Nextdoor tab found", file=sys.stderr)
            sys.exit(1)
        
        # Use fetch to get text via CDP
        try:
            import subprocess
            result = subprocess.run([
                sys.executable, "-c", f'''
import asyncio, websockets, json
async def main():
    async with websockets.connect("ws://127.0.0.1:18800/devtools/page/{tab['id']}") as ws:
        await ws.send(json.dumps({{
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {{"expression": "document.body.innerText.slice(0, {max_chars})", "returnByValue": True}}
        }}))
        r = json.loads(await ws.recv())
        print(r["result"]["result"]["value"])
asyncio.run(main())
'''
            ], capture_output=True, text=True, timeout=30)
            print(result.stdout, end='')
            if result.returncode != 0:
                print(result.stderr, file=sys.stderr)
                sys.exit(1)
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
    
    elif cmd == "click":
        if len(sys.argv) < 3:
            print("Usage: nextdoor-cdp.py click <selector>")
            sys.exit(1)
        selector = sys.argv[2]
        tab = get_nextdoor_tab()
        if not tab:
            print("No Nextdoor tab found", file=sys.stderr)
            sys.exit(1)
        
        try:
            import subprocess
            js = f"document.querySelector('{selector}').click()"
            result = subprocess.run([
                sys.executable, "-c", f'''
import asyncio, websockets, json
async def main():
    async with websockets.connect("ws://127.0.0.1:18800/devtools/page/{tab['id']}") as ws:
        await ws.send(json.dumps({{
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {{"expression": "{js}", "returnByValue": True}}
        }}))
        r = json.loads(await ws.recv())
        print("OK")
asyncio.run(main())
'''
            ], capture_output=True, text=True, timeout=30)
            print(result.stdout, end='')
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
    
    elif cmd == "type":
        if len(sys.argv) < 4:
            print("Usage: nextdoor-cdp.py type <selector> <text>")
            sys.exit(1)
        selector = sys.argv[2]
        text = sys.argv[3].replace("'", "\\'")
        tab = get_nextdoor_tab()
        if not tab:
            print("No Nextdoor tab found", file=sys.stderr)
            sys.exit(1)
        
        try:
            import subprocess
            js = f"document.querySelector('{selector}').value = '{text}'; document.querySelector('{selector}').dispatchEvent(new Event('input', {{bubbles: true}}))"
            result = subprocess.run([
                sys.executable, "-c", f'''
import asyncio, websockets, json
async def main():
    async with websockets.connect("ws://127.0.0.1:18800/devtools/page/{tab['id']}") as ws:
        await ws.send(json.dumps({{
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {{"expression": "{js}", "returnByValue": True}}
        }}))
        r = json.loads(await ws.recv())
        print("OK")
asyncio.run(main())
'''
            ], capture_output=True, text=True, timeout=30)
            print(result.stdout, end='')
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()
