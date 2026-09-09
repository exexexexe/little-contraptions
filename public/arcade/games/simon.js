/* FOUR TONES — colour memory. Each pad has its own note. */
(function () {
  var PADS = [
    { x: 80,  y: 40,  w: 76, h: 76, c: 10, lit: 11, f: 261.63 },
    { x: 164, y: 40,  w: 76, h: 76, c: 6,  lit: 7,  f: 329.63 },
    { x: 80,  y: 124, w: 76, h: 76, c: 12, lit: 13, f: 392.00 },
    { x: 164, y: 124, w: 76, h: 76, c: 14, lit: 15, f: 523.25 }
  ];
  var ac = null;
  function tone(f, ms) {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, ac.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + ms / 1000);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + ms / 1000 + 0.02);
    } catch (e) {}
  }
  var G = {
    id: 'simon', name: 'FOUR TONES', desc: 'Watch the pattern, then give it back',
    score: 0, dead: false,
    reset: function () {
      this.seq = []; this.score = 0; this.dead = false;
      this.phase = 'show'; this.i = 0; this.t = 0; this.lit = -1; this.sel = 0;
      this.grow();
    },
    grow: function () {
      this.seq.push((Math.random() * 4) | 0);
      this.phase = 'show'; this.i = 0; this.t = 0; this.lit = -1;
    },
    step: function (dt, A) {
      this.t += dt;
      if (this.phase === 'show') {
        var slot = 0.62;
        var idx = Math.floor(this.t / slot);
        if (idx >= this.seq.length) { this.phase = 'input'; this.i = 0; this.lit = -1; return; }
        var within = this.t - idx * slot;
        var nowLit = within < 0.38 ? this.seq[idx] : -1;
        if (nowLit !== this.lit && nowLit >= 0) tone(PADS[nowLit].f, 340);
        this.lit = nowLit;
        return;
      }
      // input
      if (A.hit('left')) this.sel = (this.sel % 2 === 1) ? this.sel - 1 : this.sel;
      if (A.hit('right')) this.sel = (this.sel % 2 === 0) ? this.sel + 1 : this.sel;
      if (A.hit('up')) this.sel = this.sel > 1 ? this.sel - 2 : this.sel;
      if (A.hit('down')) this.sel = this.sel < 2 ? this.sel + 2 : this.sel;
      if (this.flash > 0) this.flash -= dt;
      if (A.hit('a')) {
        this.lit = this.sel; this.flash = 0.2;
        tone(PADS[this.sel].f, 240);
        if (this.sel === this.seq[this.i]) {
          this.i++;
          if (this.i >= this.seq.length) {
            this.score = this.seq.length * 10;
            this.phase = 'show'; this.t = -0.5; this.grow(); this.t = -0.5;
          }
        } else { this.dead = true; tone(90, 500); }
      }
      if (this.flash <= 0) this.lit = -1;
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'ROUND ' + this.seq.length, right: 'HI ' + A.hiscore('simon') });
      for (var i = 0; i < 4; i++) {
        var p = PADS[i], on = this.lit === i;
        g.rect(p.x, p.y, p.w, p.h, on ? p.lit : p.c);
        g.frame(p.x, p.y, p.w, p.h, on ? 5 : 1);
        if (on) g.frame(p.x + 1, p.y + 1, p.w - 2, p.h - 2, 5);
        if (this.phase === 'input' && this.sel === i) {
          g.frame(p.x - 3, p.y - 3, p.w + 6, p.h + 6, 9);
          g.frame(p.x - 2, p.y - 2, p.w + 4, p.h + 4, 9);
        }
      }
      g.textC(this.phase === 'show' ? 'WATCH' : 'YOUR  TURN', 214, this.phase === 'show' ? 3 : 9);
    }
  };
  ARCADE.register(G);
})();
