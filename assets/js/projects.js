// Projects page: each chapter is a 3D scene (photo card, depth card and the
// brand object from the home reel). It swings in once, tilts with the pointer,
// and its objects only bob while on screen.
(() => {
  const scenes = [...document.querySelectorAll('.p3d')];
  if (!scenes.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-p3d');
  if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => s.classList.add('is-in')); return; }
  const inIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); inIO.unobserve(e.target); }
  }), { threshold: .25 });
  const liveIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)));
  scenes.forEach((s) => { inIO.observe(s); liveIO.observe(s); });
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  scenes.forEach((s) => {
    const stage = s.querySelector('.p3d__stage'), scene = s.querySelector('.p3d__scene'), card = s.querySelector('.p3d__card');
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      stage.classList.add('is-tilt');
      scene.style.setProperty('--ry', `${(x * 16).toFixed(2)}deg`);
      scene.style.setProperty('--rx', `${(7 - y * 10).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${((x + .5) * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${((y + .5) * 100).toFixed(1)}%`);
    });
    stage.addEventListener('pointerleave', () => {
      stage.classList.remove('is-tilt');
      scene.style.removeProperty('--ry'); scene.style.removeProperty('--rx');
    });
  });
})();
