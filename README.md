# ClipKoro — Link dao, best clip nao

Paste a YouTube / Twitch / Kick stream link, get the best moments back as
captioned vertical clips, ready for Shorts / TikTok / Reels.

**This repository is a static demo** of the ClipKoro web app. The live app
runs inside Muse, connected to a local PeakCut engine that does the real
work: downloading the stream, transcribing speech, scoring the best moments,
and rendering real MP4 files. This demo mirrors the app's interface and uses
the real clip titles and scores from actual renders — every button on the
page works (approve / reject, rename, duplicate, sort, settings, a real
zip download of the clip kits), but nothing renders video here and no
data leaves the page.

## What the live app does

- **Make clips:** paste one link — or many, with batch import — pick a
  duration (15s / 30s / 45s / 60s / 90s), a highlight count and a caption
  language (English / Bangla / Hindi), and watch the circular % ring show
  the engine's live stage.
- **Real renders:** every clip is a real MP4 — vertical 9:16, 1080 × 1920,
  H.264, AAC, 30 fps — with captions burned in, verified with ffprobe.
- **Caption studio:** 8 caption styles (Bold Pop, Karaoke, Neon Glow,
  Minimal, Comic Pop, Typewriter, Cinema, Bubble) in one global brand kit
  applied to all clips; changing a style re-renders the clip.
- **Per-clip length adjust:** make any clip longer or shorter (−10s / −5s /
  +5s / +10s or a custom length); the engine re-renders that moment and the
  new MP4 replaces the old one.
- **Suggested clips:** approve to keep, reject to delete.
- **Projects:** search, sort (newest / longest / most clips), favorite,
  rename, duplicate and delete — all saved.
- **Export Studio:** per-clip MP4 download, one-click zip of a whole
  project, social presets (Shorts / TikTok / Reels — label only, output
  stays 9:16), and an export history.
- **No paid AI keys:** highlight scoring runs through a free Gemini key
  with a free no-key fallback; the engine reports its hardware honestly —
  the current engine machine has no GPU, so rendering is CPU and the site
  says so.

## Latest passes

- **GitHub fix pass (this push):** the demo was click-tested end to end and
  everything thin or dead was repaired — Reject now removes the card with
  feedback (it also deletes the clip from the demo list), project Rename,
  Duplicate and sort pills are wired, the Roadmap shows the full 33-item
  checklist with Done / Partial / Planned badges (13 / 13 / 7), Settings
  defaults are real controls that pre-fill the Create form, the Create
  view carries your link into the Dashboard form and starts the analysis,
  the preview plays and pauses, Export-all downloads a real zip file, and
  the DAY 5 project appears with its Error badge and a Resume button —
  mirroring the live app, where Resume genuinely re-runs a failed job.
- **Resume + Flowstate (live app):** failed jobs can be resumed from their
  saved transcript instead of starting over, and the live Dashboard hero
  carries the Flowstate WebGL fluid mix. The live app's AI also routes
  through a local FreeLLMAPI pool (Gemini + Pollinations) so one free
  quota ending no longer stops clipping.
- **Master rebuild + test pass:** every feature re-audited and all backend
  actions exercised live. Headline fix — large downloads (a 39 MB clip,
  63 MB and 102 MB project zips) used to die mid-transfer; they now stream
  in chunks and were verified byte-exact and CRC-checked. Errors that used
  to fail silently (brand-kit save, import delete, project delete) now
  show on screen.
- **Unslop design pass:** the interface was redesigned with the
  [unslop](https://github.com/heydamir/unslop) skill by Damir Sokolovsky
  (CC BY 4.0). Gradients, glow and shouty badges are gone; the chrome is
  quiet ink neutrals with one flat violet accent, sentence-case labels,
  uniform spacing, and an editor's timeline-tick divider as the signature
  detail. The colour lives where it belongs — in the clip previews and
  the % ring.

## Watching clips here

Every clip card has a **Watch** button: it opens a YouTube player inside
the card, starting at that clip's real moment in the real source stream
(start seconds come from the engine's job records). It plays the source
footage, not the rendered vertical MP4 — the rendered MP4s with burned-in
captions play and download in the live app.

## Google sign-in

The sidebar's **Sign in with Google** button runs the real Google
Identity Services flow. It needs this site's own free OAuth Client ID:

1. Google Cloud Console → APIs & Services → Credentials → Create
   credentials → OAuth client ID → Web application.
2. Under "Authorized JavaScript origins" add
   `https://mrjmizanurrahman.github.io`.
3. Paste the Client ID into `GOOGLE_CLIENT_ID` at the top of the
   sign-in section in `app.js`.

A Client ID is public (it is sent to every visitor's browser), not a
secret. Until it is added, the button explains this instead of opening a
dead popup. On a static site, sign-in shows your Google name and photo;
it cannot unlock clip generation, because generation needs the engine.

## Honest limits

- This demo cannot render video or generate new clips — GitHub Pages
  serves static files only, and clipping needs a running engine
  (FFmpeg + speech model + AI). Generation works in the live app inside
  Muse, and on the owner's PC setup. Downloads here are small "clip kit"
  text files (Export-all bundles them into a real .zip). The live app
  downloads the real MP4s.
- GPU rendering (CUDA / NVENC), in-browser timeline rendering, phone-side
  offline processing and platform OAuth sign-in are planned, not faked —
  they need hardware or accounts this setup does not have.

## Files

- `index.html` — the dashboard demo (sidebar views: Dashboard, Create,
  Export, Projects, Platforms, Roadmap, Settings)
- `styles.css` — the unslop design system
- `app.js` — view switching, the simulated % ring, clip cards with length
  controls, projects tools and real device detection
