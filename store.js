'use strict';

/* ------------------------------------------------------------------ *
 *  Shared, durable storage for the two toys that need to remember
 *  something between visitors: the bottles, and who has been here.
 *
 *  SQLite, through node:sqlite, which is built into Node — so this adds
 *  no dependency. The file lives on the Railway volume mounted at /data
 *  so it survives a redeploy; locally it falls back to ./.data, which is
 *  gitignored.
 *
 *  NOTHING IN HERE IS ALLOWED TO TAKE THE SITE DOWN. If the module is
 *  missing, the volume is not mounted, or the disk is read-only, the
 *  store reports itself unavailable and the two toys show an honest
 *  "no shared storage" panel while the other ninety-two are unaffected.
 *
 *  On privacy: no IP address is ever written to this database. An
 *  address is used once, in memory, to ask a geocoder which city it is
 *  in, and is then dropped. What is stored is the city and country name
 *  and a lat/lon ROUNDED TO ONE DECIMAL PLACE — about eleven kilometres,
 *  which is coarser than the city it came from. Visitors are counted by
 *  a random id their own browser invents, not by anything about them.
 * ------------------------------------------------------------------ */

const fs = require('fs');
const path = require('path');

let DatabaseSync = null;
try {
  ({ DatabaseSync } = require('node:sqlite'));
} catch (e) {
  console.warn('[store] node:sqlite unavailable (%s) - shared storage is off', e && e.code);
}

const DAY = 24 * 60 * 60 * 1000;
const PRESENCE_WINDOW = DAY;          // "here lately" means the last 24 hours
const MAX_TEXT = 280;

let db = null;
let reason = DatabaseSync ? 'not_opened' : 'no_sqlite_module';
let dbPath = null;

/* Pick the first directory we can actually write to. On Railway that is
   the mounted volume; locally it is a gitignored folder beside the server. */
function pickDir() {
  const candidates = [
    process.env.DATA_DIR,
    '/data',
    path.join(__dirname, '.data'),
  ].filter(Boolean);

  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return dir;
    } catch (e) { /* try the next one */ }
  }
  return null;
}

function open() {
  if (!DatabaseSync) return false;
  try {
    const dir = pickDir();
    if (!dir) { reason = 'no_writable_dir'; return false; }
    dbPath = path.join(dir, 'contraptions.db');
    db = new DatabaseSync(dbPath);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA busy_timeout = 4000');
    db.exec(`
      CREATE TABLE IF NOT EXISTS bottles (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        text        TEXT    NOT NULL,
        written_at  INTEGER NOT NULL,
        surface_at  INTEGER NOT NULL,
        found_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS bottles_surface ON bottles(surface_at);

      CREATE TABLE IF NOT EXISTS visitors (
        token    TEXT PRIMARY KEY,
        city     TEXT NOT NULL DEFAULT '',
        country  TEXT NOT NULL DEFAULT '',
        cc       TEXT NOT NULL DEFAULT '',
        lat      REAL,
        lon      REAL,
        first_at INTEGER NOT NULL,
        seen_at  INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS visitors_seen ON visitors(seen_at);

      /* --- shared high scores, one row per (game, token) ---------------
         A visitor keeps one entry per game: beating your own score edits
         the row you already have rather than filling the board with your
         afternoon. The token is the same browser-invented id the presence
         table uses and is never shown; the handle is what the board shows,
         and is whatever three letters were typed into an arcade cabinet. */
      CREATE TABLE IF NOT EXISTS scores (
        board   TEXT    NOT NULL,
        token   TEXT    NOT NULL,
        handle  TEXT    NOT NULL DEFAULT '',
        score   INTEGER NOT NULL,
        detail  TEXT    NOT NULL DEFAULT '',
        at      INTEGER NOT NULL,
        PRIMARY KEY (board, token)
      );
      CREATE INDEX IF NOT EXISTS scores_board ON scores(board, score DESC);

      CREATE TABLE IF NOT EXISTS guestbook (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        token  TEXT    NOT NULL,
        handle TEXT    NOT NULL DEFAULT '',
        text   TEXT    NOT NULL,
        at     INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS guestbook_at ON guestbook(at DESC);

      /* One row per occupied cell. A cell is overwritable — the canvas is
         meant to keep changing — so the primary key is the coordinate and
         the last person to place there owns it. */
      CREATE TABLE IF NOT EXISTS pixels (
        x     INTEGER NOT NULL,
        y     INTEGER NOT NULL,
        c     INTEGER NOT NULL,
        token TEXT    NOT NULL,
        at    INTEGER NOT NULL,
        PRIMARY KEY (x, y)
      );

      /* The hall of fame.
         One row per browser, not per signing: the wall is a record of who
         got to the end, and letting somebody write on it repeatedly would
         make it a guestbook with a harder door. The token is the primary
         key, so a second signing replaces the first rather than adding to
         it — people change their minds about what to put, and nobody
         should have to live with the first thing they typed forever. */
      CREATE TABLE IF NOT EXISTS hall (
        token TEXT    PRIMARY KEY,
        handle TEXT   NOT NULL DEFAULT '',
        text  TEXT    NOT NULL DEFAULT '',
        found INTEGER NOT NULL,
        at    INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS hall_at ON hall(at ASC);

      CREATE TABLE IF NOT EXISTS story (
        n     INTEGER PRIMARY KEY AUTOINCREMENT,
        text  TEXT    NOT NULL,
        token TEXT    NOT NULL,
        at    INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS story_at ON story(at DESC);
    `);
    reason = null;
    console.log('[store] open at %s', dbPath);
    return true;
  } catch (e) {
    console.error('[store] could not open:', e && e.message);
    db = null; reason = 'open_failed';
    return false;
  }
}

