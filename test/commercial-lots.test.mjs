import {test} from 'node:test';
import assert from 'node:assert/strict';
import {currentOffer} from '../api/offer.js';
import checkout from '../api/checkout.js';
import {renderCommercialOffer} from '../public/commercial-offer.js';
test('lotes comerciais: apenas oferta habilitada e validada; nenhum preco 10K presumido',async()=>{
 const previous=process.env.COMMERCIAL_LOTS_ENABLED,link=process.env.FOUNDER_LINK_ENABLED,original=globalThis.fetch;
 try{
 process.env.COMMERCIAL_LOTS_ENABLED='true';process.env.FOUNDER_LINK_ENABLED='true';let available=true,code='clube_mil',price=19700;
 globalThis.fetch=async()=>Response.json({available,commercial:true,code,lot_id:'12345678-1234-4234-8234-123456789abc',title:'Clube Mil',positions_from:101,positions_to:1000,prices:{initial_pix:price,initial_card:price===null?null:24700,renewal_1:29700,renewal_2:29880},terms_version:'commercial-v1-2026-11-01'});
 const offer=await currentOffer();assert.equal(offer.available,true);assert.equal(offer.prices.initial_pix,19700);
 const res={status(n){this.code=n;return this;},json(data){this.body=data;return this;},setHeader(){}};await checkout({method:'POST'},res);assert.equal(res.body.url,'https://app.meisemerros.com.br/assinatura');
 available=false;assert.equal((await currentOffer()).available,false);available=true;price=null;assert.equal((await currentOffer()).available,false);price=19700;code='clube_10k';assert.equal((await currentOffer()).available,false);
 }finally{globalThis.fetch=original;for(const [key,value] of Object.entries({COMMERCIAL_LOTS_ENABLED:previous,FOUNDER_LINK_ENABLED:link})){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
test('pagina comercial: precos e renovacoes do lote, sem HTML recebido e sem Fundador indevido',()=>{
 const nodes=new Map();const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{textContent:'',setAttribute(){}});return nodes.get(selector);};
 const terms={textContent:'Oferta limitada a 100 fundadores'},faq={textContent:'Quando acabam as 100 vagas?',hidden:false};
 const root={querySelector:node,querySelectorAll:selector=>selector==='.faq-list details'?[faq]:selector==='.price-card .terms-line'?[terms]:[]};
 renderCommercialOffer({available:true,title:'Clube Mil',positions_from:101,positions_to:1000,prices:{initial_pix:19700,initial_card:24700,renewal_1:29700,renewal_2:29880}},root);
 assert.match(node('.price-card .price').textContent,/197/);assert.match(node('.card-price').textContent,/247/);assert.match(node('.renewal').textContent,/297/);assert.equal(faq.hidden,true);assert.ok(!terms.textContent.includes('limitada a 100'));
 renderCommercialOffer({available:false},root);assert.equal(node('.price-card .price').textContent,'Indisponível');
});
