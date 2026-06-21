#!/usr/bin/env node
import http from 'node:http';

const args = process.argv.slice(2);
const get = (k, d='') => { const i=args.indexOf(k); return i>=0 ? args[i+1] : d; };
const CDP = process.env.CDP_HTTP || get('--cdp', 'http://127.0.0.1:18803');
const url = get('--url', 'https://nextdoor.com/news_feed/?feed=recent');
const market = get('--market', 'franconia');
const jsonOut = args.includes('--json');
const wait = ms => new Promise(r => setTimeout(r, ms));

function jget(u){return new Promise((res,rej)=>http.get(u,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{try{res(JSON.parse(d))}catch(e){rej(e)}})}).on('error',rej))}
async function tab(){const tabs=await jget(`${CDP}/json/list`); return tabs.find(t=>(t.url||'').includes('nextdoor.com')) || tabs.find(t=>t.type==='page') || tabs[0];}
let id=1;
async function send(ws,method,params={}){const my=id++; ws.send(JSON.stringify({id:my,method,params})); while(true){const msg=JSON.parse(await new Promise((resolve,reject)=>{const onMsg=e=>{cleanup(); resolve(typeof e.data==='string'?e.data:Buffer.from(e.data).toString())}; const onErr=e=>{cleanup(); reject(e)}; const cleanup=()=>{ws.removeEventListener('message',onMsg); ws.removeEventListener('error',onErr)}; ws.addEventListener('message',onMsg); ws.addEventListener('error',onErr);})); if(msg.id===my) return msg;}}

const MARKET_RULES = {
  franconia: {
    requiredAny: ['Franconia', 'Montgomery', 'Souderton', 'Telford', 'Lansdale', 'Harleysville', 'Skippack', 'North Wales', 'Gwynedd', 'Dublin', 'Horsham', 'Ambler', 'PA'],
    forbiddenAny: ['Downers Grove', 'Naperville', 'Fairmount', 'YMCA', 'Illinois', 'Warrington Glen']
  },
  warrington: {
    requiredAny: ['Warrington', 'Bucks', 'Doylestown', 'Horsham', 'Richboro', 'Dublin', 'Warminster', 'PA'],
    forbiddenAny: ['Downers Grove', 'Naperville', 'Fairmount', 'YMCA', 'Illinois']
  }
};

async function main(){
  const t = await tab();
  if(!t) throw new Error('no CDP tab');
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true}); ws.addEventListener('error',reject,{once:true});});
  await send(ws,'Page.enable'); await send(ws,'Runtime.enable');
  await send(ws,'Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send(ws,'Page.navigate',{url});
  await wait(7000);
  const expr = `(()=>({href:location.href,title:document.title,text:String(document.body?.innerText||'').replace(/\\s+/g,' ').trim().slice(0,6000),width:innerWidth,height:innerHeight}))()`;
  const r = await send(ws,'Runtime.evaluate',{expression:expr,returnByValue:true});
  ws.close();
  const v = r.result?.result?.value || {};
  const rules = MARKET_RULES[market] || MARKET_RULES.franconia;
  const foundRequired = rules.requiredAny.filter(s => v.text?.includes(s));
  const foundForbidden = rules.forbiddenAny.filter(s => v.text?.includes(s));
  const ok = foundRequired.length > 0 && foundForbidden.length === 0 && /nextdoor\.com/.test(v.href||'');
  const out = {ok, market, href:v.href, title:v.title, width:v.width, height:v.height, foundRequired, foundForbidden, preview:(v.text||'').slice(0,1000)};
  if(jsonOut) console.log(JSON.stringify(out,null,2));
  else if(ok) console.log(`OK: visible Nextdoor context matches ${market}: ${foundRequired.join(', ')}`);
  else console.error(`ERROR: visible Nextdoor context mismatch for ${market}: required=${foundRequired.join(',')||'none'} forbidden=${foundForbidden.join(',')||'none'} href=${v.href}`);
  process.exit(ok ? 0 : 1);
}
main().catch(e=>{console.error(e.stack||e.message); process.exit(1);});