open();

const ready = () => !!db;
const status = () => ({ ok: ready(), reason: reason, path: ready() ? dbPath : null });

/* ------------------------------------------------------------------ *
 *  Bottles
 * ------------------------------------------------------------------ */

/* What a note may contain. Anonymous text shown to strangers is a real
   surface, so: capped, single paragraph, no links (which is what spam
   wants), and stripped of control characters. It is not, and does not
   claim to be, moderation. */
const LINKY = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|cn|xyz|top|shop|link|info|biz)\b)/i;
const CONTROL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

function cleanText(raw) {
  if (typeof raw !== 'string') return { ok: false, why: 'no_text' };
  let t = raw.replace(CONTROL, '')
             .replace(/\r\n?/g, '\n')
             .replace(/\n{3,}/g, '\n\n')
             .trim();
  if (!t) return { ok: false, why: 'empty' };
  if (t.length > MAX_TEXT) return { ok: false, why: 'too_long' };
  if (LINKY.test(t)) return { ok: false, why: 'no_links' };
  return { ok: true, text: t };
}

function castBottle(rawText, days) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const c = cleanText(rawText);
  if (!c.ok) return { ok: false, why: c.why };

  // `|| 30` would turn a requested 0 into a month; be explicit instead.
  const asked = Number(days);
  const d = Math.max(1, Math.min(365, Math.round(Number.isFinite(asked) ? asked : 30)));
  const now = Date.now();
  const info = db.prepare(
    'INSERT INTO bottles (text, written_at, surface_at) VALUES (?, ?, ?)'
  ).run(c.text, now, now + d * DAY);

  return { ok: true, id: Number(info.lastInsertRowid), surface_at: now + d * DAY, days: d };
}

function findBottle() {
  if (!ready()) return { ok: false, why: 'no_store' };
  const now = Date.now();
  const row = db.prepare(
    'SELECT id, text, written_at, surface_at, found_count FROM bottles ' +
    'WHERE surface_at <= ? ORDER BY RANDOM() LIMIT 1'
  ).get(now);
  return { ok: true, bottle: row || null, stats: bottleStats() };
}

function markFound(id) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const n = Number(id);
  if (!Number.isFinite(n)) return { ok: false, why: 'bad_id' };
  db.prepare('UPDATE bottles SET found_count = found_count + 1 WHERE id = ?').run(n);
  return { ok: true };
}

