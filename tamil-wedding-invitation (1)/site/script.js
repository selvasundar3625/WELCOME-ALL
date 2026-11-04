(() => {
  const $ = s => document.querySelector(s);
  let playing = false;

  // ---- falling petals + gold sparkles ----
  const cv = $('#fx'), cx = cv.getContext('2d');
  let W, H;
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  addEventListener('resize', resize); resize();
  const cols = ['#e11d48', '#ff8a1f', '#f6c33b', '#d6336c'];
  const mk = r => ({ x: Math.random() * W, y: r ? Math.random() * H : -20, s: 5 + Math.random() * 7, v: .5 + Math.random() * 1.1,
    a: Math.random() * 6, c: cols[Math.random() * 4 | 0], sp: Math.random() < .25 });
  const ps = Array.from({ length: innerWidth < 700 ? 26 : 50 }, () => mk(true));
  (function loop() {
    cx.clearRect(0, 0, W, H);
    ps.forEach((p, i) => {
      p.y += p.v; p.a += .03; p.x += Math.sin(p.a) * .8;
      if (p.y > H + 20) ps[i] = mk();
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a);
      if (p.sp) { cx.fillStyle = 'rgba(255,225,130,.9)'; cx.shadowColor = '#fff1b0'; cx.shadowBlur = 8; cx.beginPath(); cx.arc(0, 0, 1.8, 0, 7); cx.fill(); }
      else { cx.fillStyle = p.c; cx.globalAlpha = .85; cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * .55, 0, 0, 7); cx.fill(); }
      cx.restore();
    });
    requestAnimationFrame(loop);
  })();

  // ---- background music ----
  const music = $('#backgroundMusic');
  const mBtn = $('#music');
  function setMusic(on) {
    playing = on;
    mBtn.textContent = on ? '🔊' : '🔇';
    if (!on) { music.pause(); return; }
    music.play().catch(error => {
      if (!playing) return;
      playing = false;
      mBtn.textContent = '🔇';
      console.error('Background music could not be played.', error);
    });
  }
  mBtn.onclick = () => setMusic(!playing);

  // ---- open the seal ----
  $('#seal').onclick = () => {
    $('#env').classList.add('open');
    setMusic(true);
    setTimeout(() => $('#cover').classList.add('gone'), 1900);
    setTimeout(() => { document.body.classList.remove('locked'); mBtn.hidden = false; $('#cover').style.display = 'none'; observe(); }, 3500);
  };

  // ---- scroll reveal (staggered) ----
  function observe() {
    document.querySelectorAll('.sec').forEach(s => s.querySelectorAll('.rv').forEach((e, i) => e.style.setProperty('--d', i * .15 + 's')));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
    document.querySelectorAll('.rv').forEach(e => io.observe(e));
  }

  // ---- countdown to 22 Nov 2026, 11:30 IST ----
  const cd = $('#count'), target = new Date('2026-11-22T11:30:00+05:30');
  let rem; function tick2() { rem = Math.max(0, target - Date.now()); cd.innerHTML = [[864e5, 'DAYS'], [36e5, 'HRS'], [6e4, 'MIN'], [1e3, 'SEC']].map(([m, l]) => { const v = Math.floor(rem / m); rem -= v * m; return `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`; }).join(''); }
  tick2(); setInterval(tick2, 1000);

  // ---- WhatsApp share ----
  const msg = 'You are warmly invited to the Wedding Reception of S.Naveenkumar & S.Nithyasri – Sunday, 22 November 2026, 11:30 AM to 1:00 PM, Ponnusamy Gounder Thirumana Mandapam A/C, Opp. New Bus Stand, Salem.\n' + location.href;
  $('#wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
})();
