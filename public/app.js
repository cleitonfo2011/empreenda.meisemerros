const button = document.querySelector('.checkout-button');
const status = document.querySelector('.checkout-status');

if (button && status) {
  fetch('/api/offer').then(async response => {
    if (!response.ok) throw new Error('offer');
    const offer = await response.json();
    if (offer.available) {
      button.disabled = false;
      button.firstChild.textContent = 'Quero meus 12 meses por R$ 147 ';
      status.textContent = 'Entre na sua conta antes de pagar com segurança pela Stripe.';
    } else {
      status.textContent = 'Oferta indisponível no momento. Suporte: contato@meisemerros.com.br.';
    }
  }).catch(() => {
    status.textContent = 'Não foi possível consultar a oferta agora. Tente novamente mais tarde.';
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Preparando seu checkout seguro…';
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || 'Não foi possível abrir o checkout.');
      const target = new URL(data.url);
      if (target.protocol !== 'https:' || target.hostname !== 'app.meisemerros.com.br' || target.pathname !== '/fundadores') throw new Error('Endereço de acesso inválido.');
      window.location.assign(target.href);
    } catch (error) {
      status.textContent = error.message;
      button.disabled = false;
    }
  });
}
