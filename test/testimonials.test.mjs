import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import testimonials from '../api/testimonials.js';
test('proxy: publica apenas campos da vitrine, sem cache e fecha em caso de erro',async()=>{
 const original=globalThis.fetch;try{
  const headers={},res={setHeader:(key,value)=>{headers[key]=value;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  globalThis.fetch=async(url,opts)=>{assert.equal(url,'https://app.meisemerros.com.br/api/testimonials');assert.equal(opts.cache,'no-store');return Response.json({testimonials:[{id:'public-id',rating:1,message:'Minha experiência.',first_name:'Ana',activity:'Eletricista',email:'private@example.test',user_id:'private'}]});};
  await testimonials({method:'GET'},res);assert.equal(res.code,200);assert.equal(headers['Cache-Control'],'no-store');assert.deepEqual(Object.keys(res.body.testimonials[0]).sort(),['id','rating','message','first_name','activity'].sort());
  globalThis.fetch=async()=>{throw Error('offline');};await testimonials({method:'GET'},res);assert.equal(res.code,503);assert.deepEqual(res.body.testimonials,[]);
  await testimonials({method:'POST'},res);assert.equal(res.code,405);
 }finally{globalThis.fetch=original;}
});
test('vitrine: usa texto seguro, atualiza revogação e distingue seleção de média',async()=>{
 const js=await readFile(new URL('../public/testimonials.js',import.meta.url),'utf8'),html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
 assert.ok(js.includes('textContent=row.message'));assert.ok(!js.includes('innerHTML'));assert.ok(js.includes('30000'));assert.ok(js.includes('section.hidden=true'));assert.ok(html.includes('não representam uma média'));assert.ok(html.includes('type="module" src="/testimonials.js"'));
});
