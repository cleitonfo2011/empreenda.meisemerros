import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import checkout from '../api/checkout.js';

const client = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
async function clientFlow(available, checkoutResponse) {
  let click;
  const redirects = [];
  const button = { disabled: true, firstChild: { textContent: '' }, addEventListener: (_, fn) => { click = fn; } };
  const status = { textContent: '' };
  runInNewContext(client, {
    document: { querySelector: selector => selector === '.checkout-button' ? button : status },
    fetch: async path => path === '/api/offer' ? { ok: true, json: async () => ({ available }) } : checkoutResponse,
    URL,
    window: { location: { assign: url => redirects.push(url) } },
  });
  await new Promise(resolve => setImmediate(resolve));
  return { button, status, redirects, click: () => click() };
}

test('compra usa somente o fluxo autenticado dos fundadores', async () => {
  const ui = await clientFlow(true, { ok: true, status: 200, json: async () => ({ url: 'https://app.meisemerros.com.br/fundadores?oferta=fundador' }) });
  assert.equal(ui.button.disabled, false);
  assert.match(ui.status.textContent, /exclusivamente no checkout da Stripe/);
  await ui.click();
  assert.deepEqual(ui.redirects, ['https://app.meisemerros.com.br/fundadores?oferta=fundador']);
});

test('indisponibilidade e respostas malformadas não habilitam compras', async () => {
  for (const value of [false, 'true', 'false', 1, undefined]) {
    const ui = await clientFlow(value);
    assert.equal(ui.button.disabled, true);
    assert.deepEqual(ui.redirects, []);
  }
});

test('vaga indisponível entre consulta e clique mantém compra bloqueada', async () => {
  const ui = await clientFlow(true, { ok: false, status: 503, json: async () => ({ error: 'Plano Fundadores indisponível.' }) });
  await ui.click();
  assert.equal(ui.button.disabled, true);
  assert.deepEqual(ui.redirects, []);
});

test('não redireciona para outro plano ou destino recebido na resposta', async () => {
  for (const url of ['https://app.meisemerros.com.br/planos', 'https://example.com/fundadores', 'http://app.meisemerros.com.br/fundadores']) {
    const ui = await clientFlow(true, { ok: true, status: 200, json: async () => ({ url }) });
    await ui.click();
    assert.deepEqual(ui.redirects, []);
    assert.match(ui.status.textContent, /inválido/);
  }
});

test('servidor reconfere disponibilidade a cada tentativa sem oferecer substituto', async t => {
  const originalFetch = globalThis.fetch;
  const originalLink = process.env.FOUNDER_LINK_ENABLED;
  const originalReady = process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY;
  process.env.FOUNDER_LINK_ENABLED = 'true';
  process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY = 'true';
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({ FOUNDER_LINK_ENABLED: originalLink, FOUNDER_PAYMENT_METHOD_PRICING_READY: originalReady })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  let calls = 0;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ available: ++calls === 1 }) });
  const invoke = async () => {
    let result;
    const response = { setHeader() {}, status(code) { this.code = code; return this; }, json(body) { result = { code: this.code, body }; } };
    await checkout({ method: 'POST' }, response);
    return result;
  };
  assert.equal((await invoke()).body.url, 'https://app.meisemerros.com.br/fundadores?oferta=fundador');
  const unavailable = await invoke();
  assert.equal(unavailable.code, 503);
  assert.equal(unavailable.body.url, undefined);
  assert.equal(calls, 2);
});
