export default async function testimonials(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'&&req.method!=='HEAD')return res.status(405).json({testimonials:[]});
 try{
  const response=await fetch('https://app.meisemerros.com.br/api/testimonials',{cache:'no-store',signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw Error('unavailable');const data=await response.json();
  if(!Array.isArray(data.testimonials))throw Error('invalid_data');
  const rows=data.testimonials.slice(0,12).filter(r=>r&&typeof r.id==='string'&&Number.isInteger(r.rating)&&r.rating>=1&&r.rating<=5&&typeof r.message==='string'&&r.message.length<=2000&&typeof r.first_name==='string'&&r.first_name.length<=40&&typeof r.activity==='string'&&r.activity.length<=80).map(({id,rating,message,first_name,activity})=>({id,rating,message,first_name,activity}));
  return res.status(200).json({testimonials:rows});
 }catch{return res.status(503).json({testimonials:[]});}
}
