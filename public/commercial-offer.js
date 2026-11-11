const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
export function renderCommercialOffer(offer,root=document){
 const text=(selector,value)=>{const node=root.querySelector(selector);if(node)node.textContent=value;};
 for(const link of root.querySelectorAll('a[href="/condicoes.html"]'))link.setAttribute('href','/condicoes-lotes.html');
 const title=offer.available?offer.title:'MEI Sem Erros · novas adesões indisponíveis';
 text('.offer-tag',title);text('.offer-intro .eyebrow',title);text('.final-cta .button','Conhecer a oferta atual ↑');
 for(const node of root.querySelectorAll('.faq-list details'))if(/147|renovação|100 vagas|três anos/i.test(node.textContent))node.hidden=true;
 if(!offer.available){text('.hero .micro','Consulte a disponibilidade de novas adesões');text('.price-card .price','Indisponível');text('.card-price','Nenhum lote habilitado no momento');text('.renewal','As condições de quem já contratou são preservadas.');text('.price-description','Novas vendas dependem de habilitação do responsável.');text('.offer-intro p:not(.eyebrow)','As vagas anteriores permanecem vinculadas aos contratos já confirmados.');}
 else{
 text('.hero .micro','12 meses por '+money(offer.prices.initial_pix)+' no Pix · 30 dias de garantia · Sem cobrança automática');
 text('.price-card .price',money(offer.prices.initial_pix));text('.card-price','No cartão à vista: '+money(offer.prices.initial_card));
 text('.price-description','Pagamento único anual no Pix ou cartão à vista. Sem renovação automática.');
 text('.offer-intro p:not(.eyebrow)',title+': posições '+offer.positions_from+' a '+offer.positions_to+'. Sua posição é atribuída após pagamento confirmado, sem reutilização após estorno.');
 text('.renewal','Depois de 12 meses, a renovação é opcional e não há cobrança automática. Consulte as condições do lote.');
 }
 for(const node of root.querySelectorAll('.price-card .terms-line'))if(node.textContent.includes('limitada a 100'))node.textContent='A oferta exibida depende do lote habilitado. Condições já contratadas são preservadas; nenhum novo lote será vendido sem habilitação.';
 for(const node of root.querySelectorAll('.check-list li'))if(node.textContent.includes('Suporte exclusivo'))node.textContent='Suporte do MEI Sem Erros';
}
