import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
test('link de indicação passa apenas código válido ao domínio fixo do aplicativo',()=>{
 for(const [ref,expected] of [['v'+'a'.repeat(32),true],['https://evil.test',false],['<script>',false],['',false]]){
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
  finish({ok:true,json:async()=>({trialAvailable:available})});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(panel.hidden,!available);
 }
});
