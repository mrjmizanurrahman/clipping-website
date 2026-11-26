// ClipKoro static demo — mirrors the live app after the master rebuild (v22)
// and the unslop design pass (v23). The live app runs inside Muse and renders
// REAL MP4 clips with the PeakCut engine. This GitHub copy is a static demo:
// controls animate and respond, but nothing renders and no data leaves the page.
(function () {
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
  document.getElementById("analyzeBtn").addEventListener("click", function () {
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
  });

  // ---- Clip data: the real renders from the live app ----
  var clips = [
    { title: "Narrow Escape from a Cop Car", score: 85, dur: 27, project: "GTA 6 DAY 3" },
    { title: "10k Deposit Chaos", score: 82, dur: 17, project: "GTA 6 DAY 3" },
    { title: "Unexpected Luxury Car Reveal", score: 78, dur: 27, project: "GTA 6 DAY 3" },
    { title: "Bridge Crossing Chaos", score: 75, dur: 18, project: "GTA 6 DAY 3" },
    { title: "Four Stars to Strip Club Chaos", score: 70, dur: 16, project: "GTA 6 DAY 3" },
    { title: "Dylan Goes After Paul Walker's Car", score: 70, dur: 17, project: "GTA 6 DAY 3" },
    { title: "Accidental Store Robbery in GTA 6", score: 83, dur: 46, project: "GTA 6 DAY 4" },
    { title: "Escaping a 6 Star Wanted Level in GTA 6", score: 82, dur: 38, project: "GTA 6 DAY 4" },
    { title: "69 Hours into GTA 6 and Only 51% Done", score: 82, dur: 30, project: "GTA 6 DAY 4" },
    { title: "Escaping the Cops in GTA 6", score: 78, dur: 34, project: "GTA 6 DAY 4" },
    { title: "Taking hot sauce shots every time they die in GTA 6", score: 78, dur: 29, project: "GTA 6 DAY 4" }
  ];

  function fmt(s) { return "0:" + String(Math.round(s)).padStart(2, "0"); }
  function kit(clip) {
    // Demo download: a small "clip kit" text file. The full app downloads the real MP4.
    var text = "ClipKoro clip kit (demo)\nTitle: " + clip.title + "\nScore: " + clip.score +
      "\nDuration: " + Math.round(clip.dur) + "s\nFormat: 1080x1920, H.264, AAC, 30 fps\n" +
      "Note: the live ClipKoro app downloads the real rendered MP4 for this clip.";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = clip.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-clip-kit.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function clipCard(clip, withReview) {
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
      '<div class="clip-actions"><button class="btn small download">Download</button>' +
      (withReview ? '<button class="btn small approve">Approve</button><button class="btn small danger reject">Reject</button>' : "") +
      "</div>";
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
      this.textContent = "Re-rendering…";
      var btn = this;
      setTimeout(function () { btn.textContent = "Re-render"; paint(); }, 900);
    });
    card.querySelector(".download").addEventListener("click", function () { kit(clip); });
    var rej = card.querySelector(".reject");
    if (rej) rej.addEventListener("click", function () { card.remove(); });
    var app = card.querySelector(".approve");
    if (app) app.addEventListener("click", function () { app.textContent = "Approved"; app.disabled = true; });
    return card;
  }

  var sg = document.getElementById("suggestedGrid");
  clips.forEach(function (c) { sg.appendChild(clipCard(c, true)); });

  var projects = [
    { name: "Completing ALL of GTA 6 (All Side Missions) | DAY 4 - Part 2", count: 5, longest: 46 },
    { name: "FIRST TO BEAT GTA 6 (By Cheating) | DAY 3", count: 6, longest: 27 },
    { name: "FIRST TO BEAT GTA 6 (By Cheating) | DAY 3 — first job", count: 2, longest: 48 }
  ];
  var pg = document.getElementById("projectGrid");
  function paintProjects(list) {
    pg.innerHTML = "";
    list.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "clip-card";
      card.innerHTML = '<div class="clip-head"><div class="clip-title"></div><span class="score"></span></div>' +
        '<div class="clip-meta"></div><div class="clip-actions">' +
        '<button class="btn small fav">Favorite</button><button class="btn small">Rename</button>' +
        '<button class="btn small">Duplicate</button><button class="btn small danger del">Delete</button></div>';
      card.querySelector(".clip-title").textContent = p.name;
      card.querySelector(".score").textContent = p.count + " clips";
      card.querySelector(".clip-meta").textContent = "Longest clip " + fmt(p.longest) + " · rendered by PeakCut";
      card.querySelector(".fav").addEventListener("click", function () { this.textContent = this.textContent === "Favorite" ? "Favorited" : "Favorite"; });
      card.querySelector(".del").addEventListener("click", function () { card.remove(); });
      pg.appendChild(card);
    });
  }
  paintProjects(projects);
  document.getElementById("projectSearch").addEventListener("input", function () {
    var q = this.value.toLowerCase();
    paintProjects(projects.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; }));
  });

  document.getElementById("exportAllBtn").addEventListener("click", function () {
    this.textContent = "Preparing zip… (demo)";
    var btn = this;
    setTimeout(function () { btn.textContent = "One-click export all (zip)"; }, 1200);
  });

  // ---- Real device detection (same idea as the live app's "This device" card) ----
  var di = document.getElementById("deviceInfo");
  if (di) {
    var cores = navigator.hardwareConcurrency || "?";
    var mobile = /Android|iPhone|iPad/i.test(navigator.userAgent) ? "Phone" : "Computer";
    di.textContent = mobile + " · " + cores + " CPU threads · page and players run here; rendering stays on the engine computer";
  }
})();
