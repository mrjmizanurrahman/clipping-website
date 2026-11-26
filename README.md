# ClipKoro — Link dao, best clip nao

Paste a YouTube / Twitch / Kick stream link, get the best moments back as
captioned vertical clips, ready for Shorts / TikTok / Reels.

## What ClipKoro does

1. **Make Clips** — paste a stream link, choose how many clips (3 / 5 / 10),
   and ClipKoro sends it to the rendering engine.
2. The engine downloads the stream, transcribes the speech, and uses AI to
   find the best moments (big reactions, funny/chaotic moments, highlights).
3. **Clips** — finished clips appear in the Clips section: play them, download
   the MP4, download all as a zip, or delete a clip you don't want.

That is the whole app — just **Make Clips** and **Clips**. Simple on purpose.

## Output

- **Vertical 9:16 only** — 1080×1920 MP4, captions burned into the video.
- Every clip gets an AI score so the best moments are easy to spot first.

## How it works (engine)

- Rendering engine: **PeakCut** (Python + FFmpeg + Whisper speech-to-text).
- AI moment-finding runs through a free Gemini key with an automatic free
  fallback (Pollinations) — **no paid API key needed**.
- The engine currently runs on a CPU server (no GPU on that machine yet);
  rendering works, it is just CPU-paced.

## This repository

This repo holds the static front-end demo of ClipKoro (`index.html`,
`styles.css`, `app.js`) — open `index.html` in a browser or serve the folder:

```bash
npx serve .
```

The **live app** (connected to the real engine, real clips) runs as a
full-stack app inside Muse, so it has no public URL; this demo shows the
same design and flow without the engine behind it.

## Supported platforms

- YouTube
- Twitch
- Kick
