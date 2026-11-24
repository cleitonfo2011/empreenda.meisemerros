import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
test('link de indicação passa apenas código válido ao domínio fixo do aplicativo',()=>{
 for(const [ref,expected] of [['v'+'a'.repeat(32),true],['i'+'b'.repeat(32),true],['https://evil.test',false],['<script>',false],['',false]]){
  const redirects=[];
  runInNewContext(source,{document:{querySelector:()=>null},URL,encodeURIComponent,window:{location:{href:'https://empreenda.meisemerros.com.br/?ref='+encodeURIComponent(ref),replace:value=>redirects.push(value)}}});
  assert.equal(redirects.length,expected?1:0);
  if(expected)assert.equal(redirects[0],'https://app.meisemerros.com.br/api/referrals/capture?ref='+ref);
 }
});

test('a página só mostra o quadro após o app confirmar a oferta', async () => {
 for (const available of [true, false]) {
  const panel = {hidden:true};
  let finish;
  runInNewContext(source,{
   document:{querySelector:selector=>selector==='#teste-gratis'?panel:null},
   URL, window:{location:{href:'https://empreenda.meisemerros.com.br/'}},
   fetch:(url,options)=>{
    assert.equal(url,'https://app.meisemerros.com.br/api/referrals/bind');
    assert.equal(options.credentials,'include');
    return new Promise(resolve=>{finish=resolve;});
   },
  });
  assert.equal(panel.hidden,true);
  finish({ok:true,json:async()=>({trialAvailable:available,referralPresent:true,durationDays:15})});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(panel.hidden,!available);
 }
});

test('admin duration, public fallback and paused seller are reflected without granting access',async()=>{
 for(const days of [7,15,30]){
  for(const referralPresent of [false,true]){
   const panel={hidden:true},label={textContent:''},urls=[];
   runInNewContext(source,{document:{querySelector:s=>s==='#teste-gratis'?panel:null,querySelectorAll:selector=>selector==='[data-trial-days]'?[label]:[]},
    URL,window:{location:{href:'https://empreenda.meisemerros.com.br/'}},
    fetch:async url=>{urls.push(url);return {ok:true,json:async()=>url.endsWith('/bind')?
      {referralPresent,trialAvailable:true,durationDays:days}:{available:true,revision:1,durationDays:days}};}});
   await new Promise(resolve=>setImmediate(resolve));
   assert.equal(panel.hidden,false);assert.equal(label.textContent,String(days));
   assert.equal(urls.length,referralPresent?1:2);
  }
 }
 const panel={hidden:true},urls=[];
 runInNewContext(source,{document:{querySelector:s=>s==='#teste-gratis'?panel:null},URL,
  window:{location:{href:'https://empreenda.meisemerros.com.br/'}},
  fetch:async url=>{urls.push(url);return {ok:true,json:async()=>({referralPresent:true,trialAvailable:false,durationDays:null})};}});
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(panel.hidden,true);assert.equal(urls.length,1);
});
