// Waveform: heights traced from the gold waveform in the original Canva design.
const WAVE = [0.12,0.25,0.31,0.25,0.25,0.25,0.12,0.19,0.25,0.44,0.38,0.5,0.44,0.62,0.44,0.19,0.31,0.44,0.56,0.75,0.62,0.5,0.62,0.31,0.25,0.19,0.25,0.5,0.69,1.0,0.75,0.62,0.38,0.25,0.25,0.25,0.62,0.75,0.75,0.62,0.38,0.25,0.19,0.12,0.25,0.25,0.31,0.25,0.25,0.25,0.12,0.12,0.25,0.25,0.38,0.38,0.38,0.5,0.5,0.25,0.12,0.19,0.44,0.62,0.5,0.62,0.5,0.38,0.5,0.19,0.25,0.38,0.5,0.88,0.62,0.88,0.44,0.38,0.25,0.25,0.5,0.62,0.56,0.88,0.5,0.44,0.38,0.25,0.12,0.38,0.25,0.31,0.44,0.25,0.25,0.12,0.12,0.19,0.12,0.25,0.25,0.38,0.5,0.38,0.25,0.25,0.19,0.25,0.62,0.75,0.56,0.5,0.62,0.5,0.19,0.31,0.5,0.62,0.75,0.62,0.5,0.75,0.31,0.25,0.25,0.5,0.62,0.62,0.62,0.75,0.38,0.25,0.25,0.25,0.38,0.38,0.62,0.38,0.25,0.25,0.25,0.12,0.12,0.19,0.25,0.12,0.19,0.31,0.31,0.25];

document.querySelectorAll('.wave').forEach((el) => {
  const step = Number(el.dataset.step || 2);
  WAVE.filter((_, i) => i % step === 0).forEach((h, i) => {
    const bar = document.createElement('span');
    bar.style.setProperty('--h', Math.max(h, 0.1));
    bar.style.setProperty('--d', `${(i % 12) * -0.13}s`);
    el.appendChild(bar);
  });
  // Plays while on screen; click to pause/resume.
  let userPaused = false;
  el.addEventListener('click', () => { userPaused = !userPaused; el.classList.toggle('is-playing', !userPaused); });
  new IntersectionObserver(([e]) => el.classList.toggle('is-playing', e.isIntersecting && !userPaused)).observe(el);
});

// Đông Sơn bronze-drum face: central star, concentric bands of ticks, dots and rings.
function drumSVG() {
  const c = 500, parts = [];
  const ring = (r, w = 1.5) => parts.push(`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="currentColor" stroke-width="${w}"/>`);
  const ticks = (r1, r2, n, w = 2) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      parts.push(`<line x1="${c + r1 * Math.cos(a)}" y1="${c + r1 * Math.sin(a)}" x2="${c + r2 * Math.cos(a)}" y2="${c + r2 * Math.sin(a)}" stroke="currentColor" stroke-width="${w}"/>`);
    }
  };
  const dots = (r, n, s) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      parts.push(`<circle cx="${c + r * Math.cos(a)}" cy="${c + r * Math.sin(a)}" r="${s}" fill="currentColor"/>`);
    }
  };
  // 14-point star
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 34 : 110;
    pts.push(`${c + r * Math.cos(a)},${c + r * Math.sin(a)}`);
  }
  parts.push(`<polygon points="${pts.join(' ')}" fill="currentColor"/>`);
  ring(130, 3); ring(145); ticks(150, 172, 72); ring(178);
  dots(195, 48, 5); ring(212, 3); ring(222);
  ticks(228, 300, 36, 1.5); dots(264, 36, 7);
  ring(306, 3); ring(316); ticks(322, 342, 120, 1.5); ring(348);
  dots(365, 72, 4); ring(382, 3); ring(392);
  for (let i = 0; i < 18; i++) { // stylised birds in flight
    const a = (i / 18) * Math.PI * 2, x = c + 430 * Math.cos(a), y = c + 430 * Math.sin(a), deg = (a * 180) / Math.PI + 90;
    parts.push(`<path transform="translate(${x} ${y}) rotate(${deg})" d="M-26 6 Q-10 -14 0 -4 Q10 -14 26 6 Q10 -4 0 4 Q-10 -4 -26 6Z" fill="currentColor"/>`);
  }
  ring(470, 3); ring(482); ticks(486, 498, 160, 1.2);
  return `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${parts.join('')}</svg>`;
}
document.querySelectorAll('.drum').forEach((el) => { el.innerHTML = drumSVG(); });

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Year in footer
const VI = document.documentElement.lang === 'vi';
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// YouTube facade: load the player only when someone clicks play.
document.querySelectorAll('.yt[data-yt]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    f.title = btn.getAttribute('aria-label') || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  });
});

