// ClipStream — front-end demo logic
// Real stream processing (downloading the VOD, reading live chat,
// audio panic detection and caption generation) runs on a backend
// worker; this page handles link intake, platform detection,
// moment scoring display and the clip list.

const form = document.getElementById('clipForm');
const input = document.getElementById('streamUrl');
const badge = document.getElementById('platformBadge');
const statusEl = document.getElementById('status');
const clipsEl = document.getElementById('clips');

function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
  if (u.includes('twitch.tv')) return 'Twitch';
  if (u.includes('kick.com')) return 'Kick';
  return null;
}

input.addEventListener('input', () => {
  const platform = detectPlatform(input.value);
  badge.textContent = platform ? `Platform detected: ${platform}` : '';
});

// Demo moment generator: in production these come from the backend
// analysis (chat messages per second + audio panic spikes).
function analyseStream(platform) {
  const moments = [
    { at: '12:04', chatSpike: 94, panic: 61, caption: '"NO WAY! Did you see that?!"' },
    { at: '38:47', chatSpike: 71, panic: 97, caption: '"RUN RUN RUN — he is behind me!"' },
    { at: '1:05:19', chatSpike: 88, panic: 83, caption: '"I cannot believe we actually won that!"' },
  ];
  return moments.map(m => ({
    ...m,
    platform,
    score: Math.round(m.chatSpike * 0.55 + m.panic * 0.45),
  })).sort((a, b) => b.score - a.score);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const platform = detectPlatform(input.value);
  if (!platform) {
    statusEl.textContent = 'Please paste a YouTube, Twitch or Kick link.';
    return;
  }
  statusEl.textContent = `Analysing ${platform} stream — watching chat spikes and panic moments…`;
  clipsEl.innerHTML = '';

  setTimeout(() => {
    const clips = analyseStream(platform);
    statusEl.textContent = `${clips.length} best clips found from this ${platform} stream:`;
    clipsEl.innerHTML = clips.map((c, i) => `
      <article class="clip">
        <h3>Clip ${i + 1} — ${c.at} <span class="score">★ ${c.score}/100</span></h3>
        <p>💬 Chat spike: ${c.chatSpike}% &nbsp; 😱 Panic: ${c.panic}% &nbsp; 📺 ${c.platform}</p>
        <span class="caption caption-${document.getElementById('captionStyle').value}">${c.caption}</span>
      </article>`).join('');
  }, 1200);
});

// Google sign-up: wire this to Google Identity Services / Firebase Auth
// with your OAuth Client ID to enable real accounts.
document.getElementById('googleSignIn').addEventListener('click', () => {
  alert('Google sign-up: add your Google OAuth Client ID in the backend config to enable real sign-in.');
});
