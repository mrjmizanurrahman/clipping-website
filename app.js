// ClipKoro static demo — mirrors the live app (ClipForge-style dashboard).
// The live app runs inside Muse and renders REAL MP4 clips with the PeakCut
// engine. This GitHub copy is a static demo: buttons animate, nothing renders.
(function () {
  // ---- View switching ----
  const navItems = document.querySelectorAll('.nav-item');
  function show(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const el = document.getElementById('view-' + view);
    if (el) el.classList.remove('hidden');
    navItems.forEach(n => n.classList.toggle('active', n.dataset.view === view));
  }
  navItems.forEach(n => n.addEventListener('click', () => show(n.dataset.view)));
  document.querySelectorAll('[data-goto]').forEach(b =>
    b.addEventListener('click', () => show(b.dataset.goto)));

  // ---- Real data from Mizanur's renders ----
  const projects = [
    { icon: '🏎️', title: 'GTA 6 — DAY 3 (rerun)', meta: '6 clips • YouTube live' },
    { icon: '🚓', title: 'GTA 6 — DAY 4', meta: '5 clips • YouTube live' },
    { icon: '💸', title: 'GTA 6 — DAY 3 (first run)', meta: '2 clips • YouTube live' }
  ];
  const projHTML = p => `<div class="project"><div class="thumb">${p.icon}</div><b>${p.title}</b><span class="muted">${p.meta}</span></div>`;
  document.getElementById('projectsRow').innerHTML = projects.map(projHTML).join('');
  document.getElementById('projectsFull').innerHTML = projects.map(projHTML).join('');

  const clips = [
    { icon: '🚓', title: 'Narrow Escape from a Cop Car', score: 85, dur: 26.9 },
    { icon: '💰', title: '10k Deposit Chaos', score: 82, dur: 16.5 },
    { icon: '🚗', title: 'Unexpected Luxury Car Reveal', score: 78, dur: 16.9 },
    { icon: '🌉', title: 'Bridge Crossing Chaos', score: 75, dur: 18.0 },
    { icon: '⭐', title: 'Four Stars to Strip Club Chaos', score: 70, dur: 16.1 },
    { icon: '🏁', title: "Dylan Goes After Paul Walker's Car", score: 70, dur: 16.5 },
    { icon: '🔫', title: 'Accidental Store Robbery in GTA 6', score: 83, dur: 20.0 },
    { icon: '🚔', title: 'Escaping a 6 Star Wanted Level in GTA 6', score: 82, dur: 22.0 },
    { icon: '⏰', title: '69 Hours into GTA 6 and Only 51% Done', score: 82, dur: 19.0 },
    { icon: '🏃', title: 'Escaping the Cops in GTA 6', score: 78, dur: 17.0 },
    { icon: '🌶️', title: 'Taking hot sauce shots every time they die in GTA 6', score: 78, dur: 21.0 }
  ];
  const grid = document.getElementById('clipsGrid');
  grid.innerHTML = clips.map((c, i) => `
    <div class="clip">
      <div class="thumb">${c.icon}<span class="score">${c.score}%</span></div>
      <b>${c.title}</b>
      <div class="muted">Duration: <span id="dur-${i}">${c.dur.toFixed(1)}s</span> • 9:16 • 1080×1920</div>
      <div class="clip-actions">
        <button>▶ Play</button><button>⬇ MP4</button><button>🗑</button>
      </div>
      <div class="len-row">
        <span>⏱ Clip length</span>
        <button data-len="${i}" data-d="-10">−10s</button>
        <button data-len="${i}" data-d="-5">−5s</button>
        <button data-len="${i}" data-d="5">+5s</button>
        <button data-len="${i}" data-d="10">+10s</button>
      </div>
      <div class="len-row">
        <button class="ok-btn">✓ Approve</button>
        <button class="rej-btn">✕ Reject</button>
      </div>
    </div>`).join('');

  // Clip length buttons: in the LIVE app these re-render the clip through the
  // engine; here they only adjust the demo number.
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-len]');
    if (btn) {
      const i = +btn.dataset.len, d = +btn.dataset.d;
      clips[i].dur = Math.min(120, Math.max(5, clips[i].dur + d));
      document.getElementById('dur-' + i).textContent = clips[i].dur.toFixed(1) + 's';
      return;
    }
    if (e.target.closest('.rej-btn')) {
      const card = e.target.closest('.clip');
      if (confirm('Reject and delete this clip? (demo)')) card.remove();
    }
  });

  // ---- Pills ----
  document.querySelectorAll('.pills').forEach(group => {
    group.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      group.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    });
  });
  document.querySelectorAll('.swatches .sw').forEach(s =>
    s.addEventListener('click', () => {
      document.querySelectorAll('.swatches .sw').forEach(x => x.classList.remove('on'));
      s.classList.add('on');
    }));

  // ---- Batch import toggle ----
  const batch = document.getElementById('batchInput');
  document.getElementById('batchToggle').addEventListener('click', () =>
    batch.classList.toggle('hidden'));

  // ---- Analyze demo: animated % ring ----
  const stages = ['Reading the stream…', 'Transcribing speech (Whisper)…', 'Finding best moments…', 'Scoring highlights…', 'Rendering vertical clips…', 'Burning in captions…', 'Finishing the clips'];
  document.getElementById('analyzeBtn').addEventListener('click', () => {
    const wrap = document.getElementById('ringWrap');
    const pct = document.getElementById('ringPct');
    const stage = document.getElementById('ringStage');
    wrap.classList.remove('hidden');
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 7);
      pct.textContent = Math.floor(p) + '%';
      stage.textContent = stages[Math.min(stages.length - 1, Math.floor(p / (100 / stages.length)))];
      if (p >= 100) { clearInterval(t); stage.textContent = 'Done — see Suggested Clips below (demo). In the live app these are real rendered MP4s.'; }
    }, 220);
  });

  // ---- CPU bar wiggle (demo) ----
  const cpuBar = document.getElementById('cpuBar'), cpuVal = document.getElementById('cpuVal');
  setInterval(() => {
    const v = 30 + Math.round(Math.random() * 40);
    cpuBar.style.width = v + '%'; cpuVal.textContent = v + '%';
  }, 1800);

  // ---- This device (real browser info, like the live app) ----
  const dc = document.getElementById('deviceCard');
  if (dc) {
    const cores = navigator.hardwareConcurrency || '?';
    const ram = navigator.deviceMemory ? '~' + navigator.deviceMemory + ' GB' : 'n/a';
    let gpu = 'unknown';
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
      if (gl && dbg) gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
    } catch (e) { /* keep unknown */ }
    dc.innerHTML = `<b>This device</b><br>CPU cores: ${cores} • RAM: ${ram}<br>GPU: ${gpu}<br><span class="muted">Pages and players run on your device; heavy rendering runs on the engine computer.</span>`;
  }
})();
