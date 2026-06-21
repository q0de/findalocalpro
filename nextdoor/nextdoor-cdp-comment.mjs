#!/usr/bin/env node
import http from 'node:http';
const args=process.argv.slice(2); const get=k=>{const i=args.indexOf(k); return i>=0?args[i+1]:''};
const CDP=process.env.CDP_HTTP||'http://127.0.0.1:18802';
const rawTargetUrl=get('--target-url'), targetAuthor=get('--target-author'), mustContain=get('--must-contain'), near=get('--near')||mustContain, comment=get('--comment');
const targetUrl=normalizeDetailUrl(rawTargetUrl);
const shouldSubmit=args.includes('--submit');
if(!args.includes('draft')||!rawTargetUrl||!targetAuthor||!mustContain||!comment){console.error('missing draft/target/comment args'); process.exit(2)}
if(shouldSubmit && process.env.NEXTDOOR_SUBMIT_UNLOCK!=='shaquille-approved-after-harness'){console.error('submit locked'); process.exit(2)}
if(comment.includes('—')){console.error('blocked: em dash in comment'); process.exit(2)}
const pestAnimalBlockRe=/\b(wildlife|animal\s+removal|animal\s+control|birds?|bats?|raccoons?|squirrels?|chipmunks?|skunks?|opossums?|possums?|coyotes?|rabbits?|bunn(?:y|ies)|deer|groundhogs?|moles?|voles?|snakes?|mouse|mice|rats?|rodents?|humane|no[- ]?kill)\b/i;
const pestIntentRe=/\b(pest|exterminator|pest[_ -]?control|bug|bugs|insect|insects)\b/i;
const safetyText=[mustContain,near,comment].filter(Boolean).join(' ');
if(pestIntentRe.test(safetyText)&&pestAnimalBlockRe.test(safetyText)){console.error('blocked: pest coverage is bugs/insects only; animal removal/wildlife/rodent request detected'); process.exit(3)}
function normalizeDetailUrl(raw){try{const u=new URL(raw); if(u.hostname.endsWith('nextdoor.com')&&u.pathname.startsWith('/p/')&&!u.searchParams.has('view')) u.searchParams.set('view','detail'); return u.toString()}catch{return raw}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function jget(url){return new Promise((res,rej)=>http.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{try{res(JSON.parse(d))}catch(e){rej(e)}})}).on('error',rej))}
async function tab(){const tabs=await jget(`${CDP}/json/list`); return tabs.find(t=>(t.url||'').includes('nextdoor.com'))||tabs.find(t=>t.type==='page')||tabs[0]}
let id=1; async function send(ws,method,params={}){const my=id++; ws.send(JSON.stringify({id:my,method,params})); while(true){const msg=JSON.parse(await new Promise((resolve,reject)=>{const onMsg=e=>{cleanup(); resolve(typeof e.data==='string'?e.data:Buffer.from(e.data).toString())}; const onErr=e=>{cleanup(); reject(e)}; const cleanup=()=>{ws.removeEventListener('message',onMsg); ws.removeEventListener('error',onErr)}; ws.addEventListener('message',onMsg); ws.addEventListener('error',onErr)})); if(msg.id===my) return msg}}
function workflowExpr({typeText=false, submit=false}={}){return `(async()=>{
  const targetUrl=${JSON.stringify(targetUrl)}, targetAuthor=${JSON.stringify(targetAuthor)}, must=${JSON.stringify(mustContain)}, comment=${JSON.stringify(comment)}, typeText=${JSON.stringify(typeText)}, doSubmit=${JSON.stringify(submit)};
  const clean=s=>String(s||'').replace(/\\s+/g,' ').trim(); const norm=s=>clean(s).toLowerCase();
  const bodyText=clean(document.body?.innerText||''); const stableTarget=targetUrl.split('?')[0];
  const urlOk=location.href.split('?')[0]===stableTarget; const postId=(stableTarget.split('/p/')[1]||'').split('/')[0].split('?')[0].split('#')[0]; const postIdOk=location.href.includes('/p/'+postId);
  const detailPage=/post details/i.test(bodyText)||/Back to newsfeed/i.test(bodyText)||location.search.includes('view=detail');
  const visible=el=>{const r=el.getBoundingClientRect(); const cs=getComputedStyle(el); return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0;};
  const exactCommentButtons=()=>[...document.querySelectorAll('button,[role="button"]')].filter(el=>{const txt=norm(el.getAttribute('aria-label')||el.innerText||''); const r=el.getBoundingClientRect(); return txt==='comment' && r.width>15 && r.height>10 && !el.disabled && el.getAttribute('aria-disabled')!=='true';});
  const inputs=()=>[...document.querySelectorAll('textarea,input[type="text"],[contenteditable="true"],[role="textbox"]')].filter(el=>{const hint=norm(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.textContent||''); return visible(el) && (hint.includes('comment')||hint.includes('reply')||el.matches('[contenteditable="true"],[role="textbox"]'));});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let hit=null; while(walker.nextNode()){if((walker.currentNode.nodeValue||'').includes(must)){hit=walker.currentNode.parentElement; break;}}
  const chain=[]; for(let e=hit;e&&e!==document.body;e=e.parentElement){const text=clean(e.innerText||e.textContent||''); const r=e.getBoundingClientRect(); if(text.includes(targetAuthor)&&text.includes(must)&&r.width>250&&r.height>60) chain.push({e,text});}
  const rawMatched=(chain.map(x=>x.e).filter(e=>!chain.some(y=>y.e!==e&&e.contains(y.e))).length)||chain.length;
  const container=(chain.find(x=>/Add a comment/i.test(x.text))||chain[0])?.e;
  const preOpenCommentButtons=exactCommentButtons();
  if(container){const add=[...container.querySelectorAll('button,[role="button"],textarea,[contenteditable="true"],div')].find(el=>/add a comment/i.test(clean(el.innerText||el.getAttribute('aria-label')||el.getAttribute('placeholder')||'')) && visible(el)); if(add){add.scrollIntoView({block:'center'}); add.click(); await new Promise(r=>setTimeout(r,900));}}
  else if(detailPage && bodyText.includes(targetAuthor) && bodyText.includes(must) && preOpenCommentButtons.length===1){preOpenCommentButtons[0].scrollIntoView({block:'center'}); preOpenCommentButtons[0].click(); await new Promise(r=>setTimeout(r,900));}
  let foundInputs=inputs();
  let submitButtons=exactCommentButtons().filter(visible);
  const detailFallbackMatched=detailPage && rawMatched===0 && bodyText.includes(targetAuthor) && bodyText.includes(must) && preOpenCommentButtons.length===1 && foundInputs.length===1 && submitButtons.length>=1;
  const matched=detailFallbackMatched?1:rawMatched;
  const safe=!!(urlOk&&postIdOk&&bodyText.includes(targetAuthor)&&bodyText.includes(must)&&matched===1&&foundInputs.length===1&&submitButtons.length>=1&&submitButtons.length<=2);
  let input=foundInputs[0]; let typed=false; let submitted=false;
  if(safe && typeText && input){
    input.scrollIntoView({block:'center'}); input.focus();
    if(input.matches('textarea,input')){const proto=Object.getPrototypeOf(input); const desc=Object.getOwnPropertyDescriptor(proto,'value')||Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')||Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value'); if(desc?.set) desc.set.call(input, comment); else input.value=comment;}
    else input.textContent=comment;
    input.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:comment})); input.dispatchEvent(new Event('change',{bubbles:true}));
    await new Promise(r=>setTimeout(r,700));
    foundInputs=inputs(); input=foundInputs.find(el=>((el.value||el.innerText||el.textContent||'')===comment)) || input;
    typed=((input.value||input.innerText||input.textContent||'')===comment);
  }
  submitButtons=exactCommentButtons().filter(visible);
  const form=input?.closest('form'); const formSubmit=form?[...form.querySelectorAll('button,[role="button"]')].filter(el=>norm(el.getAttribute('aria-label')||el.innerText||'')==='comment'&&!el.disabled&&el.getAttribute('aria-disabled')!=='true'):[];
  const finalButton=formSubmit[0] || submitButtons[submitButtons.length-1];
  if(safe && typed && doSubmit && finalButton){finalButton.click(); submitted=true; await new Promise(r=>setTimeout(r,2500));}
  const afterText=clean(document.body?.innerText||'');
  const r=input?input.getBoundingClientRect():null; const br=finalButton?finalButton.getBoundingClientRect():null;
  return {href:location.href,urlOk,postIdOk,targetAuthor,mustContain:must,bodyHasAuthor:bodyText.includes(targetAuthor),bodyHasPhrase:bodyText.includes(must),matchedPostContainers:matched,rawMatchedPostContainers:rawMatched,detailFallbackMatched,preOpenCommentButtons:preOpenCommentButtons.length,inContainerCommentBoxes:foundInputs.length,inContainerCommentButtons:submitButtons.length,pass:safe,typed,submitted,commentPresent:afterText.includes(comment)||typed,inputText:clean(input?.value||input?.innerText||input?.textContent||''),inputRect:r?{x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height}:null,buttonRect:br?{x:br.x+br.width/2,y:br.y+br.height/2,w:br.width,h:br.height}:null,preview:clean((container?.innerText||document.body.innerText||'').slice(0,1200))};
})()`}
async function main(){
 const t=await tab(); if(!t) throw new Error('no cdp tab'); const ws=new WebSocket(t.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true}); ws.addEventListener('error',reject,{once:true})});
 await send(ws,'Page.enable'); await send(ws,'Runtime.enable'); await send(ws,'Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
 await send(ws,'Page.navigate',{url:targetUrl}); await wait(6500);
 const pre=(await send(ws,'Runtime.evaluate',{expression:workflowExpr({typeText:false,submit:false}),returnByValue:true,awaitPromise:true})).result?.result?.value;
 if(!pre?.pass){console.log(JSON.stringify({stage:'preflight',...pre},null,2)); ws.close(); process.exit(1)}
 const typed=(await send(ws,'Runtime.evaluate',{expression:workflowExpr({typeText:true,submit:shouldSubmit}),returnByValue:true,awaitPromise:true})).result?.result?.value;
 console.log(JSON.stringify({submitted:shouldSubmit,pre,typed,done:{href:typed?.href,commentPresent:typed?.commentPresent}},null,2));
 ws.close(); if(!typed?.pass || !typed?.typed || (shouldSubmit && !typed?.commentPresent)) process.exit(1);
}
main().catch(e=>{console.error(e.stack||e.message); process.exit(1)});
