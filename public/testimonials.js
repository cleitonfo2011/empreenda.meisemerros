const section=document.querySelector('#depoimentos');
const list=document.querySelector('#depoimentos-lista');
let signature='';let loading=false;
export function testimonialCard(row,doc=document){
 const card=doc.createElement('article');card.className='testimonial-card';
 const stars=doc.createElement('p');stars.className='testimonial-stars';stars.setAttribute('aria-label',`Nota ${row.rating} de 5`);stars.textContent='★'.repeat(row.rating)+'☆'.repeat(5-row.rating);
 const quote=doc.createElement('blockquote');quote.textContent=row.message;
 const author=doc.createElement('p');author.className='testimonial-author';author.textContent=row.first_name;
 const activity=doc.createElement('p');activity.textContent=row.activity;
 card.append(stars,quote,author,activity);return card;
}
async function refreshTestimonials(){
 if(!section||!list||loading||document.hidden)return;loading=true;
 try{
  const res=await fetch('/api/testimonials',{cache:'no-store'});if(!res.ok)throw Error('unavailable');const body=await res.json();if(!Array.isArray(body.testimonials))throw Error('invalid');
  const rows=body.testimonials,serialized=JSON.stringify(rows);
  if(serialized!==signature){list.replaceChildren(...rows.map(row=>testimonialCard(row)));signature=serialized;}
  section.hidden=rows.length===0;
 }catch{section.hidden=true;list.replaceChildren();signature='';}finally{loading=false;}
}
if(section&&list){void refreshTestimonials();setInterval(()=>void refreshTestimonials(),30000);window.addEventListener('focus',()=>void refreshTestimonials());document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshTestimonials();});}
