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

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method not allowed');
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
