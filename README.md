# ClipStream — Clipping Website

Paste a live stream link, get the best moments as captioned clips.

## Output ratio
**Vertical 9:16 only** — clips, previews and caption layouts are locked to vertical (9:16), for Shorts / TikTok / Reels. (Corrected by Mizanur on 2026-11-26, replacing an earlier 16:9 note.)

## Supported platforms
- YouTube
- Twitch
- Kick

Just submit the stream link — everything else is automatic.

## How best moments are found
1. **Chat spike** — moments where many people comment at the same time are treated as important.
2. **Panic detection** — moments where the streamer panics / reacts loudly score higher.
3. **Auto captions** — every clip is generated with captions, ready for Shorts / TikTok / Reels.

## Sign-up
Sign-up is with **Google** (button in the header). To enable real accounts,
add a Google OAuth Client ID (Google Identity Services or Firebase Auth)
in the backend config.

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Roadmap (backend)
- Stream/VOD ingestion for YouTube, Twitch and Kick
- Live-chat collector to measure comment spikes in real time
- Audio analysis for panic / loud-reaction detection
- Speech-to-text caption generation and clip rendering
- Google OAuth sign-in and per-user clip libraries
