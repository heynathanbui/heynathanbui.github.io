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
  // Each case study gets its own curtain, picked from the destination URL and carried
  // across the page load in sessionStorage so the arrival matches the departure.
  const VI_LANG = document.documentElement.lang === 'vi';
  const svg = {
    plane: '<svg class="ct-plane" viewBox="0 0 120 40" aria-hidden="true"><path d="M10 16 4 4h7l11 12z"/><path d="M5 22q0-6 9-6h81q17 0 22 5-5 4-22 4H14q-9 0-9-3z"/><path d="m50 22 22 14h8L66 22z"/><ellipse cx="68" cy="29" rx="6" ry="3"/></svg>',
    bottle: '<svg class="ct-bottle" viewBox="0 0 40 120" aria-hidden="true"><rect class="cap" x="15" y="1" width="10" height="5" rx="1.5"/><path class="glass" d="M16 6h8v24q8 10 8 22v60q0 4-4 4H12q-4 0-4-4V52q0-12 8-22z"/><rect class="label" x="8" y="62" width="24" height="26"/><path class="trim" d="M8 65h24M8 85h24"/><path class="shine" d="M12 54v54"/></svg>',
    chart: '<svg class="ct-chart" viewBox="0 0 220 120" aria-hidden="true">' +
      [[14, 70, 22, 50], [38, 60, 18, 40], [62, 64, 26, 44], [86, 48, 22, 30], [110, 52, 30, 34], [134, 36, 24, 20], [158, 30, 30, 14], [182, 18, 26, 6]]
        .map(([x, y, h, w], i) => `<g class="cdl" style="--i:${i}"><path d="M${x + 6} ${w} V${y + h + 12}"/><rect x="${x}" y="${y}" width="12" height="${h}" rx="2"/></g>`).join('') +
      '<path class="line" d="M6 98 C40 92 52 70 78 74 S120 50 140 46 186 22 214 10"/></svg>',
    opera: '<svg class="ct-opera" viewBox="0 0 300 150" aria-hidden="true"><defs><linearGradient id="ctVivid" x1="0" x2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#e23d96"/><stop offset=".5" stop-color="#ffd166"/><stop offset="1" stop-color="#8a5cff"/><animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0" dur="2.4s" repeatCount="indefinite"/></linearGradient></defs><g class="bridge"><path d="M10 92Q70 26 130 92"/><path d="M18 92Q70 40 122 92"/><path d="M0 92H140"/><path d="M22 92V80.1"/><path d="M34 92V70.9"/><path d="M46 92V64.3"/><path d="M58 92V60.3"/><path d="M70 92V59.0"/><path d="M82 92V60.3"/><path d="M94 92V64.3"/><path d="M106 92V70.9"/><path d="M118 92V80.1"/><path d="M4 92V74H16V92M124 92V74H136V92"/></g><g class="oh"><path class="podium" d="M118 92H296V100H112Z"/><path class="podium" d="M104 100H300V106H98Z"/><path class="shell" d="M150 92Q144 80 146 58Q170 74 178 92Z"/><path class="shell" d="M168 92Q162 62 166 40Q197 56 205 92Z"/><path class="shell" d="M195 92Q189 50 190 28Q228 44 236 92Z"/><path class="shell" d="M228 92Q222 74 226 52Q254 68 262 92Z"/><path class="shell" d="M258 92Q252 92 258 70Q276 86 284 92Z"/><path class="rib" d="M146 58L160 92"/><path class="rib" d="M146 58L169 92"/><path class="rib" d="M166 40L181 92"/><path class="rib" d="M166 40L193 92"/><path class="rib" d="M190 28L210 92"/><path class="rib" d="M190 28L223 92"/><path class="rib" d="M226 52L240 92"/><path class="rib" d="M226 52L251 92"/><path class="rib" d="M258 70L267 92"/><path class="rib" d="M258 70L276 92"/></g><g class="oh-refl" transform="translate(0 212) scale(1 -1)"><path class="podium" d="M118 92H296V100H112Z"/><path class="podium" d="M104 100H300V106H98Z"/><path class="shell" d="M150 92Q144 80 146 58Q170 74 178 92Z"/><path class="shell" d="M168 92Q162 62 166 40Q197 56 205 92Z"/><path class="shell" d="M195 92Q189 50 190 28Q228 44 236 92Z"/><path class="shell" d="M228 92Q222 74 226 52Q254 68 262 92Z"/><path class="shell" d="M258 92Q252 92 258 70Q276 86 284 92Z"/><path class="rib" d="M146 58L160 92"/><path class="rib" d="M146 58L169 92"/><path class="rib" d="M166 40L181 92"/><path class="rib" d="M166 40L193 92"/><path class="rib" d="M190 28L210 92"/><path class="rib" d="M190 28L223 92"/><path class="rib" d="M226 52L240 92"/><path class="rib" d="M226 52L251 92"/><path class="rib" d="M258 70L267 92"/><path class="rib" d="M258 70L276 92"/></g><path class="water" d="M0 112q25-4 50 0t50 0 50 0 50 0 50 0 50 0M20 124q25-3 50 0t50 0 50 0 50 0 50 0M40 136q25-3 50 0t50 0 50 0 50 0"/></svg>',
  };
  const THEMES = {
    vna: { art: '<div class="ct-route"></div>' + svg.plane, k: VI_LANG ? 'Chương 1 · Mời lên máy bay' : 'Chapter 1 · Now boarding', t: 'Vietnam Airlines' },
    beer: { art: '<div class="ct-clink">' + svg.bottle + svg.bottle + '</div><div class="ct-bubbles">' + '<i></i>'.repeat(12) + '</div>', k: VI_LANG ? 'Chương 2 · Zee Agency' : 'Chapter 2 · Zee Agency', t: 'Bia Hà Nội' },
    finder: { art: svg.chart + '<div class="ct-ticker"><span>BTC ▲</span><span>ETH ▲</span><span>SOL ▲</span><span>XRP ▲</span><span>BTC ▲</span><span>ETH ▲</span></div>', k: VI_LANG ? 'Chương 3 · Fintech' : 'Chapter 3 · Fintech', t: 'Finder' },
    uavs: { art: svg.opera + '<div class="ct-stars">' + '<i></i>'.repeat(9) + '</div>', k: VI_LANG ? 'Chương 4 · Cộng đồng' : 'Chapter 4 · Community', t: 'UAVS NSW' },
  };
  const themeFor = (path) => (/vietnam-airlines/.test(path) ? 'vna' : /beer-hanoi/.test(path) ? 'beer' : /\/finder\.html/.test(path) ? 'finder' : /\/uavs\.html/.test(path) ? 'uavs' : '');
  const curtain = document.createElement('div');
  curtain.setAttribute('aria-hidden', 'true');
  const defaultInner = '<div class="curtain__inner"><div class="curtain__bars">' + '<i></i>'.repeat(14) + '</div><div class="curtain__hi">Xin chào</div><div class="curtain__name">Nathan · Thành Nhật Bùi</div></div>';
  const dress = (theme, label) => {
    curtain.className = 'curtain' + (theme ? ' curtain--' + theme : '');
    const th = THEMES[theme];
    curtain.innerHTML = th
      ? `<div class="curtain__inner ct"><div class="ct-art">${th.art}</div><p class="ct-k">${th.k}</p><p class="ct-t">${th.t}</p></div>`
      : defaultInner;
    if (!th && label) curtain.querySelector('.curtain__hi').textContent = label;
  };
  const firstVisit = !store.get('nb-intro');
  const cameFromTransition = store.get('nb-transition') === '1';
  const arrivingTheme = cameFromTransition ? (store.get('nb-theme') || '') : '';
  dress(arrivingTheme);
  document.body.appendChild(curtain);
  if (!reduce && (firstVisit || cameFromTransition)) {
    curtain.style.transition = 'none'; curtain.classList.add('is-on'); void curtain.offsetWidth; curtain.style.transition = '';
    const hold = firstVisit ? 1300 : arrivingTheme ? 650 : 250;
    window.addEventListener('load', () => setTimeout(() => { curtain.classList.remove('is-on'); curtain.classList.add('is-off'); }, hold));
  }
  store.set('nb-intro', '1'); store.set('nb-transition', '0'); store.set('nb-theme', '');

  if (!reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.protocol.startsWith('mailto') || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      const theme = themeFor(url.pathname);
      store.set('nb-transition', '1'); store.set('nb-theme', theme);
      dress(theme, a.textContent.trim().slice(0, 28) || 'Xin chào');
      curtain.style.transition = 'none'; curtain.style.transform = 'translateY(-100%)'; void curtain.offsetWidth;
      curtain.style.transition = ''; curtain.style.transform = ''; curtain.classList.add('is-on');
      setTimeout(() => { location.href = url.href; }, theme ? 1000 : 650);
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

// ---------- Brand dressing for case studies ----------
// Vietnam Airlines: route strips with a plane that crosses as you read, lotus watermarks, boarding stamps.
// Beer Hanoi: crown caps on labels, a foam head on dark sections, rising bubbles, barley and a brewery seal.
(() => {
  const body = document.body;
  const vna = body.classList.contains('case--vna');
  const beer = body.classList.contains('case--beer');
  const finder = body.classList.contains('case--finder');
  if (!vna && !beer && !finder) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';
  const PLANE = '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)"/>';
  const LOTUS = '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M100 12C83 42 83 88 100 118 117 88 117 42 100 12Z"/><path d="M100 118C71 104 53 72 59 38 81 52 95 85 100 118Z"/><path d="M100 118C129 104 147 72 141 38 119 52 105 85 100 118Z"/><path d="M100 118C62 119 25 96 12 64 46 63 80 90 100 118Z"/><path d="M100 118C138 119 175 96 188 64 154 63 120 90 100 118Z"/><path d="M42 128Q100 142 158 128"/></g>';
  const sections = [...document.querySelectorAll('.c-sec')].filter((s) => s.querySelector('.c-label'));
  const add = (sec, cls, html) => { const d = document.createElement('div'); d.className = `deco ${cls}`; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html; sec.classList.add('has-deco'); sec.prepend(d); return d; };

  // circular stamp / seal with text running round the edge
  let sid = 0;
  const seal = (text, centre) => { const id = `seal${sid++}`; return `<svg viewBox="0 0 200 200" ${NS}><defs><path id="${id}" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0"/></defs><circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width="1.5"/><text font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="700" letter-spacing="3.2" fill="currentColor"><textPath href="#${id}">${text}</textPath></text>${centre}</svg>`; };

  if (vna) {
    // boarding-pass icon on every section label
    document.querySelectorAll('.c-label').forEach((l) => l.insertAdjacentHTML('afterbegin', `<span class="deco-ic deco-ic--plane"><svg viewBox="0 0 24 24" fill="currentColor" ${NS}>${PLANE}</svg></span>`));
    const routes = [['HAN', 'SGN'], ['SGN', 'SYD'], ['HAN', 'DAD'], ['SGN', 'PQC'], ['HAN', 'NRT'], ['HAN', 'CDG'], ['SGN', 'MEL'], ['HAN', 'ICN']];
    const strips = sections.map((sec, i) => {
      const [a, b] = routes[i % routes.length];
      const d = add(sec, 'vn-route', `<span class="vn-route__code">${a}</span><span class="vn-route__line"><i class="vn-route__plane"><svg viewBox="0 0 24 24" fill="currentColor" ${NS}>${PLANE}</svg></i></span><span class="vn-route__code">${b}</span><span class="vn-route__no">VN ${String(i + 1).padStart(2, '0')}</span>`);
      if (sec.classList.contains('c-sec--dark')) add(sec, 'vn-lotus', `<svg viewBox="0 0 200 145" ${NS}>${LOTUS}</svg>`);
      else if (i % 2 === 0) add(sec, 'vn-stamp' + (i % 4 === 0 ? ' is-left' : ''), seal('VIETNAM AIRLINES · INSTAGRAM · NOW BOARDING · ', `<g transform="translate(62 70) scale(.38)">${LOTUS}</g>`));
      return { sec, plane: d.querySelector('.vn-route__plane') };
    });
    const fly = () => strips.forEach(({ sec, plane }) => {
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height * .5)));
      plane.style.left = `${p * 100}%`;
    });
    if (!reduce) { addEventListener('scroll', fly, { passive: true }); addEventListener('resize', fly); }
    fly();

    // Aircraft parts drawn as technical line art: a turbofan on each audience "engine" card,
    // and cloud banks wherever the page changes colour.
    const P = (r, a) => [(100 + r * Math.cos(a * Math.PI / 180)).toFixed(1), (100 + r * Math.sin(a * Math.PI / 180)).toFixed(1)].join(' ');
    const blades = Array.from({ length: 22 }, (_, k) => { const a = k * (360 / 22); return `<path d="M${P(20, a)}Q${P(52, a + 14)} ${P(80, a + 24)}L${P(80, a + 34)}Q${P(50, a + 24)} ${P(20, a + 12)}Z"/>`; }).join('');
    const ENGINE = `<svg viewBox="0 0 200 200" ${NS}><circle class="eng-nacelle" cx="100" cy="100" r="96"/><circle class="eng-lip" cx="100" cy="100" r="86"/><circle class="eng-duct" cx="100" cy="100" r="81"/><g class="eng-fan">${blades}</g><circle class="eng-spinner" cx="100" cy="100" r="20"/><path class="eng-swirl" d="M100 100m0-14a14 14 0 0 1 10 24a8 8 0 0 1-10-10"/></svg>`;
    const fans = [];
    document.querySelectorAll('.aud__card').forEach((card, k) => {
      card.insertAdjacentHTML('afterbegin', `<div class="vn-engine" aria-hidden="true">${ENGINE}<span>ENG ${k + 1}</span></div>`);
      fans.push({ el: card.querySelector('.eng-fan'), dir: k % 2 ? -1 : 1 });
    });
    // Cloud banks where the page changes colour: two layers drift at different speeds as you scroll,
    // so moving between chapters feels like climbing through cloud rather than hitting a hard edge.
    const solid = (c) => !/rgba\(.*,\s*0\)$/.test(c) && c !== 'transparent';
    const bg = (el) => { const c = getComputedStyle(el).backgroundColor; return solid(c) ? c : getComputedStyle(document.body).backgroundColor; };
    const bump = (w, h, r0, r1, seed) => {
      let x = -40, d = `M-40 0H${w + 40}V${h * .45}`, k = seed; const pts = [];
      while (x < w + 40) { k = (k * 9301 + 49297) % 233280; const r = r0 + (k / 233280) * (r1 - r0); pts.push([x, r]); x += r * 1.25; }
      pts.reverse().forEach(([px, r]) => { d += `A${r} ${r} 0 0 1 ${(px - r * 1.25).toFixed(0)} ${(h * .45).toFixed(0)}`; });
      return d + 'Z';
    };
    const clouds = [];
    const cloudEdge = (host, side, color) => {
      const c = document.createElement('div'); c.className = `vn-cloud vn-cloud--${side}`; c.setAttribute('aria-hidden', 'true');
      c.style.color = color;
      c.innerHTML = `<svg class="vn-cloud__l vn-cloud__l--back" viewBox="0 0 1600 120" preserveAspectRatio="xMidYMax slice" ${NS}><path d="${bump(1600, 120, 34, 70, side === 'top' ? 7 : 19)}" fill="currentColor"/></svg>`
        + `<svg class="vn-cloud__l vn-cloud__l--front" viewBox="0 0 1600 120" preserveAspectRatio="xMidYMax slice" ${NS}><path d="${bump(1600, 120, 20, 44, side === 'top' ? 3 : 11)}" fill="currentColor"/></svg>`;
      host.append(c); clouds.push(c);
    };
    document.querySelectorAll('.c-hero, .c-sec--dark').forEach((sec) => {
      const prev = sec.previousElementSibling, next = sec.nextElementSibling;
      if (!sec.classList.contains('c-hero') && prev) cloudEdge(sec, 'top', bg(prev));
      if (next && !next.classList.contains('stats') && !next.classList.contains('marquee')) cloudEdge(sec, 'bottom', bg(next));
    });
    const turn = () => {
      fans.forEach(({ el, dir }) => { el.style.transform = `rotate(${dir * scrollY * .35}deg)`; });
      clouds.forEach((c) => {
        const r = c.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const p = (r.top / innerHeight - .5);
        c.firstElementChild.style.transform = `translate3d(${(p * 70).toFixed(1)}px,0,0)`;
        c.lastElementChild.style.transform = `translate3d(${(p * -130).toFixed(1)}px,0,0)`;
      });
    };
    if (!reduce) { addEventListener('scroll', turn, { passive: true }); }
    turn();
  }

  if (beer) {
    // crown cap: 21 teeth round a disc
    const teeth = Array.from({ length: 42 }, (_, i) => { const a = (i / 42) * Math.PI * 2, r = i % 2 ? 44 : 49; return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`; }).join(' ');
    const CAP = `<svg viewBox="0 0 100 100" ${NS}><polygon points="${teeth}" fill="currentColor"/><circle cx="50" cy="50" r="36" fill="#9b1c1c"/><circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 30l5 14h15l-12 9 5 15-13-9-13 9 5-15-12-9h15z" fill="currentColor"/></svg>`;
    document.querySelectorAll('.c-label').forEach((l) => l.insertAdjacentHTML('afterbegin', `<span class="deco-ic deco-ic--cap">${CAP}</span>`));
    // barley sprig: a curved stem with paired grains and awns
    const grains = Array.from({ length: 9 }, (_, i) => { const y = 30 + i * 22, s = i % 2 ? 1 : -1, x = 60 + s * 4; return `<g transform="translate(${x} ${y}) rotate(${s * 28})"><ellipse rx="7" ry="15" fill="currentColor"/><path d="M0 -14 L${s * 6} -52" stroke="currentColor" stroke-width="1.4"/></g>`; }).join('');
    const BARLEY = `<svg viewBox="0 0 120 320" ${NS}><path d="M60 20 Q58 180 66 318" fill="none" stroke="currentColor" stroke-width="3"/>${grains}<path d="M64 250 q-30 -10 -40 -50 q34 8 40 50z" fill="currentColor" opacity=".7"/></svg>`;
    // foam head: a wavy edge with drips and a few bubbles
    const drips = Array.from({ length: 14 }, (_, i) => { const x = i * 100 + 50, h = 18 + ((i * 37) % 5) * 9; return `<path d="M${x - 10} 30 q0 ${h} 10 ${h} q10 0 10 -${h}z"/>`; }).join('');
    const pops = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 71) % 1400}" cy="${8 + (i * 13) % 22}" r="${1.5 + (i % 4)}" fill="#e9d6a0"/>`).join('');
    const FOAM = `<svg viewBox="0 0 1400 80" preserveAspectRatio="none" ${NS}><g fill="#fff7e0"><path d="M0 0H1400V30Q1365 44 1330 30T1260 30T1190 30T1120 30T1050 30T980 30T910 30T840 30T770 30T700 30T630 30T560 30T490 30T420 30T350 30T280 30T210 30T140 30T70 30T0 30Z"/>${drips}</g>${pops}</svg>`;
    sections.forEach((sec, i) => {
      if (sec.classList.contains('c-sec--dark')) {
        add(sec, 'bh-foam', FOAM);
        if (!reduce) add(sec, 'bh-bubbles', Array.from({ length: 22 }, (_, k) => `<i style="left:${(k * 47) % 100}%;--d:${6 + (k * 7) % 9}s;--t:-${(k * 13) % 14}s;--s:${4 + (k % 4) * 3}px"></i>`).join(''));
      } else {
        add(sec, 'bh-barley' + (i % 2 ? ' is-right' : ''), BARLEY);
        if (i % 2 === 0) add(sec, 'bh-seal', seal('BIA HÀ NỘI · HABECO · HÀ NỘI · TẾT · ', `<g transform="translate(70 62) scale(.6)">${CAP.replace(/<svg[^>]*>|<\/svg>/g, '')}</g>`));
      }
    });
  }

  // an upward random walk, the same shape every load
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const walk = (n, w, h) => { let y = h * .8; return Array.from({ length: n }, (_, k) => { y = Math.max(h * .08, Math.min(h * .92, y - h * .045 + (rnd() - .5) * h * .22)); return `${((k / (n - 1)) * w).toFixed(1)},${y.toFixed(1)}`; }); };
  if (finder) {
    const CANDLES = `<svg viewBox="0 0 24 24" ${NS}><path d="M5 4v16M12 7v13M19 2v16" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="9" width="4" height="7" rx="1" fill="currentColor"/><rect x="10" y="11" width="4" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="17" y="5" width="4" height="8" rx="1" fill="currentColor"/></svg>`;
    document.querySelectorAll('.c-label').forEach((l) => l.insertAdjacentHTML('afterbegin', `<span class="deco-ic deco-ic--candle">${CANDLES}</span>`));
    const candles = Array.from({ length: 14 }, (_, k) => { const x = 20 + k * 40, up = rnd() > .3, o = 300 - k * 16 + (rnd() - .5) * 40, b = 30 + rnd() * 50; return `<path d="M${x} ${o - b - 20}V${o + 20}" stroke="currentColor" stroke-width="2"/><rect x="${x - 10}" y="${o - b}" width="20" height="${b}" rx="2" ${up ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2"'}/>`; }).join('');
    const COIN = (g) => `<svg viewBox="0 0 100 100" ${NS}><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 4"/><text x="50" y="66" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="800" font-size="44" fill="currentColor">${g}</text></svg>`;
    const sparks = sections.map((sec, i) => {
      const pts = walk(48, 1000, 60);
      const d = add(sec, 'fd-spark', `<svg viewBox="0 0 1000 60" preserveAspectRatio="none" ${NS}><polyline points="${pts.join(' ')}" pathLength="1"/></svg><span class="fd-spark__tick">▲</span>`);
      if (sec.classList.contains('c-sec--dark')) add(sec, 'fd-candles', `<svg viewBox="0 0 580 420" ${NS}>${candles}</svg>`);
      else add(sec, 'fd-coin' + (i % 2 ? ' is-left' : ''), COIN(i % 2 ? 'Ξ' : '₿'));
      return { sec, line: d.querySelector('polyline'), tick: d.querySelector('.fd-spark__tick') };
    });
    const draw = () => sparks.forEach(({ sec, line, tick }) => {
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * .9)));
      line.style.strokeDashoffset = String(1 - p); tick.style.opacity = p > .98 ? 1 : 0;
    });
    if (reduce) sparks.forEach(({ line, tick }) => { line.style.strokeDashoffset = '0'; tick.style.opacity = 1; });
    else { addEventListener('scroll', draw, { passive: true }); draw(); }
  }

  // Each brand gets one signature moment on its stats strip.
  const stats = [...document.querySelectorAll('.stats .stat')];
  if (!stats.length) return;
  const onView = (el, fn) => {
    if (reduce || !('IntersectionObserver' in window)) { fn(true); return; }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(false); o.disconnect(); } }, { threshold: .4 });
    o.observe(el);
  };
  if (vna) {
    // split-flap departure board: digits flick through before they settle
    stats.forEach((st) => {
      const n = st.querySelector('.stat__n'); if (!n || !/^[-+–0-9.,%KM ]+$/.test(n.textContent.trim())) return;
      const final = n.textContent; n.setAttribute('aria-label', final);
      n.innerHTML = [...final].map((ch) => `<span class="flap" aria-hidden="true">${ch}</span>`).join('');
      onView(st, (instant) => {
        if (instant) return;
        [...n.children].forEach((f, k) => {
          const ch = f.textContent; if (!/[0-9]/.test(ch)) return;
          let t = 0; const iv = setInterval(() => { f.textContent = String(Math.floor(Math.random() * 10)); f.classList.toggle('is-flip'); if ((t += 1) > 6 + k * 2) { clearInterval(iv); f.textContent = ch; f.classList.remove('is-flip'); } }, 55);
        });
      });
    });
  }
  if (beer) stats.forEach((st, k) => { st.classList.add('pour'); st.style.setProperty('--k', k); onView(st, () => st.classList.add('is-poured')); });
  if (finder) stats.forEach((st, k) => {
    seed = 11 + k * 5;
    st.insertAdjacentHTML('beforeend', `<svg class="stat-spark" viewBox="0 0 120 28" preserveAspectRatio="none" ${NS}><polyline points="${walk(16, 120, 28).join(' ')}" pathLength="1"/></svg>`);
    onView(st, () => st.classList.add('is-drawn'));
  });
})();