function bottleStats() {
  const now = Date.now();
  const total = db.prepare('SELECT COUNT(*) AS n FROM bottles').get().n;
  const due = db.prepare('SELECT COUNT(*) AS n FROM bottles WHERE surface_at <= ?').get(now).n;
  const next = db.prepare(
    'SELECT MIN(surface_at) AS t FROM bottles WHERE surface_at > ?'
  ).get(now).t;
  return { total: total, surfaced: due, afloat: total - due, nextAt: next || null };
}

/* ------------------------------------------------------------------ *
 *  Presence
 *
 *  `token` is a random string the visitor's own browser generated and
 *  keeps in its localStorage. It is not derived from the address, the
 *  user agent, or anything else about them; it exists only so that
 *  reloading the page does not count as a new person.
 * ------------------------------------------------------------------ */

function coarse(n) {
  return (typeof n === 'number' && isFinite(n)) ? Math.round(n * 10) / 10 : null;
}

function seen(token, place) {
  if (!ready()) return { ok: false, why: 'no_store' };
  if (typeof token !== 'string' || !/^[a-z0-9]{8,64}$/i.test(token)) {
    return { ok: false, why: 'bad_token' };
  }
  const now = Date.now();
  const p = place || {};
  db.prepare(`
    INSERT INTO visitors (token, city, country, cc, lat, lon, first_at, seen_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(token) DO UPDATE SET
      seen_at = excluded.seen_at,
      city    = CASE WHEN excluded.city    <> '' THEN excluded.city    ELSE visitors.city    END,
      country = CASE WHEN excluded.country <> '' THEN excluded.country ELSE visitors.country END,
      cc      = CASE WHEN excluded.cc      <> '' THEN excluded.cc      ELSE visitors.cc      END,
      lat     = COALESCE(excluded.lat, visitors.lat),
      lon     = COALESCE(excluded.lon, visitors.lon)
  `).run(
    token,
    String(p.city || '').slice(0, 80),
    String(p.country || '').slice(0, 80),
    String(p.cc || '').slice(0, 4),
    coarse(p.lat), coarse(p.lon),
    now, now
  );

  // nothing is kept beyond the window this toy displays
  db.prepare('DELETE FROM visitors WHERE seen_at < ?').run(now - PRESENCE_WINDOW);
  return { ok: true };
}

function roster() {
  if (!ready()) return { ok: false, why: 'no_store' };
  const now = Date.now();
  const rows = db.prepare(`
    SELECT city, country, cc, lat, lon, COUNT(*) AS n, MAX(seen_at) AS last_at
    FROM visitors WHERE seen_at >= ?
    GROUP BY city, country ORDER BY last_at DESC
  `).all(now - PRESENCE_WINDOW);

  const total = db.prepare('SELECT COUNT(*) AS n FROM visitors WHERE seen_at >= ?')
                  .get(now - PRESENCE_WINDOW).n;
  const nowish = db.prepare('SELECT COUNT(*) AS n FROM visitors WHERE seen_at >= ?')
                   .get(now - 5 * 60 * 1000).n;
  const ever = db.prepare('SELECT COUNT(*) AS n FROM visitors').get().n;

  return { ok: true, places: rows, today: total, now: nowish, tracked: ever };
}

/* ------------------------------------------------------------------ *
 *  Shared boards, the guestbook, the canvas and the story.
 *
 *  Everything below shares three rules with the bottles above:
 *    - the only identity is a random token the browser invented, and it
 *      never leaves the server;
 *    - anything a stranger will read goes through cleanText(), which is
 *      a length cap and a link filter, not moderation, and says so;
 *    - the writer's own row is recognised by token so a board can say
 *      "that one is yours" without knowing who anyone is.
 * ------------------------------------------------------------------ */

const TOKEN_RE = /^[a-z0-9]{8,64}$/i;
const okToken = (t) => typeof t === 'string' && TOKEN_RE.test(t);

/* Boards are named here, not by the caller. A free-text board name would
   let anyone mint an unbounded number of tables' worth of rows. */
