const button = document.querySelector('.checkout-button');
const status = document.querySelector('.checkout-status');
const checkoutLabel = 'Garantir minha vaga de fundador →';
const track = (name) => {
  if (typeof window.gtag === 'function') window.gtag('event', name);
  if (typeof window.fbq === 'function') window.fbq('trackCustom', name);
};
document.querySelector('.hero-copy > .button')?.addEventListener('click', () => track('cta_hero_click'));
document.querySelector('.checkout-button')?.addEventListener('click', () => track('cta_preco_click'));
document.querySelector('#demo video')?.addEventListener('play', () => track('demo_video_play'));
document.querySelectorAll('a[href*="app.meisemerros.com.br/fundadores"]').forEach(link => link.addEventListener('click', () => track('login_inicio')));
const sticky = document.querySelector('.mobile-sticky-cta');
const hero = document.querySelector('.hero');
const offerSection = document.querySelector('#fundadores');
const updateSticky = () => {
  if (!sticky || !hero || !offerSection) return;
  sticky.hidden = !(window.matchMedia('(max-width: 760px)').matches && hero.getBoundingClientRect().bottom < 0 && offerSection.getBoundingClientRect().top > window.innerHeight);
};
window.addEventListener('scroll', updateSticky, { passive: true });
window.addEventListener('resize', updateSticky);
updateSticky();
const demo = document.querySelector('#demo');
if (demo) Promise.all(['/assets/demo.mp4', '/assets/demo-poster.jpg'].map(path => fetch(path, { method: 'HEAD' }))).then(([video, poster]) => { if (video.ok && poster.ok && (video.headers.get('content-type') || '').includes('video') && (poster.headers.get('content-type') || '').startsWith('image/')) demo.hidden = false; }).catch(() => {});


// O aplicativo registra a indicação em cookie próprio e retorna à página limpa.
// Nenhum identificador de cliente ou credencial é enviado na URL.
const referralCode = new URL(window.location.href || 'https://empreenda.meisemerros.com.br/').searchParams.get('ref');
if (referralCode && /^v[0-9a-f]{32}$/.test(referralCode)) {
  window.location.replace('https://app.meisemerros.com.br/api/referrals/capture?ref=' + encodeURIComponent(referralCode));
}

const trialOffer = document.querySelector('#teste-gratis');
if (trialOffer && !referralCode) {
  fetch('https://app.meisemerros.com.br/api/referrals/bind', { credentials: 'include', cache: 'no-store' })
    .then(async response => {
      if (response.ok && (await response.json()).trialAvailable === true) trialOffer.hidden = false;
    })
    .catch(() => {});
}

if (button && status) {
  fetch('/api/offer', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw new Error('offer');
    const offer = await response.json();
    if(offer.commercial===true){const {renderCommercialOffer}=await import('./commercial-offer.js');renderCommercialOffer(offer);}
    if (offer.available === true) {
      button.disabled = false;
      button.textContent = offer.commercial ? 'Contratar '+offer.title+' →' : checkoutLabel;
      status.textContent = 'Entre na sua conta e escolha Pix ou cartão. O pagamento será realizado exclusivamente no checkout da Stripe.';
    } else {
      button.textContent = 'Entrar na lista de espera'; button.disabled = false; button.dataset.waitlist = 'true'; status.textContent = 'Oferta indisponível no momento.';
    }
  }).catch(() => {
    status.textContent = 'Não conseguimos abrir o pagamento. Tente de novo ou fale com a gente no WhatsApp.'; button.textContent = checkoutLabel; button.disabled = false;
  });
  button.addEventListener('click', async () => {
    if (button.dataset.waitlist === 'true') { document.querySelector('.waitlist').hidden = false; document.querySelector('.waitlist a')?.focus(); return; }
    button.disabled = true;
    button.textContent = 'Carregando…';
    status.textContent = '';
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await response.json();
      if (response.status === 503) {
        button.textContent = 'Entrar na lista de espera'; button.disabled = false; button.dataset.waitlist = 'true';
        status.textContent = data.error || 'Plano Fundadores indisponível no momento.';
        return;
      }
      if (!response.ok || !data.url) throw new Error(data.error || 'Não foi possível abrir o checkout.');
      const target = new URL(data.url);
      if (target.protocol !== 'https:' || target.hostname !== 'app.meisemerros.com.br' || !['/fundadores','/assinatura'].includes(target.pathname)) throw new Error('Endereço de acesso inválido.');
      track('login_inicio');
      window.location.assign(target.href);
    } catch (error) {
      status.textContent = 'Não conseguimos abrir o pagamento. Tente de novo ou fale com a gente no WhatsApp.';
      button.textContent = checkoutLabel;
      button.disabled = false;
    }
  });
}
