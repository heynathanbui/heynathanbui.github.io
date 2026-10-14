// Case-study motion layer (GSAP + ScrollTrigger + MotionPath).
// Everything degrades to a static, fully visible page without GSAP or with reduced motion.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  // Split headings into words for the rise-in effect.
  document.querySelectorAll('.split').forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  // Fake waveform clips for the sound-session mock.
  document.querySelectorAll('.clip[data-bars], .tool__wave[data-bars]').forEach((clip, k) => {
    const n = Number(clip.dataset.bars);
    for (let i = 0; i < n; i++) {
      const b = document.createElement('i');
      const env = Math.sin((i / n) * Math.PI) * 0.6 + 0.25;
      const h = Math.min(1, env * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + k * 3))));
      b.style.setProperty('--h', `${Math.round(h * 100)}%`);
      clip.appendChild(b);
    }
  });

  // Split-flap board: one tile per character.
  document.querySelectorAll('.flap[data-text]').forEach((el) => {
    [...el.dataset.text].forEach((ch) => {
      const b = document.createElement('b');
      if (ch === ' ') b.className = 'sp';
      b.textContent = ch; b.dataset.ch = ch; el.appendChild(b);
    });
  });

  // Typing search bar: cycles through example queries.
  document.querySelectorAll('[data-type]').forEach((el) => {
    const words = el.dataset.type.split('|');
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(tick, 70); }
      else if (!del) { del = true; setTimeout(tick, 1600); }
      else if (i > 0) { i--; setTimeout(tick, 30); }
      else { del = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
    };
    tick();
  });

  if (!hasGsap || reduce) {
    document.documentElement.classList.add('no-motion');
    document.querySelectorAll('.hscroll').forEach((s) => s.classList.add('no-pin'));
    document.querySelectorAll('.mark').forEach((m) => m.classList.add('is-in'));
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.final || el.textContent; });
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(window.MotionPathPlugin);

  // ---- hero intro ----
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.c-hero .split .w > span', { yPercent: 110, rotate: 4, duration: 1.3, stagger: 0.06 }, 0.15)
    .from('.c-hero [data-intro]', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.6)
    .from('.c-hero [data-drop]', { y: -260, rotate: -24, opacity: 0, duration: 1.6, ease: 'bounce.out' }, 0.5)
    .from('.c-hero [data-pop]', { scale: 0, rotate: -90, duration: 1.1, ease: 'back.out(2)', stagger: 0.15 }, 1.1);

  // plane along the dotted flight path
  const plane = document.querySelector('.flight-plane');
  const path = document.querySelector('.flight path');
  if (plane && path && window.MotionPathPlugin) {
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDashoffset: len, opacity: 0 }, { strokeDashoffset: 0, opacity: .7, duration: 2.4, ease: 'power2.inOut', delay: .3 });
    const fly = () => gsap.to(plane, {
      duration: 2.6, ease: 'power2.inOut', delay: .3,
      motionPath: { path, align: path, autoRotate: true, alignOrigin: [0.5, 0.5] },
    });
    fly();
    // after landing, the whole plane layer drifts up and away on scroll
    gsap.to('.flight-layer', { yPercent: -35, xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---- parallax ----
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    gsap.to(el, { y: () => -window.innerHeight * Number(el.dataset.speed), ease: 'none',
      scrollTrigger: { trigger: el.closest('section, header') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ---- generic scroll reveals ----
  const from = {
    up: { y: 70, opacity: 0 },
    left: { x: -120, opacity: 0, rotate: -4 },
    right: { x: 120, opacity: 0, rotate: 4 },
    pop: { scale: .6, opacity: 0, rotate: -8 },
    drop: { y: -140, opacity: 0, rotate: 10 },
    fade: { opacity: 0 },
  };
  Object.keys(from).forEach((kind) => {
    const els = gsap.utils.toArray(`[data-anim="${kind}"]`);
    if (!els.length) return;
    gsap.set(els, from[kind]);
    ScrollTrigger.batch(els, {
      start: 'top 86%',
      onEnter: (batch) => gsap.to(batch, {
        x: 0, y: 0, opacity: 1, scale: 1, rotate: (i, t) => Number(t.dataset.rot || 0),
        duration: kind === 'pop' ? 1 : 1.2, ease: kind === 'pop' || kind === 'drop' ? 'back.out(1.6)' : 'expo.out', stagger: 0.12, overwrite: true,
      }),
    });
  });

  // headings split on scroll
  gsap.utils.toArray('.c-sec .split, .next .split').forEach((h) => {
    gsap.from(h.querySelectorAll('.w > span'), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // highlighter marks
  gsap.utils.toArray('.mark').forEach((m) => ScrollTrigger.create({ trigger: m, start: 'top 80%', onEnter: () => m.classList.add('is-in') }));

  // ---- counters ----
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count), dec = Number(el.dataset.dec || 0);
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const o = { v: Number(el.dataset.from || 0) };
    el.textContent = pre + o.v.toFixed(dec) + suf;
    gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => { el.textContent = pre + o.v.toFixed(dec) + suf; },
      onComplete: () => { if (el.dataset.final) el.textContent = el.dataset.final; } });
  });

  // ---- connector lines that draw with scroll ----
  gsap.utils.toArray('.steps__line i').forEach((l) => {
    gsap.to(l, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: l.closest('.steps'), start: 'top 75%', end: 'bottom 60%', scrub: true } });
  });
  gsap.utils.toArray('.translate__arrow').forEach((a) => {
    gsap.from(a, { scaleX: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: a, start: 'top 85%' } });
  });

  // ---- pinned horizontal gallery ----
  const mm = gsap.matchMedia();
  mm.add('(min-width: 760px)', () => {
    gsap.utils.toArray('.hscroll').forEach((sec) => {
      const track = sec.querySelector('.hscroll__track');
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    });
  });
  mm.add('(max-width: 759px)', () => { document.querySelectorAll('.hscroll').forEach((s) => s.classList.add('no-pin')); });

  // ---- sound session playhead ----
  document.querySelectorAll('.daw').forEach((daw) => {
    const head = daw.querySelector('.daw__head');
    const lane = daw.querySelector('.daw__lane');
    const clock = daw.querySelector('.daw__time');
    const total = Number(daw.dataset.seconds || 30);
    const o = { p: 0 };
    const tl = gsap.to(o, { p: 1, duration: total / 2.5, ease: 'none', repeat: -1, paused: true,
      onUpdate: () => {
        const w = lane.getBoundingClientRect().width;
        head.style.transform = `translateX(${o.p * w}px)`;
        const s = o.p * total; clock.textContent = `00:${String(Math.floor(s)).padStart(2, '0')}:${String(Math.floor((s % 1) * 24)).padStart(2, '0')}`;
      } });
    ScrollTrigger.create({ trigger: daw, start: 'top 85%', end: 'bottom 15%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
  });

  // ---- split-flap board flips into place ----
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&-';
  document.querySelectorAll('.board').forEach((board) => {
    const tiles = [...board.querySelectorAll('.flap b:not(.sp)')];
    const run = () => tiles.forEach((t, i) => {
      let n = 6 + Math.floor(Math.random() * 10) + (i % 18);
      const tick = () => {
        if (n-- <= 0) { t.textContent = t.dataset.ch; return; }
        t.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        gsap.fromTo(t, { rotationX: -70 }, { rotationX: 0, duration: .06, ease: 'none' });
        setTimeout(tick, 55);
      };
      setTimeout(tick, i * 6);
    });
    ScrollTrigger.create({ trigger: board, start: 'top 80%', once: true, onEnter: run });
  });

  // ---- journey home: the beer travels the road as you scroll ----
  document.querySelectorAll('.journey').forEach((j) => {
    const trail = j.querySelector('.journey__trail'), road = j.querySelector('.journey__road'), mug = j.querySelector('.journey__mug');
    const len = trail.getTotalLength();
    gsap.set(trail, { strokeDasharray: len, strokeDashoffset: len });
    const st = { trigger: j, start: 'top 75%', end: 'bottom 55%', scrub: 1 };
    gsap.to(trail, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st });
    if (window.MotionPathPlugin && mug) {
      gsap.to(mug, { ease: 'none', scrollTrigger: st, motionPath: { path: road, align: road, alignOrigin: [.5, .8] } });
    }
  });

  // ---- floating hearts on the reel ----
  document.querySelectorAll('.hearts').forEach((host) => {
    let timer = null;
    const spawn = () => {
      const h = document.createElement('i'); h.textContent = '♥'; host.appendChild(h);
      gsap.fromTo(h, { x: gsap.utils.random(-20, 20), y: 0, scale: gsap.utils.random(.6, 1.3), opacity: 1 },
        { x: '+=' + gsap.utils.random(-70, 70), y: -gsap.utils.random(160, 260), opacity: 0, rotation: gsap.utils.random(-30, 30), duration: gsap.utils.random(1.6, 2.6), ease: 'power1.out', onComplete: () => h.remove() });
    };
    ScrollTrigger.create({ trigger: host.closest('.pillar') || host, start: 'top 80%', end: 'bottom 20%',
      onToggle: (st) => { clearInterval(timer); if (st.isActive) timer = setInterval(spawn, 380); } });
  });

  // ---- 3D tilt on hover ----
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const qx = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
      const qy = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        qx(((e.clientX - r.left) / r.width - .5) * 14);
        qy(-((e.clientY - r.top) / r.height - .5) * 14);
      });
      el.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  // Safety net: anything on screen that is still hidden after a moment gets revealed.
  const rescue = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    setTimeout(() => {
      if (Number(getComputedStyle(e.target).opacity) < 0.05) {
        gsap.to(e.target, { x: 0, y: 0, opacity: 1, scale: 1, rotate: Number(e.target.dataset.rot || 0), duration: .7, ease: 'power2.out', overwrite: true });
      }
    }, 1200);
  }), { threshold: 0.05 });
  document.querySelectorAll('[data-anim]').forEach((el) => rescue.observe(el));

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