const BOARDS = {
  // one per arcade cabinet game; the ids match the game modules' own
  'arcade:mazechase': { dir: 'high', label: 'The Rounds' },
  'arcade:pentomino': { dir: 'high', label: 'Pentafall' },
  'arcade:platform':  { dir: 'high', label: 'The Long Way Down' },
  'arcade:digger':    { dir: 'high', label: 'Deep Seam' },
  'arcade:mines':     { dir: 'high', label: 'Clearance' },
  'arcade:stacker':   { dir: 'high', label: 'Hoister' },
  'arcade:billiards': { dir: 'high', label: 'Side Pocket' },
  'arcade:invaders':  { dir: 'high', label: 'Descent' },
  'arcade:breakout':  { dir: 'high', label: 'Wallbreak' },
  'arcade:snake':     { dir: 'high', label: 'Serpentine' },
  'arcade:asteroids': { dir: 'high', label: 'Drift' },
  'arcade:simon':     { dir: 'high', label: 'Four Tones' },
  'arcade:pong':      { dir: 'high', label: 'Rally' },
  'arcade:racer':     { dir: 'high', label: 'Backroad' },
  // the song guesser: one board counts streaks, one counts speed
  'needle:streak':    { dir: 'high', label: 'Longest streak' },
  // milliseconds to a correct answer, so here lower is better
  'needle:fast':      { dir: 'low',  label: 'Fastest correct guess' },
};

const boardList = () => Object.keys(BOARDS).map((k) =>
  ({ id: k, label: BOARDS[k].label, dir: BOARDS[k].dir }));

/* A handle is three-to-twelve visible characters. Arcade cabinets take
   three; the song guesser is happier with a word. Empty is allowed and
   shows as "anon" on the board rather than being rejected. */
function cleanHandle(raw) {
  if (typeof raw !== 'string') return '';
  const h = raw.replace(CONTROL, '').replace(/\s+/g, ' ').trim().slice(0, 12);
  return LINKY.test(h) ? '' : h;
}

function submitScore(board, token, score, handle, detail) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const spec = BOARDS[board];
  if (!spec) return { ok: false, why: 'unknown_board' };
  if (!okToken(token)) return { ok: false, why: 'bad_token' };

  const n = Number(score);
  if (!Number.isFinite(n) || n < 0 || n > 1e9) return { ok: false, why: 'bad_score' };
  const v = Math.round(n);

  const h = cleanHandle(handle);
  const d = typeof detail === 'string' ? detail.replace(CONTROL, '').trim().slice(0, 40) : '';
  const now = Date.now();

  // "Better" depends on the board: most of these want the biggest number,
  // the speed one wants the smallest. Doing this in SQL keeps the read and
  // the write from disagreeing about which way is up.
  const better = spec.dir === 'low' ? 'excluded.score < scores.score'
                                    : 'excluded.score > scores.score';
  db.prepare(`
    INSERT INTO scores (board, token, handle, score, detail, at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(board, token) DO UPDATE SET
      score  = CASE WHEN ${better} THEN excluded.score  ELSE scores.score  END,
      detail = CASE WHEN ${better} THEN excluded.detail ELSE scores.detail END,
      at     = CASE WHEN ${better} THEN excluded.at     ELSE scores.at     END,
      handle = excluded.handle
  `).run(board, token, h, v, d, now);

  return Object.assign({ ok: true }, leaderboard(board, token));
}

