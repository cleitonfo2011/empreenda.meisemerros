const button = document.querySelector('.checkout-button');
const status = document.querySelector('.checkout-status');

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

const checkoutLabel = 'Garantir minha vaga de fundador →';
const checkoutError = 'Não conseguimos abrir o pagamento. Tente de novo ou fale com a gente no WhatsApp.';
const setCheckoutLabel = label => { if (button) button.textContent = label; };
let currentOffer = null;
if (button && status) {
  setCheckoutLabel('Carregando…');
  fetch('/api/offer', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw new Error('offer');
    const offer = await response.json();
    currentOffer = offer;
    if (offer.commercial === true) {
      const { renderCommercialOffer } = await import('./commercial-offer.js');
      renderCommercialOffer(offer);
    }
    if (offer.available === true) {
      button.disabled = false;
      setCheckoutLabel(offer.commercial ? 'Contratar ' + offer.title + ' →' : checkoutLabel);
      status.textContent = 'Pagamento seguro pela Stripe após entrar na sua conta.';
    } else if (offer.sold_out === true && offer.commercial !== true) {
      // A API atual não fornece sold_out. Não inferir esgotamento de available=false.
      button.hidden = true;
      const waitlist = document.querySelector('#waitlist');
      if (waitlist) waitlist.hidden = false;
      status.textContent = 'As vagas do Plano Fundadores foram preenchidas.';
    } else {
      button.disabled = true;
      setCheckoutLabel(checkoutLabel);
      status.textContent = 'Oferta indisponível no momento. Consulte novamente ou escreva para contato@meisemerros.com.br.';
    }
  }).catch(() => {
    button.disabled = true;
    setCheckoutLabel(checkoutLabel);
    status.textContent = 'Não conseguimos consultar a oferta agora. Tente novamente mais tarde.';
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    setCheckoutLabel('Carregando…');
    status.textContent = 'Preparando o acesso seguro ao pagamento…';
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await response.json();
      if (response.status === 503) {
        status.textContent = 'Oferta indisponível no momento. Tente novamente mais tarde.';
        setCheckoutLabel(checkoutLabel);
        return;
      }
      if (!response.ok || !data.url) throw new Error('checkout');
      const target = new URL(data.url);
      if (target.protocol !== 'https:' || target.hostname !== 'app.meisemerros.com.br' || !['/fundadores', '/assinatura'].includes(target.pathname)) throw new Error('invalid_url');
      trackLandingEvent('begin_login');
      window.location.assign(target.href);
    } catch {
      status.textContent = checkoutError + ' Contato: contato@meisemerros.com.br.';
      setCheckoutLabel(currentOffer?.commercial ? 'Contratar ' + currentOffer.title + ' →' : checkoutLabel);
      button.disabled = false;
    }
  });
}

function trackLandingEvent(eventName) {
  // Só usar integrações de analytics previamente configuradas; não instalar novos trackers.
  if (typeof window.gtag === 'function') window.gtag('event', eventName);
  if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName);
}
document.querySelectorAll('[data-analytics]').forEach(node => node.addEventListener('click', () => trackLandingEvent(node.dataset.analytics)));
document.querySelector('#demo-video')?.addEventListener('play', () => trackLandingEvent('demo_video_play'));

const stickyCta = document.querySelector('.mobile-sticky-cta');
const hero = document.querySelector('.hero');
const offerSection = document.querySelector('#fundadores');
if (stickyCta && hero && offerSection && 'IntersectionObserver' in window) {
  let heroVisible = true;
  let offerVisible = false;
  const refresh = () => { stickyCta.hidden = heroVisible || offerVisible; };
  const heroObserver = new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; refresh(); }, { threshold: 0 });
  const offerObserver = new IntersectionObserver(entries => { offerVisible = entries[0].isIntersecting; refresh(); }, { threshold: 0 });
  heroObserver.observe(hero);
  offerObserver.observe(offerSection);
  refresh();
}

// A seção só aparece quando o arquivo de vídeo está efetivamente publicado.
const demoSection = document.querySelector('#demo');
if (demoSection) {
  fetch('/assets/demo.mp4', { method: 'HEAD', cache: 'no-store' })
    .then(response => {
      if (response.ok && (response.headers.get('content-type') || '').includes('video/')) { demoSection.hidden = false; const link = document.querySelector('#hero-demo-link'); if (link) link.hidden = false; }
    })
    .catch(() => {});
}
