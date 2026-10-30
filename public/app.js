const button = document.querySelector('.checkout-button');
const status = document.querySelector('.checkout-status');

// O aplicativo registra a indicação em cookie próprio e retorna à página limpa.
// Nenhum identificador de cliente ou credencial é enviado na URL.
const referralCode = new URL(window.location.href || 'https://empreenda.meisemerros.com.br/').searchParams.get('ref');
if (referralCode && /^v[0-9a-f]{32}$/.test(referralCode)) {
  window.location.replace('https://app.meisemerros.com.br/api/referrals/capture?ref=' + encodeURIComponent(referralCode));
}

if (button && status) {
  fetch('/api/offer', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw new Error('offer');
    const offer = await response.json();
    if (offer.available === true) {
      button.disabled = false;
      button.firstChild.textContent = 'Quero ser fundador ';
      status.textContent = 'Entre na sua conta e escolha Pix ou cartão. O pagamento será realizado exclusivamente no checkout da Stripe.';
    } else {
      status.textContent = 'Plano Fundadores indisponível no momento. A oferta é limitada às primeiras 100 vagas. Suporte: contato@meisemerros.com.br.';
    }
  }).catch(() => {
    status.textContent = 'Não foi possível consultar a oferta agora. Tente novamente mais tarde.';
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Conferindo a vaga e preparando seu acesso ao pagamento pela Stripe…';
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await response.json();
      if (response.status === 503) {
        button.firstChild.textContent = 'Oferta indisponível ';
        status.textContent = data.error || 'Plano Fundadores indisponível no momento.';
        return;
      }
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
