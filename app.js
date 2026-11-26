// ClipKoro static demo — previews the Make Clips → Clips flow.
// The live app renders real MP4 clips with the PeakCut engine.
(function () {
  const form = document.getElementById('clipForm');
  const urlInput = document.getElementById('streamUrl');
  const countSel = document.getElementById('clipCount');
  const badge = document.getElementById('platformBadge');
  const status = document.getElementById('status');
  const clipsEl = document.getElementById('clips');
  const wrap = document.getElementById('progressWrap');
  const ringFg = document.getElementById('ringFg');
  const ringPct = document.getElementById('ringPct');
  const ringStage = document.getElementById('ringStage');
  const CIRC = 326.7;

  function platformOf(url) {
    if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube';
    if (/twitch\.tv/.test(url)) return 'Twitch';
    if (/kick\.com/.test(url)) return 'Kick';
    return null;
  }

  const stages = [
    [0, 'Reading the stream…'],
    [18, 'Downloading…'],
    [38, 'Transcribing speech…'],
    [58, 'Finding best moments…'],
    [80, 'Rendering vertical clips…'],
    [96, 'Burning in captions…'],
    [100, 'Done'],
  ];

  function setProgress(pct) {
    ringFg.style.strokeDashoffset = String(CIRC * (1 - pct / 100));
    ringPct.textContent = pct + '%';
    for (const [at, label] of stages) if (pct >= at) ringStage.textContent = label;
  }

  function fakeClip(i) {
    const card = document.createElement('div');
    card.className = 'clip-card';
    card.innerHTML =
      '<div class="clip-thumb">🎬</div>' +
      '<h3>Demo clip ' + (i + 1) + '</h3>' +
      '<p class="clip-meta"><span class="score">AI score ' + (70 + i * 3) + '</span> · 9:16 · 1080×1920</p>' +
      '<div class="clip-actions"><button type="button">▶ Play</button>' +
      '<button type="button">⬇ MP4</button>' +
      '<button type="button" class="del">Delete</button></div>';
    card.querySelector('.del').addEventListener('click', () => {
      if (confirm('Delete this clip?')) card.remove();
    });
    return card;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    const platform = platformOf(url);
    if (!platform) {
      badge.textContent = '⚠️ That link is not YouTube, Twitch or Kick.';
      return;
    }
    badge.textContent = platform + ' link detected — making clips…';
    clipsEl.innerHTML = '';
    status.textContent = '';
    wrap.classList.remove('hidden');
    let pct = 0;
    setProgress(0);
    const timer = setInterval(() => {
      pct = Math.min(100, pct + Math.ceil(Math.random() * 4));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        const n = parseInt(countSel.value, 10);
        for (let i = 0; i < n; i++) clipsEl.appendChild(fakeClip(i));
        status.textContent = n + ' demo clips ready (live app renders the real MP4s).';
      }
    }, 120);
  });
})();
