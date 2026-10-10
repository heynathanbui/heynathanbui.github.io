// Per-chapter animations on the Projects page:
// VNA = plane flight, Beer Hanoi = clinking beers + foam, Finder = magnifier sweep, Community = trophy + confetti.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(window.MotionPathPlugin);

  // Particle burst from an element's origin.
  function burst(host, { colors, n = 28, spread = 220, up = 160, round = false, size = [6, 12] }) {
    for (let k = 0; k < n; k++) {
      const p = document.createElement('i');
      const s = gsap.utils.random(size[0], size[1]);
      Object.assign(p.style, {
        width: `${s}px`, height: `${round ? s : s * gsap.utils.random(.35, .7)}px`,
        background: gsap.utils.random(colors), borderRadius: round ? '50%' : '2px',
      });
      host.appendChild(p);
      const a = gsap.utils.random(-Math.PI, 0), d = gsap.utils.random(spread * .35, spread);
      gsap.timeline({ onComplete: () => p.remove() })
        .set(p, { x: 0, y: 0, rotation: gsap.utils.random(0, 360) })
        .to(p, { x: Math.cos(a) * d, y: Math.sin(a) * d - gsap.utils.random(up * .3, up), rotation: '+=' + gsap.utils.random(180, 540), duration: .7, ease: 'power2.out' })
        .to(p, { y: '+=' + gsap.utils.random(140, 260), opacity: 0, duration: 1.1, ease: 'power1.in' }, '>-0.05');
    }
  }

  const onEnter = (el, fn) => ScrollTrigger.create({ trigger: el, start: 'top 72%', onEnter: fn, onEnterBack: fn });

  // Chapter 1: plane flies along a dotted arc across the photo.
  const flight = document.querySelector('.fx--flight');
  if (flight && window.MotionPathPlugin) {
    const path = flight.querySelector('path'), plane = flight.querySelector('.fx-plane');
    const len = path.getTotalLength();
    const tl = gsap.timeline({ paused: true })
      .set(path, { strokeDasharray: `2 10`, opacity: .9 })
      .fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
      .set(plane, { opacity: 1 }, 0)
      .to(plane, { duration: 2.4, ease: 'power2.inOut', motionPath: { path, align: path, autoRotate: true, alignOrigin: [.5, .5] } }, 0)
      .to(plane, { opacity: 0, duration: .3 }, '>-0.2')
      .to(path, { opacity: .35, duration: .6 }, '<');
    onEnter(flight.closest('.project'), () => tl.restart());
  }

  // Chapter 2: two beer mugs slide in, clink, and spray foam and gold confetti.
  const cheers = document.querySelector('.fx--cheers');
  if (cheers) {
    const l = cheers.querySelector('.mug--l'), r = cheers.querySelector('.mug--r'), b = cheers.querySelector('.burst');
    const tl = gsap.timeline({ paused: true })
      .fromTo(l, { x: -160, opacity: 0, rotation: -25 }, { x: 0, opacity: 1, rotation: 0, duration: .8, ease: 'back.out(1.6)' }, 0)
      .fromTo(r, { x: 160, opacity: 0, rotation: 25 }, { x: 0, opacity: 1, rotation: 0, duration: .8, ease: 'back.out(1.6)' }, 0)
      .to(l, { x: '+=60', rotation: 18, duration: .35, ease: 'power2.in' }, .9)
      .to(r, { x: '-=60', rotation: -18, duration: .35, ease: 'power2.in' }, .9)
      .add(() => {
        burst(b, { colors: ['#fffdf2', '#fff6dc', '#f7c95a'], n: 26, round: true, size: [6, 14], spread: 200, up: 220 });
        burst(b, { colors: ['#e0a43a', '#c9a43f', '#6b1f24', '#f6e3cb'], n: 22, spread: 260, up: 180 });
      }, 1.25)
      .to([l, r], { x: 0, rotation: 0, duration: 1, ease: 'elastic.out(1, .5)' }, 1.3);
    gsap.set(b, { top: '40%' });
    onEnter(cheers.closest('.project'), () => tl.restart());
  }

  // Chapter 3: a magnifier sweeps across the card, then sparkles.
  const search = document.querySelector('.fx--search');
  if (search) {
    const lens = search.querySelector('.lens');
    const tl = gsap.timeline({ paused: true })
      .fromTo(lens, { opacity: 0, scale: .4, rotation: -30, x: 0, y: 0 }, { opacity: 1, scale: 1, rotation: 0, duration: .6, ease: 'back.out(2)' })
      .to(lens, { keyframes: [{ x: '18vw', y: '6vw', duration: .8 }, { x: '28vw', y: '-2vw', duration: .7 }, { x: '20vw', y: '10vw', duration: .7 }], ease: 'sine.inOut' })
      .to(lens, { scale: 1.15, duration: .25, yoyo: true, repeat: 1 });
    onEnter(search.closest('.project'), () => tl.restart());
  }

  // Chapter 4: trophy pops up and confetti bursts.
  const party = document.querySelector('.fx--party');
  if (party) {
    const cup = party.querySelector('.trophy'), b = party.querySelector('.burst');
    gsap.set(b, { top: '22%', left: '86%' });
    const tl = gsap.timeline({ paused: true })
      .fromTo(cup, { opacity: 0, scale: 0, rotation: -40, y: 60 }, { opacity: 1, scale: 1, rotation: 8, y: 0, duration: 1, ease: 'elastic.out(1, .45)' })
      .add(() => {
        burst(b, { colors: ['#da251d', '#ffcd00', '#c9a43f', '#0b4a5a', '#f6e3cb', '#6b1f24'], n: 60, spread: 360, up: 260 });
      }, .25)
      .to(cup, { rotation: -6, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1);
    onEnter(party.closest('.project'), () => tl.restart());
  }
})();