function leaderboard(board, token) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const spec = BOARDS[board];
  if (!spec) return { ok: false, why: 'unknown_board' };
  const order = spec.dir === 'low' ? 'ASC' : 'DESC';

  const rows = db.prepare(
    `SELECT handle, score, detail, at, token FROM scores
     WHERE board = ? ORDER BY score ${order}, at ASC LIMIT 20`
  ).all(board);

  const total = db.prepare('SELECT COUNT(*) AS n FROM scores WHERE board = ?').get(board).n;

  let mine = null;
  if (okToken(token)) {
    const row = db.prepare(
      'SELECT handle, score, detail, at FROM scores WHERE board = ? AND token = ?'
    ).get(board, token);
    if (row) {
      const ahead = db.prepare(
        `SELECT COUNT(*) AS n FROM scores WHERE board = ? AND score ${spec.dir === 'low' ? '<' : '>'} ?`
      ).get(board, row.score).n;
      mine = Object.assign({ rank: ahead + 1 }, row);
    }
  }

  // The token is how "yours" is marked and is never sent back out.
  const top = rows.map((r, i) => ({
    rank: i + 1,
    handle: r.handle || 'anon',
    score: r.score,
    detail: r.detail,
    at: r.at,
    you: okToken(token) && r.token === token,
  }));

  return { ok: true, board, label: spec.label, dir: spec.dir, players: total, top, mine };
}

/* ---- guestbook ---------------------------------------------------- */

const GUESTBOOK_PAGE = 50;

function sign(token, handle, text) {
  if (!ready()) return { ok: false, why: 'no_store' };
  if (!okToken(token)) return { ok: false, why: 'bad_token' };
  const c = cleanText(text);
  if (!c.ok) return { ok: false, why: c.why };

  // One signature every two minutes per browser. Slower than the per-IP
  // gate in the server so a shared address does not lock a household out.
  const recent = db.prepare(
    'SELECT at FROM guestbook WHERE token = ? ORDER BY at DESC LIMIT 1'
  ).get(token);
  if (recent && Date.now() - recent.at < 2 * 60 * 1000) {
    return { ok: false, why: 'too_soon', wait: 2 * 60 * 1000 - (Date.now() - recent.at) };
  }

  const info = db.prepare(
    'INSERT INTO guestbook (token, handle, text, at) VALUES (?, ?, ?, ?)'
  ).run(token, cleanHandle(handle), c.text, Date.now());

  return Object.assign({ ok: true, id: Number(info.lastInsertRowid) }, guestbook(token, 0));
}

function guestbook(token, before) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const cursor = Number(before);
  const hasCursor = Number.isFinite(cursor) && cursor > 0;
  const stmt = db.prepare(
    'SELECT id, handle, text, at, token FROM guestbook ' +
    (hasCursor ? 'WHERE id < ? ' : '') +
    'ORDER BY id DESC LIMIT ' + GUESTBOOK_PAGE
  );
  const rows = hasCursor ? stmt.all(cursor) : stmt.all();

  const total = db.prepare('SELECT COUNT(*) AS n FROM guestbook').get().n;
  return {
    ok: true, total,
    entries: rows.map((r) => ({
      id: r.id, handle: r.handle || 'anon', text: r.text, at: r.at,
      you: okToken(token) && r.token === token,
    })),
    more: rows.length === GUESTBOOK_PAGE,
  };
}

/* ---- the hall of fame ---------------------------------------------- *
 *  Signed only by somebody who has found every hidden thing in the
 *  cabinet. The server cannot verify that and does not pretend to: the
 *  count arrives from the browser, where the tracker keeps it, and a
 *  determined person could obviously send any number they liked.
 *
 *  That is a deliberate choice rather than an oversight. Verifying it
 *  properly would mean the server keeping a per-visitor record of which
 *  eggs each person had found, which is exactly the surveillance the
 *  tracker was built to avoid — a record of how each visitor plays. The
 *  wall is a nice thing at the end of a long game, not a security
 *  boundary, and it is not worth watching everybody to protect it.
 *
 *  What the server does enforce is everything that protects other
 *  people: the text is cleaned the same way every other shared board is,
 *  one row per browser, and the claimed count has to be a plausible
 *  number rather than whatever was in the request.
 * ------------------------------------------------------------------- */
const HALL_PAGE = 200;

