// Navegação acessível do carrossel de funcionalidades; não interfere no checkout.
const carousel = document.querySelector('#module-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.module-slide')];
  const prev = document.querySelector('.module-carousel-prev');
  const next = document.querySelector('.module-carousel-next');
  const count = document.querySelector('.module-carousel-count');
  let current = 0;
  function update() {
    const midpoint = carousel.scrollLeft + carousel.clientWidth / 2;
    let nearest = 0, distance = Infinity;
    slides.forEach((slide, index) => {
      const center = slide.offsetLeft - carousel.offsetLeft + slide.offsetWidth / 2;
      const d = Math.abs(center - midpoint);
      if (d < distance) { distance = d; nearest = index; }
    });
    current = nearest;
    count.textContent = (current + 1) + ' de ' + slides.length;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }
  function go(index) {
    if (!slides[index]) return;
    carousel.scrollTo({ left: slides[index].offsetLeft - carousel.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  carousel.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
