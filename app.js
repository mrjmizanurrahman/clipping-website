// ClipKoro static demo — mirrors the live app after the master rebuild (v22),
// the unslop design pass (v23), the Resume feature (v24) and the Flowstate
// hero mix (v25), plus the GitHub fix pass: every control on this page works.
// The live app runs inside Muse and renders REAL MP4 clips with the PeakCut
// engine. This GitHub copy is a static demo: controls animate and respond,
// downloads are real files (clip kits / a real zip of kits), but nothing
// renders video and no data leaves the page.
(function () {
  // ---- Toast ----
  var toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  // ---- View switching ----
  var navBtns = document.querySelectorAll(".nav-item");
  function show(view) {
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    var el = document.getElementById("view-" + view);
    if (el) el.classList.add("active");
    navBtns.forEach(function (b) { b.classList.toggle("active", b.dataset.view === view); });
    window.scrollTo({ top: 0 });
  }
  navBtns.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.view); }); });
  document.querySelectorAll("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () { show(b.dataset.goto); });
  });
  document.querySelector(".search").addEventListener("click", function () { show("projects"); });

  // ---- Pill groups (single-select) ----
  document.querySelectorAll(".pills").forEach(function (group) {
    group.querySelectorAll(".pill-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".pill-btn").forEach(function (x) { x.classList.remove("active"); });
        btn.classList.add("active");
      });
    });
  });
  document.querySelectorAll("#styleGrid .style-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll("#styleGrid .style-chip").forEach(function (x) { x.classList.remove("active"); });
      chip.classList.add("active");
    });
  });

  // ---- Analyze demo: animated % ring with stages ----
  var stages = ["Reading the stream", "Transcribing speech", "Finding best moments", "Scoring highlights", "Rendering vertical clips", "Burning in captions", "Finishing the clips"];
  var wrap = document.getElementById("progressWrap");
  var ring = document.getElementById("ring");
  var pctEl = document.getElementById("ringPct");
  var stageEl = document.getElementById("progressStage");
  var timer = null;
  function startAnalyze() {
    var link = document.getElementById("linkInput").value.trim();
    if (!link) { document.getElementById("linkInput").focus(); return; }
    wrap.hidden = false;
    var p = 0;
    clearInterval(timer);
    timer = setInterval(function () {
      p = Math.min(100, p + Math.random() * 7 + 2);
      ring.style.setProperty("--p", Math.floor(p));
      pctEl.textContent = Math.floor(p) + "%";
      stageEl.textContent = stages[Math.min(stages.length - 1, Math.floor(p / 100 * stages.length))];
      if (p >= 100) { clearInterval(timer); stageEl.textContent = "Done — clips are in Suggested clips below (demo)"; }
    }, 220);
  }
  document.getElementById("analyzeBtn").addEventListener("click", startAnalyze);

  // ---- Create view mini form: carries the link to the Dashboard form ----
  document.getElementById("createGoBtn").addEventListener("click", function () {
    var v = document.getElementById("createLinkInput").value.trim();
    show("dashboard");
    if (v) {
      document.getElementById("linkInput").value = v;
      setTimeout(startAnalyze, 60);
    } else {
      document.getElementById("linkInput").focus();
    }
  });

  // ---- Preview play/pause (demo animation) ----
  var preview = document.querySelector(".preview");
  var scrubFill = document.querySelector(".scrub-fill");
  var timeEl = document.querySelector(".preview-time");
  var playT = 7, playing = false, playTimer = null;
  function paintPreview() {
    scrubFill.style.width = Math.round(playT / 27 * 100) + "%";
    timeEl.textContent = "0:" + String(Math.floor(playT)).padStart(2, "0") + " / 0:27";
  }
  preview.addEventListener("click", function () {
    playing = !playing;
    if (playing) {
      playTimer = setInterval(function () {
        playT += 0.25;
        if (playT >= 27) playT = 0;
        paintPreview();
      }, 250);
    } else {
      clearInterval(playTimer);
    }
  });
  paintPreview();

  // ---- Clip data: the real renders from the live app ----
  // yt + start: the real source stream and the clip's real start second in it,
  // taken from the engine's job records, so Watch plays the actual moment.
  var clips = [
    { title: "Narrow Escape from a Cop Car", score: 85, dur: 27, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 8275 },
    { title: "10k Deposit Chaos", score: 82, dur: 17, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 6889 },
    { title: "Unexpected Luxury Car Reveal", score: 78, dur: 27, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 2474 },
    { title: "Bridge Crossing Chaos", score: 75, dur: 18, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 7303 },
    { title: "Four Stars to Strip Club Chaos", score: 70, dur: 16, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 4896 },
    { title: "Dylan Goes After Paul Walker's Car", score: 70, dur: 17, project: "GTA 6 DAY 3", yt: "tvT6ZVHOtWs", start: 6419 },
    { title: "Accidental Store Robbery in GTA 6", score: 83, dur: 46, project: "GTA 6 DAY 4", yt: "LEAdEczRNEc", start: 2810 },
    { title: "Escaping a 6 Star Wanted Level in GTA 6", score: 82, dur: 38, project: "GTA 6 DAY 4", yt: "LEAdEczRNEc", start: 2009 },
    { title: "69 Hours into GTA 6 and Only 51% Done", score: 82, dur: 30, project: "GTA 6 DAY 4", yt: "LEAdEczRNEc", start: 3688 },
    { title: "Escaping the Cops in GTA 6", score: 78, dur: 34, project: "GTA 6 DAY 4", yt: "LEAdEczRNEc", start: 3213 },
    { title: "Taking hot sauce shots every time they die in GTA 6", score: 78, dur: 29, project: "GTA 6 DAY 4", yt: "LEAdEczRNEc", start: 4444 }
  ];

  function fmt(s) { return "0:" + String(Math.round(s)).padStart(2, "0"); }
  function kitText(clip) {
    return "ClipKoro clip kit (demo)\nTitle: " + clip.title + "\nScore: " + clip.score +
      "\nDuration: " + Math.round(clip.dur) + "s\nFormat: 1080x1920, H.264, AAC, 30 fps\n" +
      "Note: the live ClipKoro app downloads the real rendered MP4 for this clip.";
  }
  function slug(s) { return s.replace(/[^a-z0-9]+/gi, "-").toLowerCase(); }
  function downloadBlob(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  function kit(clip) { downloadBlob(new Blob([kitText(clip)], { type: "text/plain" }), slug(clip.title) + "-clip-kit.txt"); }

  function clipCard(clip) {
    var card = document.createElement("div");
    card.className = "clip-card";
    card.innerHTML =
      '<div class="clip-head"><div class="clip-title"></div><span class="score"></span></div>' +
      '<div class="clip-meta"></div>' +
      '<div class="length-row"><span class="tag">Clip length</span>' +
      '<button class="btn" data-d="-10">−10s</button><button class="btn" data-d="-5">−5s</button>' +
      '<button class="btn" data-d="5">+5s</button><button class="btn" data-d="10">+10s</button>' +
      '<input class="length-input" type="number" min="5" max="120" value="' + Math.round(clip.dur) + '">' +
      '<button class="btn rerender">Re-render</button></div>' +
      '<div class="clip-actions"><button class="btn small watch">Watch</button><button class="btn small download">Download</button>' +
      '<button class="btn small approve">Approve</button><button class="btn small danger reject">Reject</button></div>' +
      '<div class="watch-slot"></div>';
    card.querySelector(".clip-title").textContent = clip.title;
    card.querySelector(".score").textContent = clip.score;
    var meta = card.querySelector(".clip-meta");
    function paint() { meta.textContent = clip.project + " · " + fmt(clip.dur) + " · 9:16 · captions on"; }
    paint();
    var input = card.querySelector(".length-input");
    card.querySelectorAll("[data-d]").forEach(function (b) {
      b.addEventListener("click", function () {
        clip.dur = Math.max(5, Math.min(120, clip.dur + Number(b.dataset.d)));
        input.value = Math.round(clip.dur); paint();
      });
    });
    card.querySelector(".rerender").addEventListener("click", function () {
      clip.dur = Math.max(5, Math.min(120, Number(input.value) || clip.dur));
      var btn = this;
      btn.textContent = "Re-rendering…";
      setTimeout(function () { btn.textContent = "Re-render"; paint(); showToast("Length updated (demo) — in the full app this really re-renders"); }, 900);
    });
    card.querySelector(".download").addEventListener("click", function () { kit(clip); });
    card.querySelector(".watch").addEventListener("click", function () {
      var slot = card.querySelector(".watch-slot");
      if (slot.firstChild) { slot.innerHTML = ""; this.textContent = "Watch"; return; }
      var end = Math.round(clip.start + clip.dur);
      slot.innerHTML = '<div class="watch-wrap"><iframe src="https://www.youtube.com/embed/' + clip.yt +
        '?start=' + Math.round(clip.start) + '&end=' + end + '&rel=0&autoplay=1" title="Clip moment" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
        '<div class="note" style="margin-top:6px">Plays the real source stream at this clip\'s moment. The rendered vertical MP4 with captions plays in the full app.</div>';
      this.textContent = "Close";
    });
    card.querySelector(".approve").addEventListener("click", function () {
      this.textContent = "Approved"; this.disabled = true;
      showToast("Approved (demo)");
    });
    card.querySelector(".reject").addEventListener("click", function () {
      var i = clips.indexOf(clip);
      if (i > -1) clips.splice(i, 1);
      card.remove();
      showToast("Rejected — clip removed (demo). In the full app this deletes the MP4 too.");
    });
    return card;
  }

  var sg = document.getElementById("suggestedGrid");
  clips.slice().forEach(function (c) { sg.appendChild(clipCard(c)); });

  // ---- Projects ----
  var projects = [
    { name: "Completing ALL of GTA 6 (All Side Missions) | DAY 5", count: 0, longest: 0, error: true, fav: false },
    { name: "Completing ALL of GTA 6 (All Side Missions) | DAY 4 - Part 2", count: 5, longest: 46, fav: false },
    { name: "FIRST TO BEAT GTA 6 (By Cheating) | DAY 3", count: 6, longest: 27, fav: false },
    { name: "FIRST TO BEAT GTA 6 (By Cheating) | DAY 3 — first job", count: 2, longest: 48, fav: false }
  ];
  var pg = document.getElementById("projectGrid");
  function resumeDemo(btn, noteEl) {
    btn.disabled = true;
    btn.textContent = "Resuming…";
    setTimeout(function () {
      btn.textContent = "Resume";
      btn.disabled = false;
      if (noteEl) noteEl.hidden = false;
      showToast("Still blocked — YouTube is not letting the engine download this video (demo)");
    }, 1200);
  }
  function paintProjects(list) {
    pg.innerHTML = "";
    list.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "clip-card";
      if (p.error) {
        card.innerHTML = '<div class="clip-head"><div class="clip-title"></div><span class="badge error">Error</span></div>' +
          '<div class="clip-meta">Stopped at 5% · 0 clips · the source video could not be downloaded again</div>' +
          '<div class="clip-actions"><button class="btn small resume-btn">Resume</button>' +
          '<button class="btn small danger del">Delete</button></div>' +
          '<div class="resume-note muted" hidden>Demo: in the full app Resume re-runs the job from its saved transcript. This one is currently blocked because YouTube is not letting the engine download the video — the durable fix is adding YouTube cookies.</div>';
      } else {
        card.innerHTML = '<div class="clip-head"><div class="clip-title"></div><span class="score"></span></div>' +
          '<div class="clip-meta"></div><div class="clip-actions">' +
          '<button class="btn small fav">Favorite</button><button class="btn small rename">Rename</button>' +
          '<button class="btn small dup">Duplicate</button><button class="btn small danger del">Delete</button></div>';
        card.querySelector(".score").textContent = p.count + " clips";
        card.querySelector(".clip-meta").textContent = "Longest clip " + fmt(p.longest) + " · rendered by PeakCut";
        var favBtn = card.querySelector(".fav");
        function paintFav() { favBtn.textContent = p.fav ? "Favorited" : "Favorite"; }
        paintFav();
        favBtn.addEventListener("click", function () { p.fav = !p.fav; paintFav(); });
        card.querySelector(".rename").addEventListener("click", function () {
          var n = window.prompt("Rename project", p.name);
          if (n && n.trim()) { p.name = n.trim(); card.querySelector(".clip-title").textContent = p.name; showToast("Renamed (demo)"); }
        });
        card.querySelector(".dup").addEventListener("click", function () {
          projects.unshift({ name: p.name + " (copy)", count: p.count, longest: p.longest, fav: false });
          paintProjects(currentList());
          showToast("Duplicated (demo) — in the full app this re-runs the same link");
        });
      }
      card.querySelector(".clip-title").textContent = p.name;
      var rb = card.querySelector(".resume-btn");
      if (rb) rb.addEventListener("click", function () { resumeDemo(rb, card.querySelector(".resume-note")); });
      card.querySelector(".del").addEventListener("click", function () {
        var i = projects.indexOf(p);
        if (i > -1) projects.splice(i, 1);
        card.remove();
        showToast("Project deleted (demo)");
      });
      pg.appendChild(card);
    });
  }
  var sortMode = "newest";
  function currentList() {
    var q = document.getElementById("projectSearch").value.toLowerCase();
    var list = projects.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; });
    if (sortMode === "longest") list = list.slice().sort(function (a, b) { return b.longest - a.longest; });
    if (sortMode === "most") list = list.slice().sort(function (a, b) { return b.count - a.count; });
    return list;
  }
  paintProjects(currentList());
  document.getElementById("projectSearch").addEventListener("input", function () { paintProjects(currentList()); });
  document.querySelectorAll("#sortPills .pill-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      sortMode = b.textContent.indexOf("Longest") > -1 ? "longest" : (b.textContent.indexOf("Most") > -1 ? "most" : "newest");
      paintProjects(currentList());
    });
  });

  // Dashboard Recent activity Resume (DAY 5 row)
  var dashResume = document.querySelector("#view-dashboard .resume-btn");
  if (dashResume) dashResume.addEventListener("click", function () {
    resumeDemo(dashResume, document.getElementById("day5Note"));
  });

  // ---- Export all: a REAL zip (stored, no compression) of the clip kits ----
  var crcTable = null;
  function crc32(bytes) {
    if (!crcTable) {
      crcTable = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        crcTable[n] = c >>> 0;
      }
    }
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function buildZip(files) {
    var enc = new TextEncoder();
    var chunks = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = enc.encode(f.text), crc = crc32(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, name.length, true);
      chunks.push(new Uint8Array(lh.buffer), name, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var centralSize = central.reduce(function (s, c) { return s + c.length; }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);
    return new Blob(chunks.concat(central, [new Uint8Array(end.buffer)]), { type: "application/zip" });
  }
  document.getElementById("exportAllBtn").addEventListener("click", function () {
    var btn = this;
    btn.textContent = "Preparing zip…";
    setTimeout(function () {
      var files = [{ name: "manifest.txt", text: "ClipKoro export (demo)\n" + clips.length + " clip kits included.\nIn the live app this zip holds the real rendered MP4 files instead of text kits." }];
      clips.forEach(function (c) { files.push({ name: slug(c.title) + "-clip-kit.txt", text: kitText(c) }); });
      downloadBlob(buildZip(files), "clipkoro-export-all-demo.zip");
      btn.textContent = "One-click export all (zip)";
      showToast("Zip downloaded (demo) — clip kits inside; the full app zips the real MP4s");
    }, 500);
  });

  // ---- Roadmap: the full 33-item checklist ----
  var roadmap = [
    ["Link paste → automatic best-moment clips", "done"],
    ["Batch import — many links, queued one after another", "done"],
    ["Live % ring with the current processing stage", "done"],
    ["AI highlight detection with hype scores", "done"],
    ["Word-by-word transcription captions", "done"],
    ["8 caption styles with one global brand kit", "done"],
    ["Caption languages: English, Banglish, Bangla, Hindi", "done"],
    ["Vertical 9:16 rendering at 1080 × 1920", "done"],
    ["Per-clip length adjust with a real re-render", "done"],
    ["Approve / Reject on suggested clips", "done"],
    ["MP4 download + one-click export-all zip", "done"],
    ["Projects: search, sort, favorite, rename, duplicate, delete", "done"],
    ["Resume for failed jobs (reuses the saved transcript)", "done"],
    ["Caption Studio — style applies everywhere, no timeline editor yet", "partial"],
    ["Export presets — Shorts / TikTok / Reels labels, output stays 9:16", "partial"],
    ["Platform connections — link paste works, account sign-in not connected", "partial"],
    ["Settings defaults pre-fill the Create form (main options)", "partial"],
    ["Processing history — recent jobs, not a full archive", "partial"],
    ["Live stream clipping — engine supports it, site flow is basic", "partial"],
    ["Chat-spike detection — AI-estimated, no live chat feed yet", "partial"],
    ["Durations 15s–90s — up to 20 clips per job", "partial"],
    ["Device cards — this device vs engine computer, view only", "partial"],
    ["GPU status panel — honest report; the engine machine has no GPU", "partial"],
    ["Privacy controls — clear and delete in the app, no cloud backup", "partial"],
    ["Downloads — chunked and verified, no pause/resume", "partial"],
    ["Mobile layout — works; the fluid hero is desktop-first", "partial"],
    ["GPU rendering (CUDA / NVENC)", "planned"],
    ["In-browser timeline editor with rendering", "planned"],
    ["Phone-side offline processing (installable app)", "planned"],
    ["Platform account sign-in + auto-posting", "planned"],
    ["Real live-chat telemetry for hype scores", "planned"],
    ["50 clips per job", "planned"],
    ["Public share link for the full live app", "planned"]
  ];
  var rl = document.getElementById("roadmapList");
  roadmap.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "roadmap-row";
    var label = item[1] === "done" ? "Done" : (item[1] === "partial" ? "Partial" : "Planned");
    row.innerHTML = "<span></span>";
    row.querySelector("span").textContent = item[0];
    var b = document.createElement("span");
    b.className = "badge " + (item[1] === "planned" ? "" : item[1]);
    b.textContent = label;
    row.appendChild(b);
    rl.appendChild(row);
  });

  // ---- Settings: defaults genuinely pre-fill the Create form (demo) ----
  document.getElementById("settingsSaveBtn").addEventListener("click", function () {
    var style = document.getElementById("setStyle").value;
    var dur = document.getElementById("setDuration").value;
    document.querySelectorAll("#styleGrid .style-chip").forEach(function (chip) {
      chip.classList.toggle("active", chip.textContent === style);
    });
    document.querySelectorAll("#durationPills .pill-btn").forEach(function (b) {
      b.classList.toggle("active", b.textContent === dur);
    });
    document.getElementById("settingsSaved").hidden = false;
    showToast("Defaults saved (demo)");
  });

  // ---- Google sign-in (real GIS flow; needs the site's free Client ID) ----
  // Get one free: Google Cloud Console → APIs & Services → Credentials →
  // Create OAuth client ID (Web application) → add https://mrjmizanurrahman.github.io
  // under "Authorized JavaScript origins" → paste the client ID below.
  // A Client ID is public information (it ships in every visitor's page), not a secret.
  var GOOGLE_CLIENT_ID = "";
  var gBtn = document.getElementById("googleSigninBtn");
  var gNote = document.getElementById("googleSigninNote");
  function jwtPayload(token) {
    var part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(window.atob(part))));
  }
  function onGoogleCredential(resp) {
    try {
      var p = jwtPayload(resp.credential);
      document.getElementById("profileName").textContent = p.name || "Signed in";
      document.getElementById("profileSub").textContent = p.email || "Signed in with Google";
      var av = document.getElementById("profileAvatar");
      if (p.picture) { av.innerHTML = '<img src="' + p.picture + '" alt="" style="width:100%;height:100%;border-radius:50%">'; }
      gBtn.textContent = "Sign out";
      showToast("Signed in with Google (demo) — welcome, " + (p.given_name || "creator"));
    } catch (e) { showToast("Sign-in answer could not be read — try again"); }
  }
  if (gBtn) gBtn.addEventListener("click", function () {
    if (gBtn.textContent === "Sign out") {
      if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
      document.getElementById("profileName").textContent = "Mizanur Rahman";
      document.getElementById("profileSub").textContent = "Creator account";
      document.getElementById("profileAvatar").textContent = "M";
      gBtn.textContent = "Sign in with Google";
      showToast("Signed out (demo)");
      return;
    }
    if (!GOOGLE_CLIENT_ID) { gNote.hidden = false; return; }
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential });
      google.accounts.id.prompt();
    } else {
      showToast("Google sign-in is still loading — try again in a few seconds");
    }
  });

  // ---- Real device detection (same idea as the live app's "This device" card) ----
  var di = document.getElementById("deviceInfo");
  if (di) {
    var cores = navigator.hardwareConcurrency || "?";
    var mobile = /Android|iPhone|iPad/i.test(navigator.userAgent) ? "Phone" : "Computer";
    di.textContent = mobile + " · " + cores + " CPU threads · page and players run here; rendering stays on the engine computer";
  }
})();