function hallSign(token, handle, text, found, total) {
  if (!ready()) return { ok: false, why: 'no_store' };
  if (!okToken(token)) return { ok: false, why: 'bad_token' };

  const f = Number(found), t = Number(total);
  if (!Number.isFinite(f) || !Number.isFinite(t) || t < 1 || t > 10000 ||
      f < t || f > t) {
    return { ok: false, why: 'not_finished' };
  }

  // The text is optional here, unlike the guestbook: getting to the end
  // is the message, and somebody may not want to add to it.
  let clean = '';
  if (String(text || '').trim()) {
    const c = cleanText(text);
    if (!c.ok) return { ok: false, why: c.why };
    clean = c.text;
  }

  db.prepare(
    'INSERT INTO hall (token, handle, text, found, at) VALUES (?, ?, ?, ?, ?) ' +
    'ON CONFLICT(token) DO UPDATE SET handle = excluded.handle, ' +
    'text = excluded.text, found = excluded.found, at = excluded.at'
  ).run(token, cleanHandle(handle), clean, f, Date.now());

  return hall(token);
}

function hall(token) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const rows = db.prepare(
    'SELECT handle, text, found, at, token FROM hall ORDER BY at ASC LIMIT ' + HALL_PAGE
  ).all();
  const total = db.prepare('SELECT COUNT(*) AS n FROM hall').get().n;
  return {
    ok: true, total,
    signed: okToken(token) &&
            !!db.prepare('SELECT 1 FROM hall WHERE token = ?').get(token),
    entries: rows.map((r) => ({
      handle: r.handle || 'anon', text: r.text, found: r.found, at: r.at,
      you: okToken(token) && r.token === token,
    })),
  };
}

/* ---- the pixel canvas --------------------------------------------- */

const CANVAS_W = 96, CANVAS_H = 64;
const PALETTE_N = 16;          // the page's palette; only the index is stored
const PIXEL_BUDGET = 8;        // per browser, per window
const PIXEL_WINDOW = 30 * 60 * 1000;

function place(token, spots) {
  if (!ready()) return { ok: false, why: 'no_store' };
  if (!okToken(token)) return { ok: false, why: 'bad_token' };
  if (!Array.isArray(spots) || !spots.length) return { ok: false, why: 'nothing' };

  const now = Date.now();
  const used = db.prepare(
    'SELECT COUNT(*) AS n FROM pixels WHERE token = ? AND at >= ?'
  ).get(token, now - PIXEL_WINDOW).n;
  const left = Math.max(0, PIXEL_BUDGET - used);
  if (!left) return { ok: false, why: 'no_budget', budget: PIXEL_BUDGET, left: 0, resetsIn: PIXEL_WINDOW };

  const take = spots.slice(0, left);
  const stmt = db.prepare(
    'INSERT INTO pixels (x, y, c, token, at) VALUES (?, ?, ?, ?, ?) ' +
    'ON CONFLICT(x, y) DO UPDATE SET c = excluded.c, token = excluded.token, at = excluded.at'
  );
  let wrote = 0;
  for (const s of take) {
    const x = Math.round(Number(s && s.x)), y = Math.round(Number(s && s.y));
    const c = Math.round(Number(s && s.c));
    if (!Number.isFinite(x) || x < 0 || x >= CANVAS_W) continue;
    if (!Number.isFinite(y) || y < 0 || y >= CANVAS_H) continue;
    if (!Number.isFinite(c) || c < 0 || c >= PALETTE_N) continue;
    stmt.run(x, y, c, token, now);
    wrote++;
  }
  if (!wrote) return { ok: false, why: 'off_canvas' };
  return Object.assign({ ok: true, wrote }, canvas(token));
}

function canvas(token) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const rows = db.prepare('SELECT x, y, c FROM pixels').all();

  // A flat array of x,y,c triples: at 96x64 the whole canvas is under
  // 19 KB of JSON even when full, so there is no need for a diff protocol.
  const flat = [];
  for (const r of rows) { flat.push(r.x, r.y, r.c); }

  const now = Date.now();
  let left = PIXEL_BUDGET, resetsIn = 0;
  if (okToken(token)) {
    const mine = db.prepare(
      'SELECT COUNT(*) AS n, MIN(at) AS first FROM pixels WHERE token = ? AND at >= ?'
    ).get(token, now - PIXEL_WINDOW);
    left = Math.max(0, PIXEL_BUDGET - mine.n);
    resetsIn = mine.first ? Math.max(0, mine.first + PIXEL_WINDOW - now) : 0;
  }
  const painters = db.prepare('SELECT COUNT(DISTINCT token) AS n FROM pixels').get().n;

  return { ok: true, w: CANVAS_W, h: CANVAS_H, palette: PALETTE_N,
           px: flat, placed: rows.length, painters,
           budget: PIXEL_BUDGET, left, resetsIn, window: PIXEL_WINDOW };
}

