#!/usr/bin/env node
import http from 'node:http';
const args=process.argv.slice(2);
const get=(k)=>{const i=args.indexOf(k); return i>=0?args[i+1]:''};
const CDP=process.env.CDP_HTTP||'http://127.0.0.1:18802';
const rawTargetUrl=get('--target-url'), targetAuthor=get('--target-author'), mustContain=get('--must-contain'), near=get('--near')||mustContain||targetAuthor;
const targetUrl=normalizeDetailUrl(rawTargetUrl);
if(!rawTargetUrl||!targetAuthor||!mustContain){console.error('missing --target-url/--target-author/--must-contain'); process.exit(2)}
function normalizeDetailUrl(raw){try{const u=new URL(raw); if(u.hostname.endsWith('nextdoor.com')&&u.pathname.startsWith('/p/')&&!u.searchParams.has('view')) u.searchParams.set('view','detail'); return u.toString()}catch{return raw}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function jget(url){return new Promise((res,rej)=>http.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{try{res(JSON.parse(d))}catch(e){rej(e)}})}).on('error',rej))}
async function tab(){const tabs=await jget(`${CDP}/json/list`); return tabs.find(t=>(t.url||'').includes('nextdoor.com'))||tabs.find(t=>t.type==='page')||tabs[0]}
let id=1; async function send(ws,method,params={}){const my=id++; ws.send(JSON.stringify({id:my,method,params})); while(true){const msg=JSON.parse(await new Promise((resolve,reject)=>{const onMsg=e=>{cleanup(); resolve(typeof e.data==='string'?e.data:Buffer.from(e.data).toString())}; const onErr=e=>{cleanup(); reject(e)}; const cleanup=()=>{ws.removeEventListener('message',onMsg); ws.removeEventListener('error',onErr)}; ws.addEventListener('message',onMsg); ws.addEventListener('error',onErr)})); if(msg.id===my) return msg}}
async function main(){
  const t=await tab(); if(!t) throw new Error('no cdp tab');
  const ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true}); ws.addEventListener('error',reject,{once:true})});
  await send(ws,'Page.enable'); await send(ws,'Runtime.enable');
  await send(ws,'Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send(ws,'Page.navigate',{url:targetUrl}); await wait(6500);
  const expr = `(async()=>{
    const targetUrl=${JSON.stringify(targetUrl)}, targetAuthor=${JSON.stringify(targetAuthor)}, must=${JSON.stringify(mustContain)}, near=${JSON.stringify(near)};
    const clean=s=>String(s||'').replace(/\\s+/g,' ').trim();
    const norm=s=>clean(s).toLowerCase();
    const bodyText=clean(document.body?.innerText||'');
    const stableTarget=targetUrl.split('?')[0];
    const urlOk=location.href.split('?')[0]===stableTarget;
    const postId=(stableTarget.split('/p/')[1]||'').split('/')[0].split('?')[0].split('#')[0];
    const postIdOk=location.href.includes('/p/'+postId);
    const detailPage=/post details/i.test(bodyText)||/Back to newsfeed/i.test(bodyText)||location.search.includes('view=detail');
    const visible=el=>{const r=el.getBoundingClientRect(); const cs=getComputedStyle(el); return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0;};
    const exactCommentButtons=()=>[...document.querySelectorAll('button,[role="button"]')].filter(el=>{const txt=norm(el.getAttribute('aria-label')||el.innerText||''); const r=el.getBoundingClientRect(); return txt==='comment' && r.width>15 && r.height>10 && !el.disabled && el.getAttribute('aria-disabled')!=='true';});
    const findInputs=()=>[...document.querySelectorAll('textarea,input[type="text"],[contenteditable="true"],[role="textbox"]')].filter(el=>{const hint=norm(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.textContent||''); return visible(el) && (hint.includes('comment')||hint.includes('reply')||el.matches('[contenteditable="true"],[role="textbox"]'));});
    const findSubmitButtons=()=>exactCommentButtons().filter(el=>visible(el));
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let hit=null; while(walker.nextNode()){if((walker.currentNode.nodeValue||'').includes(must)){hit=walker.currentNode.parentElement; break;}}
    const chain=[]; for(let e=hit;e&&e!==document.body;e=e.parentElement){const text=clean(e.innerText||e.textContent||''); const r=e.getBoundingClientRect(); if(text.includes(targetAuthor)&&text.includes(must)&&r.width>250&&r.height>60) chain.push({e,text});}
    const minimal=chain.map(x=>x.e).filter(e=>!chain.some(y=>y.e!==e&&e.contains(y.e)));
    const rawMatched=minimal.length||chain.length;
    const container=(chain.find(x=>/Add a comment/i.test(x.text))||chain[0])?.e;
    let preOpenCommentButtons=exactCommentButtons();
    if(container){const add=[...container.querySelectorAll('button,[role="button"],textarea,[contenteditable="true"],div')].find(el=>/add a comment/i.test(clean(el.innerText||el.getAttribute('aria-label')||el.getAttribute('placeholder')||'')) && visible(el)); if(add){add.scrollIntoView({block:'center'}); add.click(); await new Promise(r=>setTimeout(r,900));}}
    else if(detailPage && bodyText.includes(targetAuthor) && bodyText.includes(must) && preOpenCommentButtons.length===1){preOpenCommentButtons[0].scrollIntoView({block:'center'}); preOpenCommentButtons[0].click(); await new Promise(r=>setTimeout(r,900));}
    const inputs=findInputs();
    const submitButtons=findSubmitButtons();
    const detailFallbackMatched=detailPage && rawMatched===0 && bodyText.includes(targetAuthor) && bodyText.includes(must) && preOpenCommentButtons.length===1 && inputs.length===1 && submitButtons.length>=1;
    const matched=detailFallbackMatched?1:rawMatched;
    const pass=!!(urlOk&&postIdOk&&bodyText.includes(targetAuthor)&&bodyText.includes(must)&&matched===1&&inputs.length===1&&submitButtons.length>=1&&submitButtons.length<=2);
    return {href:location.href,title:document.title,urlOk,postIdOk,targetAuthor,mustContain:must,near,bodyHasAuthor:bodyText.includes(targetAuthor),bodyHasPhrase:bodyText.includes(must),matchedPostContainers:matched,rawMatchedPostContainers:rawMatched,detailFallbackMatched,preOpenCommentButtons:preOpenCommentButtons.length,inContainerCommentBoxes:inputs.length,inContainerCommentButtons:submitButtons.length,pass,preview:clean((container?.innerText||document.body.innerText||'').slice(0,1500))};
  })()`;
  const r=await send(ws,'Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
  const v=r.result?.result?.value || r.result?.value || {pass:false,error:r.result?.exceptionDetails?.text||'no result'};
  console.log(JSON.stringify(v,null,2)); ws.close(); if(!v?.pass) process.exit(1);
}
main().catch(e=>{console.error(e.stack||e.message); process.exit(1)});
