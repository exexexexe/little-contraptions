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