// ---------- Selected work: a turntable of the four case studies ----------
// Items sit on an ellipse; the front one is sharp and full size, the rest shrink and blur with depth.
(() => {
  const reel = document.querySelector('.reel');
  if (!reel || !reel.querySelector('.reel__ring')) return; // case pages reuse .reel for the Instagram mock
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ring = reel.querySelector('.reel__ring');
  const items = [...reel.querySelectorAll('.reel__item')];
  const infos = [...reel.querySelectorAll('.reel__info')];
  const bars = [...reel.querySelectorAll('.reel__progress i')];
  const nameEl = reel.querySelector('.reel__name');
  // the brand's own logo sits under the picture instead of a typed name
  const pre0 = document.documentElement.lang === 'vi' ? '../' : '';
  const LOGO = {
    vna: `<span class="reel__logo reel__logo--vna"><img src="${pre0}assets/img/logos/brands/vietnam-airlines.svg" alt="" width="150" height="26"></span>`,
    beer: `<span class="reel__logo reel__logo--beer"><img src="${pre0}assets/img/logos/brands/habeco.png" alt=""><b>Bia Hà Nội</b></span>`,
    finder: `<span class="reel__logo reel__logo--finder"><img src="${pre0}assets/img/finder-logo-white.svg" alt="" width="160" height="30"></span>`,
    uavs: '<span class="reel__logo reel__logo--uavs"><b>UAVS</b><small>NSW</small></span>',
  };
  const countEl = reel.querySelector('.reel__count b');
  const n = items.length, DUR = 5000;
  let target = 0, current = 0, active = 0, paused = reduce, hover = false, visible = true, timer = 0, last = 0;
  const wrap = (d) => ((d % n) + n + n / 2) % n - n / 2;

  // brand objects that float in front of each card, on their own depth layer
  const pre = document.documentElement.lang === 'vi' ? '../' : '';
  const OBJ = {
    vna: `<div class="reel__obj reel__obj--plane"><div class="reel__float"><span class="reel__trail"></span><img src="${pre}assets/img/vna-plane-cutout.png" alt="" draggable="false"></div></div>`,
    beer: `<div class="reel__obj reel__obj--bottle"><div class="reel__float"><img src="${pre}assets/img/beer/bottle-bia-ha-noi.png" alt="" draggable="false" width="256" height="875"><span class="reel__bubbles">${'<i></i>'.repeat(7)}</span></div></div>`,
    finder: `<div class="reel__obj reel__obj--fdlogo"><div class="reel__float"><span class="fd-chip"><img src="${pre}assets/img/finder-logo.svg" alt="" draggable="false" width="160" height="30"></span></div></div><div class="reel__obj reel__obj--eyes"><div class="reel__float"><span class="fd-eyes"><img src="${pre}assets/img/finder-eyes.svg" alt="" draggable="false"></span></div></div>`,
    uavs: `<div class="reel__obj reel__obj--opera"><div class="reel__float"><img src="${pre}assets/img/opera-house.png" alt="" draggable="false" width="900" height="310"></div></div>`,
  };
  items.forEach((el) => {
    const k = [...el.classList].find((c) => c.startsWith('reel__item--'))?.slice(12);
    if (OBJ[k]) el.insertAdjacentHTML('beforeend', OBJ[k]);
  });

  // each case card gets its brand's world behind the copy, plus one sticker that pops off the corner
  const PLANE = '<path d="M21 12c0-.8-.7-1.3-1.5-1.3H15L10.5 3H8.6l2.2 7.7H6.3L4.6 8.6H3l1 3.4-1 3.4h1.6l1.7-2.1h4.5L8.6 21h1.9l4.5-7.7h4.5c.8 0 1.5-.5 1.5-1.3z" fill="currentColor" transform="translate(-12 -12)"/>';
  const LOTUS = (fill, stroke) => `<path d="M50 8C60 22 60 40 50 52C40 40 40 22 50 8Z M50 52C34 46 24 32 26 16C40 22 48 36 50 52Z M50 52C66 46 76 32 74 16C60 22 52 36 50 52Z M50 52C30 54 14 46 6 34C22 32 40 40 50 52Z M50 52C70 54 86 46 94 34C78 32 60 40 50 52Z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const rr = (a, b) => a + Math.random() * (b - a);
  const cap = (() => { let d = ''; for (let i = 0; i < 42; i++) { const a = i / 42 * Math.PI * 2, r = i % 2 ? 44 : 48; d += `${i ? 'L' : 'M'}${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; })();
  const blades = Array.from({ length: 6 }, (_, i) => `<path d="M50 50L50 12A38 38 0 0 1 83 31Z" fill="${i % 2 ? '#ffd166' : '#ffe9a8'}" stroke="#4a1f8f" stroke-width="2" transform="rotate(${i * 60} 50 50)"/>`).join('');
  const candles = (() => { let x = 20, y = 150, o = ''; const pts = []; for (let i = 0; i < 12; i++) { const up = Math.random() > .3, h = rr(14, 34), ny = up ? y - h * .7 : y + h * .4; o += `<rect x="${x - 5}" y="${Math.min(y, ny)}" width="10" height="${Math.abs(ny - y) + 4}" rx="1.5" fill="${up ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4"/><path d="M${x} ${Math.min(y, ny) - rr(4, 10)}V${Math.max(y, ny) + rr(6, 12)}" stroke="currentColor" stroke-width="1.2"/>`; pts.push(`${x} ${ny}`); y = Math.max(30, ny); x += 32; } return o + `<path class="ri-line" d="M${pts.join('L')}" fill="none" stroke="#ffd166" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`; })();
  const DECO = {
    vna: `<div class="ri-deco" aria-hidden="true"><svg class="ri-route" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice"><path id="riRoute" d="M-20 170C110 30 290 20 420 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="1 8" stroke-linecap="round"/><circle cx="330" cy="62" r="4" fill="currentColor"/><g>${PLANE}${reduce ? '' : '<animateMotion dur="9s" repeatCount="indefinite" rotate="auto"><mpath href="#riRoute"/></animateMotion>'}</g></svg><svg class="ri-lotus" viewBox="0 0 100 60">${LOTUS('none', 'currentColor')}</svg></div>`
      + `<span class="ri-sticker ri-sticker--vna" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#c9a43f"/><circle cx="50" cy="50" r="40" fill="none" stroke="#0b4a5a" stroke-width="1.5" stroke-dasharray="2 3"/><g transform="translate(20 22) scale(.6)">${LOTUS('#0b4a5a', '#0b4a5a')}</g><text x="50" y="76" text-anchor="middle" font-family="Fraunces, serif" font-size="20" font-weight="600" fill="#0b4a5a">VN</text></svg></span>`,
    beer: `<div class="ri-deco" aria-hidden="true"><svg class="ri-foam" viewBox="0 0 400 34" preserveAspectRatio="none"><path d="M0 0H400V16C385 28 365 8 345 20S305 32 285 18 245 6 225 22 185 32 165 16 125 6 105 20 65 32 45 16 12 10 0 20Z" fill="#fff4d6" opacity=".9"/></svg>${Array.from({ length: 12 }, () => `<i class="ri-bub" style="left:${rr(4, 96).toFixed(0)}%;animation-delay:-${rr(0, 6).toFixed(1)}s;animation-duration:${rr(5, 8).toFixed(1)}s"></i>`).join('')}<svg class="ri-barley" viewBox="0 0 60 200"><path d="M30 200V30" stroke="currentColor" stroke-width="2.5"/>${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${i % 2 ? 40 : 20}" cy="${40 + i * 18}" rx="7" ry="14" transform="rotate(${i % 2 ? 30 : -30} ${i % 2 ? 40 : 20} ${40 + i * 18})" fill="currentColor"/>`).join('')}<ellipse cx="30" cy="22" rx="6" ry="14" fill="currentColor"/></svg></div>`
      + `<span class="ri-sticker ri-sticker--beer" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="${cap}" fill="#c8102e" stroke="#8c0a1f" stroke-width="1.5"/><circle cx="50" cy="50" r="36" fill="#d81e3a" stroke="#f5c86a" stroke-width="2.5"/><circle cx="50" cy="50" r="29" fill="none" stroke="#f5c86a" stroke-width="1"/><text x="50" y="47" text-anchor="middle" font-family="Fraunces, serif" font-size="13" font-weight="700" fill="#fff4d6" letter-spacing="1">BIA</text><text x="50" y="63" text-anchor="middle" font-family="Fraunces, serif" font-size="13" font-weight="700" fill="#fff4d6">1890</text></svg></span>`,
    finder: `<div class="ri-deco" aria-hidden="true"><div class="ri-grid"></div><svg class="ri-chart" viewBox="0 0 400 180" preserveAspectRatio="none">${candles}</svg></div>`
      + `<span class="ri-sticker ri-sticker--finder" aria-hidden="true"><span class="fd-eyes"><img src="${pre}assets/img/finder-eyes.svg" alt=""></span></span>`,
    uavs: `<div class="ri-deco ri-sky" aria-hidden="true">${Array.from({ length: 14 }, () => `<i style="left:${rr(4, 96).toFixed(0)}%;top:${rr(4, 50).toFixed(0)}%;animation-delay:-${rr(0, 3.4).toFixed(1)}s"></i>`).join('')}<img class="ri-opera" src="${pre}assets/img/opera-house.png" alt="" width="900" height="310"></div>`
      + `<span class="ri-sticker ri-sticker--uavs" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#2a1052" stroke="#ffd166" stroke-width="3"/><g clip-path="circle(38px at 50px 50px)">${blades}</g><circle cx="50" cy="50" r="12" fill="#2a1052"/><circle cx="46" cy="46" r="3" fill="#fff" opacity=".7"/></svg></span>`,
  };
  infos.forEach((el) => {
    const k = [...el.classList].find((c) => c.startsWith('case-card--'))?.slice(11);
    if (DECO[k]) el.insertAdjacentHTML('beforeend', DECO[k]);
  });
  const panel = reel.querySelector('.reel__panel');
  if (!reduce && matchMedia('(hover: hover)').matches) {
    panel.addEventListener('pointermove', (e) => {
      const r = panel.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      panel.style.setProperty('--rx', `${((.5 - y) * 10).toFixed(2)}deg`);
      panel.style.setProperty('--ry', `${((x - .5) * 12).toFixed(2)}deg`);
      panel.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      panel.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      panel.classList.add('is-tilt');
    });
    panel.addEventListener('pointerleave', () => { panel.style.setProperty('--rx', '0deg'); panel.style.setProperty('--ry', '0deg'); panel.classList.remove('is-tilt'); });
  }

  // real 3D: every card sits on a cylinder; the whole ring tilts toward the pointer
  let tiltX = 0, tiltY = 0, aimX = 0, aimY = 0, bobT = 0;
  // the gentle bob runs here, not as a CSS animation: Chrome freezes the raster size of
  // CSS-animated layers, so a small back card would stay soft after it turns to the front
  const bob = (i) => (reduce ? 0 : Math.sin(bobT / 1000 * Math.PI / 3 + i * Math.PI / 2) * -5);
  const layout = () => {
    const w = ring.clientWidth, R = w * (w > 900 ? .44 : .34);
    ring.style.setProperty('--tx', `${(8 + tiltX).toFixed(2)}deg`);
    ring.style.setProperty('--ty', `${tiltY.toFixed(2)}deg`);
    items.forEach((el, i) => {
      const d = wrap(i - current), th = d * (360 / n), depth = (Math.cos(th * Math.PI / 180) + 1) / 2;
      const rad = th * Math.PI / 180;
      el.style.transform = `translate3d(${(Math.sin(rad) * R).toFixed(1)}px, ${bob(i).toFixed(2)}px, ${((Math.cos(rad) - 1) * R * 1.1).toFixed(1)}px) rotateY(${(th * .32).toFixed(2)}deg)`;
      if (!reduce) { const f = bobT / 1000 * Math.PI * 2 / 5 + i * 1.7; el.style.setProperty('--fy', `${(Math.sin(f) * -8).toFixed(2)}px`); el.style.setProperty('--fr', `${(Math.sin(f) * -1.5).toFixed(2)}deg`); }
      el.style.setProperty('--front', Math.pow(depth, 6).toFixed(3));
      el.style.setProperty('--dim', (.5 + .5 * depth).toFixed(2));
      el.style.zIndex = String(Math.round(depth * 100));
    });
  };
  ring.addEventListener('pointermove', (e) => {
    if (reduce) return;
    const r = ring.getBoundingClientRect();
    aimX = ((e.clientY - r.top) / r.height - .5) * -10; aimY = ((e.clientX - r.left) / r.width - .5) * 12;
  });
  ring.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; });
  const select = (i) => {
    active = ((i % n) + n) % n;
    infos.forEach((el, k) => { el.hidden = k !== active; });
    items.forEach((el, k) => { el.tabIndex = k === active ? 0 : -1; el.setAttribute('aria-hidden', k === active ? 'false' : 'true'); });
    const key = (items[active].className.match(/reel__item--(\w+)/) || [])[1];
    nameEl.innerHTML = `${LOGO[key] || ''}<span class="sr-only"></span>`;
    nameEl.lastChild.textContent = items[active].getAttribute('aria-label');
    nameEl.firstElementChild?.classList.add('is-new');
    countEl.textContent = String(active + 1).padStart(2, '0');
    bars.forEach((b, k) => { b.classList.toggle('is-done', k < active); b.classList.remove('is-on'); });
    if (bars[active]) { void bars[active].offsetWidth; bars[active].classList.add('is-on'); }
    reel.style.setProperty('--dur', `${DUR}ms`);
    schedule();
  };
  const go = (step) => { target += step; select(Math.round(target)); if (reduce) { current = target; layout(); } };

  const running = () => !paused && !hover && visible;
  const schedule = () => { clearTimeout(timer); reel.classList.toggle('is-paused', !running()); reel.classList.toggle('is-still', paused || !visible); reel.querySelectorAll('.ri-route').forEach((sv) => { if (paused || !visible) sv.pauseAnimations?.(); else sv.unpauseAnimations?.(); }); if (running()) timer = setTimeout(() => go(1), DUR); };
  const setPaused = (p) => { paused = p; select(active); };

  // ease the ring toward its target every frame
  const tick = (t) => {
    const dt = Math.min(64, t - (last || t)); last = t;
    const k = 1 - Math.pow(.0025, dt / 1000 * 1.6);
    const bobbing = !paused && visible;
    if (bobbing) bobT += dt;
    const moving = bobbing || Math.abs(target - current) > .0005 || Math.abs(aimX - tiltX) > .01 || Math.abs(aimY - tiltY) > .01;
    if (moving) { current += (target - current) * k; tiltX += (aimX - tiltX) * k * .6; tiltY += (aimY - tiltY) * k * .6; layout(); }
    requestAnimationFrame(tick);
  };

  // laptop: the empty stage either side of the front card is a click target to turn the ring
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    const CHEV = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
    ring.insertAdjacentHTML('beforeend',
      `<button type="button" class="reel__zone reel__zone--prev" data-cursor="←" tabindex="-1" aria-hidden="true">${CHEV('M15 5l-7 7 7 7')}</button>`
      + `<button type="button" class="reel__zone reel__zone--next" data-cursor="→" tabindex="-1" aria-hidden="true">${CHEV('M9 5l7 7-7 7')}</button>`);
    ring.querySelector('.reel__zone--prev').addEventListener('click', () => { if (!moved) go(-1); });
    ring.querySelector('.reel__zone--next').addEventListener('click', () => { if (!moved) go(1); });
  }
  // the progress dashes double as jump buttons (keyboard users' way around without arrows)
  bars.forEach((b, k) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'reel__dot'; btn.setAttribute('aria-label', items[k].getAttribute('aria-label'));
    b.replaceWith(btn); btn.append(b);
    btn.addEventListener('click', () => go(wrap(k - active)));
  });
  reel.addEventListener('mouseenter', () => { hover = true; schedule(); });
  reel.addEventListener('mouseleave', () => { hover = false; select(active); });
  reel.addEventListener('focusin', () => { hover = true; schedule(); });
  reel.addEventListener('focusout', (e) => { if (!reel.contains(e.relatedTarget)) { hover = false; select(active); } });
  reel.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });

  // a side item turns the ring to itself instead of opening its page
  let moved = false;
  items.forEach((el, i) => el.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); return; }
    if (i !== active) { e.preventDefault(); go(wrap(i - active)); }
  }));
  // drag or swipe to turn
  let sx = 0, base = 0, dragging = false;
  items.forEach((el) => { el.draggable = false; el.querySelectorAll('img').forEach((im) => { im.draggable = false; }); });
  ring.addEventListener('dragstart', (e) => e.preventDefault());
  ring.addEventListener('pointerdown', (e) => { dragging = true; moved = false; sx = e.clientX; base = target; ring.classList.add('is-drag'); });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true;
    if (moved) { target = base - dx / (ring.clientWidth * .45); current = target; layout(); }
  });
  addEventListener('pointerup', () => {
    if (!dragging) return; dragging = false; ring.classList.remove('is-drag');
    if (moved) { target = Math.round(target); select(Math.round(target)); }
    setTimeout(() => { moved = false; }, 0);
  });

  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); }, { threshold: .3 }).observe(reel);
  addEventListener('resize', layout);
  layout(); setPaused(paused);
  if (!reduce) requestAnimationFrame(tick);
})();

