'use strict';

/* ------------------------------------------------------------------ *
 *  Little Contraptions — static host for the hub and its toys.
 *  Zero dependencies. Streams files so large pages don't sit in memory.
 * ------------------------------------------------------------------ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolveRequest(urlPath) {
  // Strip query string, decode, and confine to ROOT.
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const full = path.normalize(path.join(ROOT, p));
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null; // traversal guard
  return full;
}

/* ------------------------------------------------------------------ *
 *  API proxies.
 *  Anything that needs a key, or lives on a host that refuses
 *  cross-origin requests, is fetched here instead of from the browser.
 *  Keys only ever come from the environment and never reach the client.
 *  Responses are cached briefly, mostly to stay inside free-tier limits.
 * ------------------------------------------------------------------ */

const UPSTREAM_TIMEOUT = 12000;
const cache = new Map(); // key -> { until, status, body }

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.until) { cache.delete(key); return null; }
  return hit;
}

function cacheSet(key, status, body, ttlMs) {
  if (cache.size > 200) cache.clear(); // crude, but this is a toy hub
  cache.set(key, { until: Date.now() + ttlMs, status, body });
}

function sendJson(res, status, obj, extraHeaders) {
  const body = typeof obj === 'string' ? obj : JSON.stringify(obj);
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  }, extraHeaders || {}));
  res.end(body);
}

