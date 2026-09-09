/* DEEP SEAM — dig, collect, do not stand under anything heavy.
 * Tile-based underground in the old digging tradition: soil you tunnel
 * through, bedrock you cannot, boulders that fall the moment you take
 * the ground out from under them, and grubs that patrol the tunnels. */
(function () {
  var COLS = 20, ROWS = 13, C = 16, OY = 28;
  var SOIL = 1, ROCK = 2, BOULDER = 3, GEM = 4, EMPTY = 0, EXIT = 5;

  var G = {
    id: 'digger', name: 'DEEP SEAM', desc: 'Tunnel for gems. Boulders fall when you undermine them',
    score: 0, dead: false,
    reset: function () { this.score = 0; this.lives = 3; this.level = 1; this.dead = false; this.build(); },
    build: function () {
      var n = COLS * ROWS;
      this.g = new Array(n);
      for (var i = 0; i < n; i++) {
        var x = i % COLS, y = (i / COLS) | 0;
        if (y === 0 || x === 0 || x === COLS - 1 || y === ROWS - 1) this.g[i] = ROCK;
        else {
          var r = Math.random();
          this.g[i] = r < 0.06 ? ROCK : r < 0.16 ? BOULDER : SOIL;
        }
      }
      // gems only ever go in soil with soil above, so nothing is buried
      // under a boulder where it cannot be reached
      this.gems = 0;
      var want = 10 + this.level * 2, tries = 0;
      while (this.gems < want && tries < 900) {
        tries++;
        var gx = 1 + ((Math.random() * (COLS - 2)) | 0), gy = 2 + ((Math.random() * (ROWS - 3)) | 0);
        var k = gy * COLS + gx;
        if (this.g[k] !== SOIL) continue;
        if (this.g[k - COLS] === BOULDER) continue;
        this.g[k] = GEM; this.gems++;
      }
      this.need = this.gems;
      this.px = 1; this.py = 1;
      this.g[this.py * COLS + this.px] = EMPTY;
      this.g[this.py * COLS + this.px + 1] = EMPTY;
      this.face = 'right'; this.t = 0; this.moveT = 0; this.exitOpen = false;
      this.ex = COLS - 2; this.ey = ROWS - 2;
      // grubs
      this.grubs = [];
      for (var q = 0; q < 2 + this.level; q++) {
        var sx, sy, guard = 0;
        do { sx = 2 + ((Math.random() * (COLS - 4)) | 0); sy = 3 + ((Math.random() * (ROWS - 5)) | 0); guard++; }
        while (guard < 60 && Math.abs(sx - this.px) + Math.abs(sy - this.py) < 8);
        this.grubs.push({ x: sx, y: sy, t: Math.random(), dir: 'left' });
      }
    },
    at: function (x, y) { return this.g[y * COLS + x]; },
    set: function (x, y, v) { this.g[y * COLS + x] = v; },
    step: function (dt, A) {
      this.t += dt; this.moveT -= dt;
      // --- player, on a step timer so it reads as a grid game
      if (this.moveT <= 0) {
        var dx = 0, dy = 0;
        if (A.key('left')) { dx = -1; this.face = 'left'; }
        else if (A.key('right')) { dx = 1; this.face = 'right'; }
        else if (A.key('up')) dy = -1;
        else if (A.key('down')) dy = 1;
        if (dx || dy) {
          var nx = this.px + dx, ny = this.py + dy, tile = this.at(nx, ny);
          if (tile === SOIL || tile === EMPTY || tile === GEM || (tile === EXIT && this.exitOpen)) {
            if (tile === GEM) { this.score += 25; this.gems--; }
            if (tile === EXIT && this.exitOpen) {
              this.level++; this.score += 200; this.build(); return;
            }
            this.set(nx, ny, EMPTY);
            this.px = nx; this.py = ny;
            this.moveT = 0.10;
          } else if (tile === BOULDER && dy === 0) {
            // shove it, if there is room beyond
            var bx = nx + dx;
            if (this.at(bx, ny) === EMPTY) {
              this.set(bx, ny, BOULDER); this.set(nx, ny, EMPTY);
              this.px = nx; this.py = ny; this.moveT = 0.16;
            }
          }
        }
      }
      if (this.gems <= 0 && !this.exitOpen) {
        this.exitOpen = true;
        this.set(this.ex, this.ey, EXIT);
      }

      // --- boulders fall, bottom row upward so a stack moves as one
      this.fallT = (this.fallT || 0) + dt;
      if (this.fallT >= 0.11) {
        this.fallT = 0;
        for (var y = ROWS - 2; y >= 1; y--) {
          for (var x = 1; x < COLS - 1; x++) {
            if (this.at(x, y) !== BOULDER) continue;
            if (this.at(x, y + 1) === EMPTY) {
              this.set(x, y, EMPTY); this.set(x, y + 1, BOULDER);
              if (this.px === x && this.py === y + 2 && this.at(x, y + 2) === EMPTY) {
                // it is now directly above the player and still falling
              }
            }
          }
        }
        // crushed?
        if (this.at(this.px, this.py) === BOULDER) this.hurt();
        if (this.py > 1 && this.at(this.px, this.py - 1) === BOULDER &&
            this.at(this.px, this.py) === EMPTY) { /* resting above, harmless */ }
      }

      // --- grubs walk the tunnels
      var self = this;
      this.grubs.forEach(function (gr) {
        gr.t -= dt;
        if (gr.t > 0) return;
        gr.t = 0.22;
        var opts = [];
        [['left', -1, 0], ['right', 1, 0], ['up', 0, -1], ['down', 0, 1]].forEach(function (d) {
          var t = self.at(gr.x + d[1], gr.y + d[2]);
          if (t === EMPTY) opts.push(d);
        });
        if (!opts.length) return;
        // drift toward the player, but not relentlessly
        var best = opts[(Math.random() * opts.length) | 0];
        if (Math.random() < 0.62) {
          var bd = 1e9;
          opts.forEach(function (d) {
            var dist = Math.abs(gr.x + d[1] - self.px) + Math.abs(gr.y + d[2] - self.py);
            if (dist < bd) { bd = dist; best = d; }
          });
        }
        gr.dir = best[0]; gr.x += best[1]; gr.y += best[2];
        if (gr.x === self.px && gr.y === self.py) self.hurt();
      });
    },
    hurt: function () {
      this.lives--;
      if (this.lives <= 0) { this.dead = true; return; }
      this.build();
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'GEMS ' + this.gems, lives: this.lives });
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var v = this.at(x, y), px = x * C, py = OY + y * C;
        if (v === SOIL) {
          g.rect(px, py, C, C, 6);
          g.rect(px, py, C, 1, 8);
          for (var k = 0; k < 3; k++) g.px(px + 3 + ((x * 7 + k * 5 + y * 3) % 11), py + 4 + ((k * 5 + x) % 9), 0);
        } else if (v === ROCK) {
          g.rect(px, py, C, C, 2);
          g.rect(px + 1, py + 1, C - 2, C - 2, 3);
          g.rect(px + 1, py + 1, C - 2, 1, 4);
        } else if (v === BOULDER) {
          g.circle(px + 8, py + 8, 7, 3);
          g.circle(px + 6, py + 6, 3, 4);
          g.px(px + 11, py + 11, 2);
        } else if (v === GEM) {
          g.sprite(['..bb..', '.bddb.', 'bd55db', 'bddddb', '.bddb.', '..bb..'], px + 5, py + 5);
        } else if (v === EXIT) {
          var f = ((this.t * 5) | 0) % 2;
          g.rect(px + 2, py + 2, C - 4, C - 4, f ? 9 : 11);
          g.frame(px + 2, py + 2, C - 4, C - 4, 5);
        }
      }
      // grubs
      var self = this;
      this.grubs.forEach(function (gr) {
        var gx = gr.x * C, gy = OY + gr.y * C;
        g.sprite(['.7777.', '755557', '7f77f7', '777777', '.7..7.'], gx + 5, gy + 5);
      });
      // the digger
      var wob = ((this.t * 8) | 0) % 2;
      g.sprite([
        '..9999..',
        '.955559.',
        '95055059',
        '99999999',
        '.999999.',
        wob ? '9.9..9.9' : '.99..99.'
      ], this.px * C + 4, OY + this.py * C + 5, this.face === 'left');
      if (this.exitOpen) g.textC('EXIT  OPEN', 232, 11);
    }
  };
  ARCADE.register(G);
})();
