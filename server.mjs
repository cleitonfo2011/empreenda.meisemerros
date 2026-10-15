import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import offer from './api/offer.js';
import checkout from './api/checkout.js';

const root = resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };

export function makeServer() {
  return createServer(async (req, res) => {
    res.status = code => { res.statusCode = code; return res; };
    res.json = value => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(value)); };
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/offer') return offer(req, res);
      if (url.pathname === '/api/checkout') return checkout(req, res);
      if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).json({ error: 'Método não permitido.' });
      const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      const file = resolve(root, '.' + pathname);
      if (!file.startsWith(root + sep) && file !== resolve(root, 'index.html')) return res.status(403).json({ error: 'Acesso negado.' });
      const body = await readFile(file);
      res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
      res.statusCode = 200;
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      res.status(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400).json({ error: 'Página não encontrada.' });
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  makeServer().listen(port, '0.0.0.0', () => console.log(`Página em execução na porta ${port}.`));
}