// ---------- Signature layer ----------
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  // Intro curtain on first visit this session, then reused for page transitions.
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<div class="curtain__inner"><div class="curtain__bars">' + '<i></i>'.repeat(14) + '</div><div class="curtain__hi">Xin chào</div><div class="curtain__name">Nathan · Thành Nhật Bùi</div></div>';
  document.body.appendChild(curtain);
  const firstVisit = !store.get('nb-intro');
  const cameFromTransition = store.get('nb-transition') === '1';
  if (!reduce && (firstVisit || cameFromTransition)) {
    curtain.style.transition = 'none'; curtain.classList.add('is-on'); void curtain.offsetWidth; curtain.style.transition = '';
    const hold = firstVisit ? 1300 : 250;
    window.addEventListener('load', () => setTimeout(() => { curtain.classList.remove('is-on'); curtain.classList.add('is-off'); }, hold));
  }
  store.set('nb-intro', '1'); store.set('nb-transition', '0');

  if (!reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.protocol.startsWith('mailto') || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      store.set('nb-transition', '1');
      curtain.querySelector('.curtain__hi').textContent = a.textContent.trim().slice(0, 28) || 'Xin chào';
      curtain.classList.remove('is-off'); curtain.style.transition = 'none'; curtain.style.transform = 'translateY(-100%)'; void curtain.offsetWidth;
      curtain.style.transition = ''; curtain.style.transform = ''; curtain.classList.add('is-on');
      setTimeout(() => { location.href = url.href; }, 650);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) { curtain.classList.remove('is-on'); curtain.classList.add('is-off'); } });
  }

  // Scroll progress bar
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Case-study variants of the progress bar: a plane flying along it (Vietnam Airlines),
  // a waveform that fills as you read (Beer Hanoi).
  const body = document.body;
  if (body.classList.contains('case--vna')) {
    const plane = document.createElement('div');
    plane.className = 'progress-plane';
    plane.setAttribute('aria-hidden', 'true');
    plane.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)"/></svg>';
    body.appendChild(plane);
    const fly = () => { const h = document.documentElement.scrollHeight - innerHeight; const p = h > 0 ? scrollY / h : 0; plane.style.transform = `translateX(${p * (innerWidth - 22)}px)`; };
    addEventListener('scroll', fly, { passive: true }); addEventListener('resize', fly); fly();
  }
  if (body.classList.contains('case--beer')) {
    const wave = document.createElement('div');
    wave.className = 'progress-wave';
    wave.setAttribute('aria-hidden', 'true');
    const n = Math.round(innerWidth / 7);
    for (let i = 0; i < n; i++) {
      const b = document.createElement('i');
      b.style.height = `${4 + Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 10}px`;
      wave.appendChild(b);
    }
    body.appendChild(wave);
    const bars = [...wave.children];
    const fill = () => { const h = document.documentElement.scrollHeight - innerHeight; const k = Math.round((h > 0 ? scrollY / h : 0) * bars.length); bars.forEach((b, i) => b.classList.toggle('on', i < k)); };
    addEventListener('scroll', fill, { passive: true }); fill();
  }

  // Projects page: the section takes on each client's colours while that chapter is centred on screen.
  document.querySelectorAll('.brand-scroll').forEach((sec) => {
    const items = [...sec.querySelectorAll('[data-brand]')];
    const pick = () => {
      const mid = innerHeight / 2;
      const hit = items.find((el) => { const r = el.getBoundingClientRect(); return r.top - 120 < mid && r.bottom + 120 > mid; });
      if (hit) { sec.dataset.active = hit.dataset.brand; sec.classList.add('is-brand'); }
      else sec.classList.remove('is-brand');
    };
    addEventListener('scroll', pick, { passive: true }); pick();
  });

  // Word reveal for headings marked .split-css
  document.querySelectorAll('.split-css').forEach((el) => {
    let i = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
          w.appendChild(s); f.appendChild(w);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  });

  // Copy email
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = VI ? 'Đã chép' : 'Copied'; b.classList.add('is-done'); setTimeout(() => { b.textContent = VI ? 'Sao chép' : 'Copy'; b.classList.remove('is-done'); }, 1800); } catch (e) {}
  }));

  // Custom cursor + magnetic buttons (mouse only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    const ring = document.createElement('div'); ring.className = 'cursor'; ring.innerHTML = '<span></span>';
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.append(ring, dot);
    let x = 0, y = 0, rx = 0, ry = 0;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px, ${y}px)`; document.documentElement.classList.add('has-cursor'); });
    document.addEventListener('mouseleave', () => document.documentElement.classList.remove('has-cursor'));
    const loop = () => { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); };
    loop();
    const label = ring.querySelector('span');
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor], .yt, a, button');
      ring.classList.remove('is-link', 'is-label');
      if (!t) return;
      const text = t.dataset.cursor || (t.classList.contains('yt') ? 'Play' : '');
      if (text) { label.textContent = text; ring.classList.add('is-label'); } else ring.classList.add('is-link');
    });
    document.querySelectorAll('.btn, .nav__cta').forEach((b) => {
      b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .35}px`; });
      b.addEventListener('mouseleave', () => { b.style.translate = ''; });
    });
  }
})();
