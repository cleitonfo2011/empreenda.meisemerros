import { isAvailable } from './offer.js';

export default async function checkout(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  if (await isAvailable()) return res.status(200).json({ url: 'https://app.meisemerros.com.br/fundadores?oferta=fundador' });
  return res.status(503).json({ error: 'O Plano Fundadores está indisponível no momento. A oferta é limitada às primeiras 100 vagas. Nenhum outro plano está à venda nesta página.' });
}
