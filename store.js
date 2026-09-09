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

module.exports = {
  ready, status, MAX_TEXT,
  castBottle, findBottle, markFound, bottleStats,
  seen, roster,
};