async function fetchUpstream(url, headers) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: Object.assign({ 'User-Agent': 'little-contraptions/1.0 (hub)' }, headers || {}),
    });
    return { status: r.status, body: await r.text() };
  } finally {
    clearTimeout(timer);
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Fixed set of relayable feeds. Add here, never from the query string.
const FEEDS = {
  goodnews: { url: 'https://www.goodnewsnetwork.org/feed/',   title: 'Good News Network',      site: 'goodnewsnetwork.org' },
  positive: { url: 'https://www.positive.news/feed/',         title: 'Positive News',          site: 'positive.news' },
  cheerful: { url: 'https://reasonstobecheerful.world/feed/', title: 'Reasons to be Cheerful', site: 'reasonstobecheerful.world' },
};

async function handleApi(req, res, url) {
  const path = url.pathname;

  // --- NASA near-Earth objects -------------------------------------
  // DEMO_KEY works with no signup but is rate limited to ~30 requests
  // an hour; setting NASA_API_KEY in Railway (free, instant) lifts that.
  if (path === '/api/nasa/neo') {
    const date = url.searchParams.get('date') || '';
    if (!DATE_RE.test(date)) return sendJson(res, 400, { error: 'date must be YYYY-MM-DD' });

    const key = process.env.NASA_API_KEY || 'DEMO_KEY';
    const usingDemo = !process.env.NASA_API_KEY;
    const cacheKey = 'neo:' + date;

    const hit = cacheGet(cacheKey);
    if (hit) return sendJson(res, hit.status, hit.body, { 'X-Cache': 'hit', 'X-Demo-Key': String(usingDemo) });

    try {
      const up = await fetchUpstream(
        'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + date +
        '&end_date=' + date + '&api_key=' + encodeURIComponent(key));
      if (up.status === 429) {
        return sendJson(res, 429, {
          error: 'rate_limited',
          demoKey: usingDemo,
          message: usingDemo
            ? 'NASA DEMO_KEY hourly limit reached. Set NASA_API_KEY in Railway to lift it.'
            : 'NASA rate limit reached for this key.',
        });
      }
      if (up.status >= 400) return sendJson(res, up.status, { error: 'upstream_' + up.status });
      cacheSet(cacheKey, up.status, up.body, 30 * 60 * 1000); // 30 min
      return sendJson(res, 200, up.body, { 'X-Cache': 'miss', 'X-Demo-Key': String(usingDemo) });
    } catch (e) {
      return sendJson(res, 502, { error: 'upstream_unreachable', message: String(e && e.message || e) });
    }
  }

  // --- RSS relay ---------------------------------------------------
  // RSS hosts essentially never send CORS headers, so feeds are fetched
  // here. The feed list is a fixed allowlist keyed by short name: accepting
  // an arbitrary ?url= would make this an open proxy (SSRF).
  if (path === '/api/rss') {
    const name = url.searchParams.get('feed') || '';
    const target = FEEDS[name];
    if (!target) return sendJson(res, 400, { error: 'unknown_feed', allowed: Object.keys(FEEDS) });

    const cacheKey = 'rss:' + name;
    const hit = cacheGet(cacheKey);
    if (hit) {
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'X-Cache': 'hit' });
      return res.end(hit.body);
    }
    try {
      const up = await fetchUpstream(target.url, { Accept: 'application/rss+xml, application/xml, text/xml' });
      if (up.status >= 400) return sendJson(res, 502, { error: 'feed_http_' + up.status });
      cacheSet(cacheKey, 200, up.body, 10 * 60 * 1000);
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'X-Cache': 'miss' });
      return res.end(up.body);
    } catch (e) {
      return sendJson(res, 502, { error: 'feed_unreachable', message: String(e && e.message || e) });
    }
  }

  if (path === '/api/rss/list') {
    return sendJson(res, 200, Object.keys(FEEDS).map((k) => ({ key: k, title: FEEDS[k].title, site: FEEDS[k].site })));
  }

  // --- ISS position -------------------------------------------------
  // Open Notify serves over plain HTTP only — there is no HTTPS endpoint —
  // so a browser on this HTTPS site would refuse it as mixed content.
  // It is fetched here instead. wheretheiss.at is the primary source and
  // is called directly by the page; this is the documented fallback.
  if (path === '/api/iss/position') {
    const hit = cacheGet('iss:pos');
    if (hit) return sendJson(res, 200, hit.body, { 'X-Cache': 'hit' });
    try {
      const up = await fetchUpstream('http://api.open-notify.org/iss-now.json');
      if (up.status >= 400) return sendJson(res, 502, { error: 'upstream_' + up.status });
      cacheSet('iss:pos', 200, up.body, 2000);   // 2 s — it moves 7.7 km a second
      return sendJson(res, 200, up.body, { 'X-Cache': 'miss' });
    } catch (e) {
      return sendJson(res, 502, { error: 'open_notify_unreachable', message: String(e && e.message || e) });
    }
  }

  // --- ISS orbital elements ----------------------------------------
  // Celestrak does send CORS headers, but pass prediction only needs a
  // fresh TLE every few hours, so it is cached here to stay a polite client.
  if (path === '/api/iss/tle') {
    const hit = cacheGet('iss:tle');
    if (hit) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'hit' });
      return res.end(hit.body);
    }
    try {
      const up = await fetchUpstream(
        'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE');
      if (up.status >= 400) return sendJson(res, 502, { error: 'celestrak_' + up.status });
      if (!/^1 25544/m.test(up.body)) return sendJson(res, 502, { error: 'unexpected_tle_format' });
      cacheSet('iss:tle', 200, up.body, 2 * 60 * 60 * 1000);   // 2 h
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'miss' });
      return res.end(up.body);
    } catch (e) {
      return sendJson(res, 502, { error: 'celestrak_unreachable', message: String(e && e.message || e) });
    }
  }

  // --- submarine cable map relay -----------------------------------
  // TeleGeography publish this openly but send no CORS headers, so a browser
  // cannot read it directly. Same rule as the RSS relay: a fixed allowlist of
  // dataset names, never an arbitrary ?url=, so this cannot become an open
  // proxy. Cached for six hours — the cable map does not change hourly.
  const CABLE_SETS = {
    cables: 'https://www.submarinecablemap.com/api/v3/cable/cable-geo.json',
    list:   'https://www.submarinecablemap.com/api/v3/cable/all.json',
    points: 'https://www.submarinecablemap.com/api/v3/landing-point/landing-point-geo.json',
  };
  if (path === '/api/cables') {
    const set = (url.searchParams.get('set') || 'list').toLowerCase();
    const target = CABLE_SETS[set];
    if (!target) return sendJson(res, 400, { error: 'unknown_set', allowed: Object.keys(CABLE_SETS) });
    const key = 'cables:' + set;
    const hit = cacheGet(key);
    if (hit) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'hit' });
      return res.end(hit.body);
    }
    try {
      const up = await fetchUpstream(target, { Accept: 'application/json' });
      if (up.status >= 400) return sendJson(res, 502, { error: 'telegeography_' + up.status });
      try { JSON.parse(up.body); }
      catch (e) { return sendJson(res, 502, { error: 'unexpected_payload' }); }
      cacheSet(key, 200, up.body, 6 * 60 * 60 * 1000);   // 6 h
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'miss' });
      return res.end(up.body);
    } catch (e) {
      return sendJson(res, 502, { error: 'telegeography_unreachable', message: String(e && e.message || e) });
    }
  }

  // --- which optional keys are configured --------------------------
  // Lets a toy render an honest "needs a key" state instead of failing.
  if (path === '/api/keys') {
    return sendJson(res, 200, {
      nasa: !!process.env.NASA_API_KEY,   // falls back to DEMO_KEY when false
      tmdb: !!process.env.TMDB_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
    });
  }

  return sendJson(res, 404, { error: 'no such api route' });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method not allowed');
    return;
  }

  const parsed = new URL(req.url, 'http://localhost');
  if (parsed.pathname.startsWith('/api/')) {
    handleApi(req, res, parsed).catch((e) => {
      sendJson(res, 500, { error: 'proxy_failure', message: String(e && e.message || e) });
    });
    return;
  }

  let filePath = resolveRequest(req.url);
  if (!filePath) { res.writeHead(400).end('Bad request'); return; }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Fall back to a friendly 404 page if we have one, else plain text.
      const notFound = path.join(ROOT, '404.html');
      fs.stat(notFound, (e2, s2) => {
        if (!e2 && s2.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(notFound).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });

    if (req.method === 'HEAD') { res.end(); return; }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.end());
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Little Contraptions serving on port ${PORT}`);
});
