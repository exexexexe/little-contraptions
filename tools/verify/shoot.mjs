/* shoot.mjs — load a page headless, record every console message and page
 * error, and save a screenshot. The "done ≠ verified" rule wants the picture
 * looked at, not the markup inferred from.
 *
 *   PW=<abs path to playwright> node tools/verify/shoot.mjs \
 *     --url http://127.0.0.1:3117/workshop/ --out verification/phase-0/board.png
 *
 * Exits non-zero if anything reached the console as an error, so it can be
 * used as a gate rather than read by eye.
 */
/* ESM ignores NODE_PATH, so an out-of-repo Playwright is pointed at with
   $PW — an absolute path to its package — and imported dynamically. */
const _pw = await import(process.env.PW || 'playwright');
const { chromium } = _pw.chromium ? _pw : _pw.default;
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i > -1 ? process.argv[i + 1] : d;
};

const url = arg('url');
const out = arg('out');
const wait = Number(arg('wait', 1200));
const width = Number(arg('width', 1280));
const height = Number(arg('height', 900));
const full = process.argv.includes('--full');
if (!url || !out) { console.error('need --url and --out'); process.exit(2); }

/* Recent Playwright prefers a separate "headless shell" build. Where only the
   full Chromium is on the machine, fall back to it rather than asking for
   another download. */
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chromium' }));
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });

const errors = [];
const logs = [];
page.on('console', m => {
  logs.push(`[${m.type()}] ${m.text()}`);
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('requestfailed', r => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText || ''}`));

const resp = await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(wait);
await mkdir(dirname(out), { recursive: true });
await page.screenshot({ path: out, fullPage: full });

console.log(`${url} -> ${resp.status()}  shot: ${out}  ${width}x${height}`);
for (const l of logs) console.log('  ' + l);
if (errors.length) {
  console.log(`\nFAIL — ${errors.length} console/page error(s):`);
  for (const e of errors) console.log('  ! ' + e);
} else {
  console.log('\nOK — zero console errors.');
}
await browser.close();
process.exit(errors.length ? 1 : 0);