/* ---- the story ---------------------------------------------------- */

const STORY_TAIL = 40;
const SENTENCE_MAX = 180;
const STORY_COOLDOWN = 60 * 1000;

/* A sentence, not a paragraph and not an essay. The cap is tighter than
   the bottles' and one line only, because the whole point is that the
   next person gets to write the next bit. */
function cleanSentence(raw) {
  if (typeof raw !== 'string') return { ok: false, why: 'no_text' };
  let t = raw.replace(CONTROL, '').replace(/\s+/g, ' ').trim();
  if (!t) return { ok: false, why: 'empty' };
  if (t.length > SENTENCE_MAX) return { ok: false, why: 'too_long' };
  if (LINKY.test(t)) return { ok: false, why: 'no_links' };
  return { ok: true, text: t };
}

function addSentence(token, text) {
  if (!ready()) return { ok: false, why: 'no_store' };
  if (!okToken(token)) return { ok: false, why: 'bad_token' };
  const c = cleanSentence(text);
  if (!c.ok) return { ok: false, why: c.why };

  // Nobody writes the story on their own: one sentence a minute per
  // browser, and never two in a row.
  const last = db.prepare('SELECT token, at FROM story ORDER BY n DESC LIMIT 1').get();
  if (last && last.token === token) return { ok: false, why: 'your_turn_passed' };

  const mine = db.prepare('SELECT at FROM story WHERE token = ? ORDER BY n DESC LIMIT 1').get(token);
  if (mine && Date.now() - mine.at < STORY_COOLDOWN) {
    return { ok: false, why: 'too_soon', wait: STORY_COOLDOWN - (Date.now() - mine.at) };
  }

  const info = db.prepare(
    'INSERT INTO story (text, token, at) VALUES (?, ?, ?)'
  ).run(c.text, token, Date.now());

  return Object.assign({ ok: true, added: Number(info.lastInsertRowid) }, story(token));
}

function story(token, from) {
  if (!ready()) return { ok: false, why: 'no_store' };
  const total = db.prepare('SELECT COUNT(*) AS n FROM story').get().n;

  const start = Number(from);
  const rows = Number.isFinite(start) && start > 0
    ? db.prepare('SELECT n, text, token, at FROM story WHERE n >= ? ORDER BY n ASC LIMIT ?')
        .all(start, STORY_TAIL)
    : db.prepare('SELECT n, text, token, at FROM story ORDER BY n DESC LIMIT ?')
        .all(STORY_TAIL).reverse();

  const last = db.prepare('SELECT token FROM story ORDER BY n DESC LIMIT 1').get();
  const mine = okToken(token)
    ? db.prepare('SELECT at FROM story WHERE token = ? ORDER BY n DESC LIMIT 1').get(token)
    : null;

  return {
    ok: true, total, max: SENTENCE_MAX,
    lines: rows.map((r) => ({ n: r.n, text: r.text, at: r.at,
                              you: okToken(token) && r.token === token })),
    yoursIsLast: !!(last && okToken(token) && last.token === token),
    waitFor: mine ? Math.max(0, mine.at + STORY_COOLDOWN - Date.now()) : 0,
    contributors: db.prepare('SELECT COUNT(DISTINCT token) AS n FROM story').get().n,
  };
}

module.exports = {
  ready, status, MAX_TEXT,
  castBottle, findBottle, markFound, bottleStats,
  seen, roster,
  BOARDS, boardList, submitScore, leaderboard,
  sign, guestbook,
  hallSign, hall,
  place, canvas, CANVAS_W, CANVAS_H, PALETTE_N,
  addSentence, story, SENTENCE_MAX,
};
