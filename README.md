# ClipKoro — Link dao, best clip nao

Paste a YouTube / Twitch / Kick stream link, get the best moments back as
captioned vertical clips, ready for Shorts / TikTok / Reels.

This repo holds the **static demo** of ClipKoro, mirroring the live app's
current ClipForge-style interface. The live app runs inside Muse, connected
to the real PeakCut engine, and renders actual MP4 files. This static copy
animates the flow but does not render video.

## What the live app does

- **Create Clip** — paste a stream link (or many, with Batch Import), pick
  clip duration (15s–90s / custom), highlights count (3–20), caption style
  and language (English / Bangla / Banglish / Hindi)
- **Automatic highlights** — the engine transcribes with Whisper, scores the
  best moments, and renders vertical **9:16, 1080×1920** MP4s with captions
  burned in
- **⏱ Clip length adjust** — make any clip longer or shorter (−10s…+10s or
  custom); the engine re-renders that moment and replaces the clip
- **Approve / Reject** on suggested clips, per-clip Play / MP4 download /
  Delete, one-click ZIP export of a whole project
- **Dashboard** — real totals, processing history, recent activity, engine
  and AI status
- **Projects** — search, sort, favorite, rename, duplicate, delete
- **Caption Studio** — 8 styles (Bold Pop, Karaoke, Neon Glow, Minimal,
  Comic Pop, Typewriter, Cinema, Bubble) in one global brand kit
- **Export Studio** — Shorts / TikTok / Reels presets, export history
- **No key needed** — best-moment AI runs through a free fallback chain;
  **no GPU on the engine machine**, so rendering is CPU-based and the site
  says so honestly
- **Roadmap** — a 33-item feature checklist with honest status
  (13 done, 13 partial via the engine, 7 planned)
- **Polished layout** — sidebar navigation switches views (no long scroll),
  stat cards show full labels with sparklines in their own row, and long
  titles wrap instead of being cut off

## Files

- `index.html` — the dashboard (sidebar, hero, stats, create flow, clips)
- `styles.css` — dark purple ClipForge-style theme
- `app.js` — view switching, demo % ring, clip-length demo controls,
  real device detection

## Honest limits

- Hype scores are AI-estimated, not live-chat telemetry.
- Twitch / Kick clips open via timestamped watch links in the planner;
  rendered MP4s come from the engine for downloadable sources.
- CUDA / NVENC would need the engine on a GPU machine — planned, not faked.
