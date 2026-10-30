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