// ---------- Selected work: brand odds and ends drifting behind the section ----------
(() => {
  const sec = document.getElementById('work');
  if (!sec) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const st = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const I = {
    plane: `<svg viewBox="0 0 24 24"><path d="M21 12c0-.8-.7-1.3-1.5-1.3H15L10.5 3H8.6l2.2 7.7H6.3L4.6 8.6H3l1 3.4-1 3.4h1.6l1.7-2.1h4.5L8.6 21h1.9l4.5-7.7h4.5c.8 0 1.5-.5 1.5-1.3z" fill="currentColor"/></svg>`,
    lotus: `<svg viewBox="0 0 100 60"><path d="M50 8C60 22 60 40 50 52C40 40 40 22 50 8Z M50 52C34 46 24 32 26 16C40 22 48 36 50 52Z M50 52C66 46 76 32 74 16C60 22 52 36 50 52Z M50 52C30 54 14 46 6 34C22 32 40 40 50 52Z M50 52C70 54 86 46 94 34C78 32 60 40 50 52Z" ${st}/></svg>`,
    cap: `<svg viewBox="0 0 100 100"><path d="${(() => { let d = ''; for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, r = i % 2 ? 42 : 47; d += `${i ? 'L' : 'M'}${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; })()}" ${st}/><circle cx="50" cy="50" r="30" ${st}/></svg>`,
    coin: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" ${st}/><circle cx="50" cy="50" r="34" ${st} stroke-dasharray="3 6"/><path d="M42 32v36M48 32v-6M48 74v-6M42 32h14a9 9 0 0 1 0 18H42M42 50h16a9 9 0 0 1 0 18H42" ${st}/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="currentColor"/></svg>`,
    aperture: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" ${st}/>${Array.from({ length: 6 }, (_, i) => `<path d="M50 6L62 46" ${st} transform="rotate(${i * 60} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="14" ${st}/></svg>`,
    bubbles: `<svg viewBox="0 0 60 60"><circle cx="20" cy="40" r="10" ${st}/><circle cx="42" cy="22" r="7" ${st}/><circle cx="44" cy="46" r="4" ${st}/></svg>`,
    chart: `<svg viewBox="0 0 120 60"><path d="M4 52L30 36L52 42L80 18L116 8" ${st}/><path d="M104 6h12v12" ${st}/></svg>`,
    sail: `<svg viewBox="0 0 120 60"><path d="M10 56Q8 30 30 10Q34 36 44 56Z M40 56Q40 22 70 4Q72 34 84 56Z M78 56Q80 34 104 22Q104 42 112 56Z M2 56H118" ${st}/></svg>`,
  };
  // [icon, left%, top%, size px, depth, tone, extra class]
  const P = [
    ['plane', 3, 6, 70, 'near', 'teal', ''], ['lotus', 84, 3, 120, 'mid', 'gold', ''], ['star', 50, 3, 22, 'near', 'gold', ''],
    ['cap', 1, 40, 96, 'mid', 'red', ''], ['coin', 94, 34, 84, 'near', 'gold', ''], ['bubbles', 34, 10, 60, 'far', 'red', 'wf--hide-sm'],
    ['aperture', 2, 80, 80, 'mid', 'purple', ''], ['chart', 72, 90, 130, 'far', 'blue', ''], ['sail', 36, 92, 150, 'mid', 'purple', ''],
    ['plane', 62, 14, 40, 'far', 'teal', 'wf--hide-sm'], ['star', 96, 70, 18, 'near', 'gold', ''], ['star', 24, 58, 16, 'mid', 'gold', ''],
    ['bubbles', 90, 84, 54, 'near', 'red', ''], ['coin', 18, 30, 44, 'far', 'blue', 'wf--hide-sm'], ['lotus', 56, 60, 90, 'far', 'teal', ''],
    ['aperture', 44, 40, 56, 'far', 'purple', 'wf--hide-sm'], ['cap', 76, 55, 52, 'far', 'red', 'wf--hide-sm'], ['star', 8, 22, 14, 'near', 'gold', ''],
  ];
  const D = { far: 10, mid: 22, near: 38 };
  const layer = document.createElement('div');
  layer.className = 'work-float'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = P.map(([k, x, y, s, d, tone, cls], i) => `<i class="wf wf--${d}${tone ? ' wf--' + tone : ''} ${cls}" style="left:${x}%;top:${y}%;--s:${s}px;--d:${D[d]};--t:${12 + (i % 5) * 2}s;--dl:-${(i * 1.7).toFixed(1)}s"><span>${I[k]}</span></i>`).join('');
  sec.prepend(layer);
  if (!reduce && matchMedia('(hover: hover)').matches) {
    sec.addEventListener('pointermove', (e) => {
      const r = sec.getBoundingClientRect();
      layer.style.setProperty('--px', (((e.clientX - r.left) / r.width - .5) * -1).toFixed(3) + 'px');
      layer.style.setProperty('--py', (((e.clientY - r.top) / r.height - .5) * -1).toFixed(3) + 'px');
    });
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => sec.classList.toggle('is-still', !e.isIntersecting)).observe(sec);
})();

// ---------- Clients: tiles are dealt onto the table, then tilt toward the pointer ----------
(() => {
  const grid = document.querySelector('.brands');
  if (!grid) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiles = [...grid.querySelectorAll('.brand')];
  tiles.forEach((t, i) => {
    t.style.setProperty('--dl', `${(i * .08).toFixed(2)}s`);
    t.style.setProperty('--r0', `${i % 2 ? 4 : -4}deg`);
    t.insertAdjacentHTML('beforeend', '<span class="brand__glare" aria-hidden="true"></span>');
  });
  if (reduce || !('IntersectionObserver' in window)) { grid.classList.add('is-in'); return; }
  grid.classList.add('js-deal');
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { grid.classList.add('is-in'); io.disconnect(); } }, { threshold: .2 });
  io.observe(grid);
  if (!matchMedia('(hover: hover)').matches) return;
  tiles.forEach((t) => {
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty('--rx', `${((.5 - y) * 9).toFixed(2)}deg`);
      t.style.setProperty('--ry', `${((x - .5) * 11).toFixed(2)}deg`);
      t.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      t.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      t.classList.add('is-tilt');
    });
    t.addEventListener('pointerleave', () => { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); t.classList.remove('is-tilt'); });
  });
})();

// About page: skill icons play in view and on hover; studies lighthouse; experience timeline.
(() => {
  const skills = [...document.querySelectorAll('.skill')];
  const study = document.querySelector('.study');
  const xp = document.querySelector('.xp');
  if (!skills.length && !study && !xp) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-about');
  const xpItems = xp ? [...xp.querySelectorAll('.xp__item')] : [];
  const play = (el) => { el.classList.remove('is-play'); void el.offsetWidth; el.classList.add('is-play'); };
  if (!('IntersectionObserver' in window) || reduce) {
    [...skills, ...xpItems].forEach((el) => el.classList.add('is-in'));
    study?.classList.add('is-in');
    return;
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('is-in'); io.unobserve(el);
    if (el.classList.contains('skill')) setTimeout(() => play(el), 250 + (+getComputedStyle(el).getPropertyValue('--k') || 0) * 70);
  }), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  [...skills, ...xpItems].forEach((el) => io.observe(el));
  skills.forEach((el) => el.addEventListener('mouseenter', () => { if (el.classList.contains('is-in')) play(el); }));
  if (study) {
    io.observe(study);
    // the beam, stars and sea only run while the card is on screen
    new IntersectionObserver(([e]) => study.classList.toggle('is-live', e.isIntersecting)).observe(study);
  }
  if (xp) {
    const fill = () => {
      const r = xp.getBoundingClientRect(), mid = innerHeight * .6;
      xp.style.setProperty('--p', Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3));
    };
    addEventListener('scroll', fill, { passive: true }); addEventListener('resize', fill); fill();
  }
})();
