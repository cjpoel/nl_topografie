export class TopoEngine {
  constructor(dataset) {
    this.dataset = dataset;

    // Config defaults (kun je per dataset overriden)
    this.SHOW_ALL_DOTS = true;

    // “Voelt” overal hetzelfde in scherm-pixels
    this.DOT_SCREEN_PX = 14;
    this.RING_SCREEN_PX = 34;
    this.HIT_SCREEN_PX  = 40;

    // Auto door na antwoord
    this.DELAY_GOOD_MS = dataset.delayGoodMs ?? 900;
    this.DELAY_BAD_MS  = dataset.delayBadMs  ?? 1600;

    // Storage keys
    this.LS_KEY_PROVINCES = `topo_selected_provinces_${dataset.id}_v1`;
    this.LS_KEY_HS = "topo_highscores_v1";

    // State
    this.mode = 1;
    this.started = false;
    this.current = null;

    this.scoreGood = 0;
    this.scoreBad = 0;
    this.scoreTotal = 0;
    this.streak = 0;

    this.deck = [];
    this.wrongPile = [];

    this.timerStartMs = null;
    this.timerStopMs = null;
    this.timerInterval = null;
  }

  mount() {
    // UI
    this.canvas = document.getElementById("map");
    this.ctx = this.canvas.getContext("2d");

    this.promptEl = document.getElementById("prompt");
    this.feedbackEl = document.getElementById("feedback");

    this.goodEl = document.getElementById("good");
    this.badEl = document.getElementById("bad");
    this.totalEl = document.getElementById("total");
    this.streakEl = document.getElementById("streak");
    this.timeEl = document.getElementById("time");

    this.mode1Btn = document.getElementById("mode1");
    this.mode2Btn = document.getElementById("mode2");

    this.typingArea = document.getElementById("typingArea");
    this.answerInput = document.getElementById("answer");
    this.checkBtn = document.getElementById("check");
    this.skipBtn = document.getElementById("skip");

    this.nextBtn = document.getElementById("next");
    this.repeatWrongBtn = document.getElementById("repeatWrong");
    this.resetBtn = document.getElementById("reset");

    this.highscoresBtn = document.getElementById("highscores");

    this.provinceListEl = document.getElementById("provinceList");
    this.selectAllBtn = document.getElementById("selectAll");
    this.startTestBtn = document.getElementById("startTest");
    this.activeCountEl = document.getElementById("activeCount");

    // Modal
    this.modalBackdrop = document.getElementById("modalBackdrop");
    this.closeModalBtn = document.getElementById("closeModal");
    this.hsSubtitle = document.getElementById("hsSubtitle");
    this.hsContent = document.getElementById("hsContent");

    // Dataset basics
    this.PLACES = this.dataset.places;
    this.PROVINCES = [...new Set(this.PLACES.map(p => p.province))].sort();

    // Canvas size
    this.canvas.width = this.dataset.canvasWidth;
    this.canvas.height = this.dataset.canvasHeight;

    // Selected provinces
    this.selectedProvinces = this.loadSelectedProvinces();
    this.activePlaces = [];

    // Image
    this.img = new Image();
    const v = encodeURIComponent(this.dataset.assetVersion || "1");
    this.img.src = `${this.dataset.mapImage}?v=${v}`;
    this.img.onload = () => {
      this.buildProvinceUI();
      this.recomputeActivePlaces();
      this.draw();
      this.setStarted(false);
      this.setFeedback("", null);
      this.promptEl.textContent = "Selecteer provincies en druk op Start toets.";
    };

    // Events
    this.mode1Btn.addEventListener("click", () => this.setMode(1));
    this.mode2Btn.addEventListener("click", () => this.setMode(2));

    this.nextBtn.addEventListener("click", () => this.newRound());
    this.repeatWrongBtn.addEventListener("click", () => this.repeatWrong());
    this.resetBtn.addEventListener("click", () => this.resetAll());

    this.startTestBtn.addEventListener("click", () => this.startTest());
    this.selectAllBtn.addEventListener("click", () => this.selectAll());

    this.canvas.addEventListener("pointerup", (e) => this.onPointerUp(e), { passive:false });

    this.checkBtn.addEventListener("click", () => this.checkTyped());
    this.skipBtn.addEventListener("click", () => this.skipTyped());
    this.answerInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.checkTyped(); });

    this.highscoresBtn.addEventListener("click", () => this.openHighscores());
    this.closeModalBtn.addEventListener("click", () => this.closeHighscores());
    this.modalBackdrop.addEventListener("click", (e) => {
      if (e.target === this.modalBackdrop) this.closeHighscores();
    });

    window.addEventListener("resize", () => { if (this.img.complete) this.draw(); });

    return this;
  }

  // ---------- TIMER ----------
  startTimer() {
    this.timerStartMs = performance.now();
    this.timerStopMs = null;
    this.updateTimeUI();

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimeUI(), 200);
  }

  stopTimer() {
    if (!this.timerStartMs) return;
    this.timerStopMs = performance.now();
    this.updateTimeUI();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  getElapsedMs() {
    if (!this.timerStartMs) return 0;
    const end = this.timerStopMs ?? performance.now();
    return Math.max(0, end - this.timerStartMs);
  }

  formatTime(ms) {
    const totalSec = Math.round(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2,"0")}`;
  }

  updateTimeUI() {
    if (!this.timeEl) return;
    this.timeEl.textContent = this.formatTime(this.getElapsedMs());
  }

  // ---------- HIGH SCORES ----------
  loadHighscores() {
    try {
      const raw = localStorage.getItem(this.LS_KEY_HS);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  saveHighscores(arr) {
    localStorage.setItem(this.LS_KEY_HS, JSON.stringify(arr));
  }

  addHighscoreEntry() {
    const timeSec = Math.round(this.getElapsedMs() / 1000);
    const entry = {
      dataset: this.dataset.id,
      mode: this.mode === 1 ? "klik" : "typ",
      timeSec,
      wrong: this.scoreBad,
      total: this.scoreTotal,
      dateIso: new Date().toISOString()
    };

    const all = this.loadHighscores();
    all.push(entry);

    // sort: eerst laagste tijd, dan minst fout
    all.sort((a,b) => (a.timeSec - b.timeSec) || (a.wrong - b.wrong));

    // max 200 bewaren
    this.saveHighscores(all.slice(0, 200));
    return entry;
  }

  getTop10ForCurrent() {
    const all = this.loadHighscores();
    const mode = this.mode === 1 ? "klik" : "typ";
    return all.filter(x => x.dataset === this.dataset.id && x.mode === mode).slice(0, 10);
  }

  openHighscores() {
    const mode = this.mode === 1 ? "klik" : "typ";
    const list = this.getTop10ForCurrent();

    this.hsSubtitle.textContent = `Dataset: ${this.dataset.id} • modus: ${mode}`;
    if (list.length === 0) {
      this.hsContent.innerHTML = `<p>Nog geen highscores. Speel een ronde tot het einde 😊</p>`;
    } else {
      const rows = list.map((x, i) => {
        const d = new Date(x.dateIso);
        const date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
        return `<div style="display:flex; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px solid #eef1fb;">
          <div>#${i+1}</div>
          <div style="flex:1;">${x.timeSec}s (${Math.floor(x.timeSec/60)}:${String(x.timeSec%60).padStart(2,"0")})</div>
          <div>fout: ${x.wrong}</div>
          <div style="color:#666;">${date}</div>
        </div>`;
      }).join("");
      this.hsContent.innerHTML = rows;
    }

    this.modalBackdrop.style.display = "flex";
  }

  closeHighscores() {
    this.modalBackdrop.style.display = "none";
  }

  // ---------- PROVINCES ----------
  loadSelectedProvinces() {
    try {
      const raw = localStorage.getItem(this.LS_KEY_PROVINCES);
      if (!raw) return new Set(this.PROVINCES);
      const arr = JSON.parse(raw);
      return new Set(arr.filter(x => this.PROVINCES.includes(x)));
    } catch {
      return new Set(this.PROVINCES);
    }
  }

  saveSelectedProvinces() {
    localStorage.setItem(this.LS_KEY_PROVINCES, JSON.stringify([...this.selectedProvinces]));
  }

  buildProvinceUI() {
    this.provinceListEl.innerHTML = "";
    for (const prov of this.PROVINCES) {
      const row = document.createElement("label");
      row.className = "chk";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = this.selectedProvinces.has(prov);
      cb.addEventListener("change", () => {
        if (cb.checked) this.selectedProvinces.add(prov);
        else this.selectedProvinces.delete(prov);
        this.saveSelectedProvinces();
        this.recomputeActivePlaces(false);
        this.setStarted(false);
      });
      const span = document.createElement("span");
      span.textContent = prov;
      row.appendChild(cb);
      row.appendChild(span);
      this.provinceListEl.appendChild(row);
    }
  }

  selectAll() {
    this.selectedProvinces = new Set(this.PROVINCES);
    this.saveSelectedProvinces();
    this.buildProvinceUI();
    this.recomputeActivePlaces(false);
    this.setStarted(false);
  }

  recomputeActivePlaces(clearDeck = true) {
    this.activePlaces = this.PLACES.filter(p => this.selectedProvinces.has(p.province));
    this.activeCountEl.textContent = `${this.activePlaces.length} plaatsen`;
    this.startTestBtn.disabled = this.activePlaces.length === 0;
    if (clearDeck) this.deck = [];
    this.draw();
  }

  // ---------- GAME ----------
  setStarted(v) {
    this.started = v;
    this.nextBtn.disabled = !v;
    this.repeatWrongBtn.disabled = !v;
    if (!v) {
      this.stopTimer();
      this.timeEl.textContent = "0:00";
    }
  }

  startTest() {
    if (this.activePlaces.length === 0) return;

    this.scoreGood = 0;
    this.scoreBad = 0;
    this.scoreTotal = 0;
    this.streak = 0;
    this.updateScore();

    this.deck = [];
    this.wrongPile = [];
    this.current = null;

    this.setFeedback("", null);
    this.setStarted(true);
    this.startTimer();

    this.newRound();
  }

  setMode(m) {
    this.mode = m;
    if (m === 1) {
      this.mode1Btn.classList.add("primary");
      this.mode2Btn.classList.remove("primary");
    } else {
      this.mode2Btn.classList.add("primary");
      this.mode1Btn.classList.remove("primary");
    }
    if (this.started && this.current) this.newRound();
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  nextPlace() {
    // shuffle-bag: iedereen 1× per ronde
    if (this.deck.length === 0) this.deck = this.shuffle([...this.activePlaces]);
    return this.deck.pop();
  }

  newRound() {
    if (!this.started) {
      this.promptEl.textContent = "Druk op Start toets om te beginnen.";
      return;
    }
    if (this.activePlaces.length === 0) {
      this.promptEl.textContent = "Selecteer provincies en druk op Start toets.";
      return;
    }

    // Als deck leeg *en* dit was de laatste: ronde klaar
    // (we checken dit vóór het pakken van de volgende)
    if (this.deck.length === 0 && this.scoreTotal > 0) {
      // we starten direct een nieuwe deck in nextPlace(); maar we willen hier juist stoppen.
      // Dus: als alles 1× is geweest, stoppen we zodra scoreTotal == activePlaces.length
      // (bij skip telt total mee)
      if (this.scoreTotal >= this.activePlaces.length) {
        this.finishRound();
        return;
      }
    }

    this.current = this.nextPlace();
    this.setFeedback("", null);

    if (this.mode === 1) {
      this.promptEl.textContent = `Klik op: ${this.current.name}`;
      this.typingArea.style.display = "none";
    } else {
      this.promptEl.textContent = `Welke plaats is dit? (typ de naam)`;
      this.typingArea.style.display = "flex";
      this.answerInput.value = "";
      this.answerInput.focus();
    }
    this.draw();
  }

  finishRound() {
    this.stopTimer();
    const entry = this.addHighscoreEntry();

    const t = this.formatTime(entry.timeSec * 1000);
    this.setFeedback(`🏁 Ronde klaar! Tijd: ${t} • Fout: ${entry.wrong}`, true);
    this.openHighscores();

    // Niet automatisch resetten; user kan doorgaan met “Start toets”
    this.setStarted(false);
  }

  repeatWrong() {
    if (!this.started) return;
    if (this.wrongPile.length === 0) {
      this.setFeedback("Geen foutjes om te oefenen 🙂", true);
      return;
    }
    this.deck = this.shuffle([...this.wrongPile]);
    this.wrongPile = [];
    this.setFeedback("Oefen foutjes!", true);
    this.newRound();
  }

  resetAll() {
    this.scoreGood = 0;
    this.scoreBad = 0;
    this.scoreTotal = 0;
    this.streak = 0;

    this.deck = [];
    this.wrongPile = [];
    this.current = null;

    this.updateScore();
    this.setFeedback("", null);
    this.setStarted(false);
    this.draw();
    this.promptEl.textContent = "Selecteer provincies en druk op Start toets.";
  }

  // ---------- ANSWERS ----------
  onPointerUp(e) {
    if (!this.started) return;
    if (this.mode !== 1 || !this.current) return;
    e.preventDefault();

    const { x, y } = this.fromClientToImageCoords(e.clientX, e.clientY);
    const { place, dist } = this.nearestPlace(x, y);

    if (!place || dist > this.hitRadiusCanvasPx()) {
      this.streak = 0;
      this.setFeedback("Klik iets dichter bij een stip 🙂", false);
      this.updateScore();
      return;
    }

    this.scoreTotal++;

    if (place.name === this.current.name) {
      this.scoreGood++;
      this.streak++;
      this.setFeedback("✅ Goed!", true);
      this.updateScore();
      setTimeout(() => this.newRound(), this.DELAY_GOOD_MS);
    } else {
      this.scoreBad++;
      this.streak = 0;
      this.wrongPile.push(this.current);
      this.setFeedback(`❌ Fout. Dat was ${place.name}. (Goed: ${this.current.name})`, false);
      this.updateScore();
      setTimeout(() => this.newRound(), this.DELAY_BAD_MS);
    }
  }

  checkTyped() {
    if (!this.started) return;
    if (this.mode !== 2 || !this.current) return;

    this.scoreTotal++;
    const ok = this.isCloseAnswer(this.answerInput.value, this.current.name);

    if (ok) {
      this.scoreGood++;
      this.streak++;
      this.setFeedback("✅ Goed!", true);
      this.updateScore();
      setTimeout(() => this.newRound(), this.DELAY_GOOD_MS);
    } else {
      this.scoreBad++;
      this.streak = 0;
      this.wrongPile.push(this.current);
      this.setFeedback(`❌ Fout. Goed was: ${this.current.name}.`, false);
      this.updateScore();
      setTimeout(() => this.newRound(), this.DELAY_BAD_MS);
    }
  }

  skipTyped() {
    if (!this.started) return;
    if (this.mode !== 2 || !this.current) return;
    this.scoreTotal++;
    this.streak = 0;
    this.wrongPile.push(this.current);
    this.setFeedback(`⏭️ Overgeslagen. Dit was: ${this.current.name}.`, false);
    this.updateScore();
    setTimeout(() => this.newRound(), this.DELAY_BAD_MS);
  }

  // ---------- DRAW + GEOMETRY ----------
  screenScale() {
    const rect = this.canvas.getBoundingClientRect();
    return rect.width / this.canvas.width;
  }

  dotRadiusCanvasPx() {
    return Math.max(3, (this.DOT_SCREEN_PX/2) / this.screenScale());
  }
  ringRadiusCanvasPx() {
    return Math.max(10, (this.RING_SCREEN_PX/2) / this.screenScale());
  }
  hitRadiusCanvasPx() {
    return Math.max(10, (this.HIT_SCREEN_PX/2) / this.screenScale());
  }

  fromClientToImageCoords(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (clientY - rect.top) * (this.canvas.height / rect.height);
    return { x, y };
  }

  nearestPlace(x, y) {
    let best = null, bestDist = Infinity;
    for (const p of this.activePlaces) {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    return { place: best, dist: bestDist };
  }

  drawDot(x, y, r, style) {
    this.ctx.beginPath();
    this.ctx.fillStyle = style;
    this.ctx.arc(x, y, r, 0, Math.PI*2);
    this.ctx.fill();
  }

  drawRing(x, y, r, style) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style;
    this.ctx.lineWidth = Math.max(2, 4 / this.screenScale());
    this.ctx.arc(x, y, r, 0, Math.PI*2);
    this.ctx.stroke();
  }

  draw() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.drawImage(this.img, 0,0,this.canvas.width,this.canvas.height);

    const DOT_R = this.dotRadiusCanvasPx();

    if (this.SHOW_ALL_DOTS) {
      for (const p of this.activePlaces) {
        this.drawDot(p.x, p.y, DOT_R, "rgba(0,0,0,0.35)");
      }
    }

    if (this.current && this.mode === 2) {
      const R = this.ringRadiusCanvasPx();
      this.drawRing(this.current.x, this.current.y, R, "rgba(255,0,0,0.90)");
      this.drawDot(this.current.x, this.current.y, DOT_R, "rgba(255,0,0,0.90)");
    }
  }

  // ---------- TEXT HELPERS ----------
  updateScore() {
    this.goodEl.textContent = this.scoreGood;
    this.badEl.textContent = this.scoreBad;
    this.totalEl.textContent = this.scoreTotal;
    this.streakEl.textContent = this.streak;
  }

  setFeedback(text, ok) {
    this.feedbackEl.textContent = text || "";
    this.feedbackEl.className = "feedback " + (ok === true ? "good" : ok === false ? "bad" : "");
  }

  normalize(s) {
    return (s || "").trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  levenshtein(a, b) {
    a = this.normalize(a); b = this.normalize(b);
    const m = a.length, n = b.length;
    const dp = Array.from({length:m+1}, () => Array(n+1).fill(0));
    for (let i=0;i<=m;i++) dp[i][0]=i;
    for (let j=0;j<=n;j++) dp[0][j]=j;
    for (let i=1;i<=m;i++){
      for (let j=1;j<=n;j++){
        const cost = a[i-1]===b[j-1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
      }
    }
    return dp[m][n];
  }

  isCloseAnswer(input, target) {
    const a = this.normalize(input);
    const t = this.normalize(target);
    if (!a) return false;
    if (a === t) return true;
    const d = this.levenshtein(a, t);
    const allowed = t.length <= 6 ? 1 : 2;
    return d <= allowed;
  }
}
