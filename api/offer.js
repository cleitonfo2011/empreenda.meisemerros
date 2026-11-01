export async function isAvailable() {
  if (process.env.FOUNDER_LINK_ENABLED !== 'true' || process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY !== 'true') return false;
  try {
    const response = await fetch('https://app.meisemerros.com.br/api/founder-offer', { signal: AbortSignal.timeout(5000), cache: 'no-store' });
    if (!response.ok) return false;
    return (await response.json()).available === true;
  } catch { return false; }
}

export async function currentOffer(){
 if(process.env.COMMERCIAL_LOTS_ENABLED!=='true')return {available:await isAvailable(),currency:'BRL',amount:14700,amounts:{pix:14700,card:24700},months:12};
 if(process.env.FOUNDER_LINK_ENABLED!=='true')return {available:false,commercial:true};
 try{
  const response=await fetch('https://app.meisemerros.com.br/api/commercial-offer',{signal:AbortSignal.timeout(5000),cache:'no-store'});if(!response.ok)throw Error('unavailable');
  const data=await response.json(),ranges={founders:[1,100],clube_mil:[101,1000],clube_10k:[1001,10000]};
  if(data.available!==true)return {available:false,commercial:true};
  if(!ranges[data.code]||data.positions_from!==ranges[data.code][0]||data.positions_to!==ranges[data.code][1]||typeof data.title!=='string'||data.title.length>80||typeof data.lot_id!=='string'||!/^[a-f0-9-]{36}$/i.test(data.lot_id)||data.terms_version!=='commercial-v1-2026-11-01')throw Error('invalid_offer');
  const prices={};for(const key of ['initial_pix','initial_card','renewal_1','renewal_2']){if(!Number.isInteger(data.prices?.[key])||data.prices[key]<1||data.prices[key]>99999999)throw Error('invalid_price');prices[key]=data.prices[key];}
  return {available:true,commercial:true,code:data.code,title:data.title,positions_from:data.positions_from,positions_to:data.positions_to,prices,months:12,terms_version:data.terms_version};
 }catch{return {available:false,commercial:true};}
}
export default async function offer(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(await currentOffer());
}
