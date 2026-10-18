export async function isAvailable() {
  if (process.env.FOUNDER_LINK_ENABLED !== 'true' || process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY !== 'true') return false;
  try {
    const response = await fetch('https://app.meisemerros.com.br/api/founder-offer', { signal: AbortSignal.timeout(5000), cache: 'no-store' });
    if (!response.ok) return false;
    return (await response.json()).available === true;
  } catch { return false; }
}

export default async function offer(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ available: await isAvailable(), currency: 'BRL', amount: 14700, amounts: { pix: 14700, card: 24700 }, months: 12 });
}
