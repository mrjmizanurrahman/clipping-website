// ClipKoro static demo — mirrors the live app's layout and flow.
// The live app (inside Muse) renders real MP4 clips with the PeakCut engine.
(function () {
  // ---- This device card (real browser info, like the live app) ----
  const deviceInfo = document.getElementById('deviceInfo');
  try {
    const cores = navigator.hardwareConcurrency || 'unknown';
    const ram = navigator.deviceMemory ? '~' + navigator.deviceMemory + ' GB' : 'unknown';
    let gpu = 'unknown';
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    }
    const kind = /Mobi|Android/i.test(navigator.userAgent) ? 'Phone/tablet' : 'PC';
    deviceInfo.textContent = kind + ' · CPU cores: ' + cores + ' · RAM: ' + ram + ' · GPU: ' + gpu;
  } catch (e) {
    deviceInfo.textContent = 'Could not detect device info.';
  }

  // ---- Engine CPU gauge (demo animation) ----
  const gauge = document.getElementById('cpuGauge');
  const cpuText = document.getElementById('cpuText');
  function tickGauge() {
    const v = 55 + Math.round(Math.random() * 40);
    gauge.style.width = v + '%';
    cpuText.textContent = 'CPU rendering at ' + v + '% · GPU: none on this machine';
  }
  tickGauge();
  setInterval(tickGauge, 2500);

  // ---- Demo clips (his real DAY 4 render titles/scores, as shown in the live app) ----
  const demoClips = [
    { title: 'Accidental Store Robbery in GTA 6', score: 83, dur: '0:17' },
    { title: 'Escaping a 6 Star Wanted Level in GTA 6', score: 82, dur: '0:19' },
    { title: '69 Hours into GTA 6 and Only 51% Done', score: 82, dur: '0:21' },
    { title: 'Escaping the Cops in GTA 6', score: 78, dur: '0:16' },
    { title: 'Taking hot sauce shots every time they die in GTA 6', score: 78, dur: '0:18' },
  ];
  const clipsEl = document.getElementById('clips');

  function clipCard(c) {
    const card = document.createElement('div');
    card.className = 'clip-card';
    card.innerHTML =
      '<div class="clip-thumb">🎬<span class="clip-score">' + c.score + '</span></div>' +
      '<h3>' + c.title + '</h3>' +
      '<p class="clip-meta">' + c.dur + ' · 9:16 · 1080×1920 · captions on</p>' +
      '<div class="clip-actions"><button type="button">▶ Play</button>' +
      '<button type="button">⬇ MP4</button>' +
      '<button type="button" class="del">Delete</button></div>';
    card.querySelector('.del').addEventListener('click', () => {
      if (confirm('Delete this clip?')) card.remove();
    });
    return card;
  }
  demoClips.forEach((c) => clipsEl.appendChild(clipCard(c)));
  document.getElementById('zipBtn').addEventListener('click', () => {
    alert('Demo only — in the live app this downloads all clips as one zip.');
  });

  // ---- Make Clips flow with the big % ring (like the live app) ----
  const form = document.getElementById('clipForm');
  const urlInput = document.getElementById('streamUrl');
  const badge = document.getElementById('platformBadge');
  const wrap = document.getElementById('progressWrap');
  const ringFg = document.getElementById('ringFg');
  const ringPct = document.getElementById('ringPct');
  const ringStage = document.getElementById('ringStage');
  const CIRC = 326.7;
  const stages = [
    [0, 'Reading the stream…'],
    [15, 'Downloading the stream…'],
    [35, 'Transcribing speech…'],
    [55, 'AI is finding the best moments…'],
    [78, 'Rendering vertical clips…'],
    [94, 'Burning in captions…'],
    [100, 'Finishing the clips'],
  ];
  function platformOf(url) {
    if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube';
    if (/twitch\.tv/.test(url)) return 'Twitch';
    if (/kick\.com/.test(url)) return 'Kick';
    return null;
  }
  function setProgress(pct) {
    ringFg.style.strokeDashoffset = String(CIRC * (1 - pct / 100));
    ringPct.textContent = pct + '%';
    for (const [at, label] of stages) if (pct >= at) ringStage.textContent = label;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const platform = platformOf(urlInput.value.trim());
    if (!platform) {
      badge.textContent = '⚠️ That link is not YouTube, Twitch or Kick.';
      return;
    }
    badge.textContent = platform + ' link — job sent to the engine…';
    wrap.classList.remove('hidden');
    let pct = 0;
    setProgress(0);
    const timer = setInterval(() => {
      pct = Math.min(100, pct + Math.ceil(Math.random() * 3));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        badge.textContent = '✅ Done — new clips would appear in the Clips section below.';
      }
    }, 110);
  });
})();
