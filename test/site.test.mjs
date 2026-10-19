import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { makeServer } from '../server.mjs';

test('página, recursos e barreira de vendas funcionam juntos', async t => {
  const oldLink = process.env.FOUNDER_LINK_ENABLED;
  const oldReady = process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY;
  process.env.FOUNDER_LINK_ENABLED = 'true';
  delete process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY;
  t.after(() => {
    if (oldLink === undefined) delete process.env.FOUNDER_LINK_ENABLED; else process.env.FOUNDER_LINK_ENABLED = oldLink;
    if (oldReady === undefined) delete process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY; else process.env.FOUNDER_PAYMENT_METHOD_PRICING_READY = oldReady;
  });
  const server = makeServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(base);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /12 meses por R\$ 147/);
  assert.match(html, /checkout-button[^>]*disabled/);
  assert.match(html, /30 dias/);
  assert.match(html, /R\$ 247,00/);
  assert.match(html, /À VISTA NO PIX/);
  assert.match(html, /Ou no cartão à vista/);
  assert.doesNotMatch(html, /anual regular de R\$ 197/);
  assert.match(html, /R\$ 298,80/);
  assert.match(html, /participantes do Plano Fundadores/);
  assert.doesNotMatch(html, /duas renovações anuais de R\$ 298,80/);
  for (const path of ['/styles.css', '/app.js', '/condicoes.html']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).length > 100);
  }
  const terms = await (await fetch(base + '/condicoes.html')).text();
  assert.match(terms, /R\$ 147,00 à vista no Pix ou R\$ 247,00 no cartão à vista/);
  const offer = await fetch(base + '/api/offer');
  assert.deepEqual(await offer.json(), { available: false, currency: 'BRL', amount: 14700, amounts: { pix: 14700, card: 24700 }, months: 12 });
  const checkout = await fetch(base + '/api/checkout', { method: 'POST' });
  assert.equal(checkout.status, 503);
  assert.match((await checkout.json()).error, /Plano Fundadores está indisponível/);
  assert.equal((await fetch(base + '/api/checkout')).status, 405);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await fetch(base + '/arquivo-inexistente')).status, 404);
});
