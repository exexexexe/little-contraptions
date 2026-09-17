/* sim.mjs — run the contraption bench's levels headless and report whether
 * they actually work.
 *
 * Authoring a level's JSON proves nothing. For each level this script:
 *   1. lints it against the schema;
 *   2. runs it **as handed to the player** and requires it NOT to solve —
 *      a level that is already solved before anybody touches it is a bug that
 *      reads as a pass;
 *   3. places the level's own `solution` and requires it to solve.
 *
 * Exits non-zero unless every level passes all three, so it gates.
 *
 *   PW=<abs path to playwright> node tools/verify/sim.mjs \
 *     --url http://127.0.0.1:3117/workshop/
 */
const _pw = await import(process.env.PW || 'playwright');
const { chromium } = _pw.chromium ? _pw : _pw.default;

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i > -1 ? process.argv[i + 1] : d;
};
const url = arg('url', 'http://127.0.0.1:3117/workshop/');
const only = arg('level', null);

const launch = process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {};
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.LCBench && window.LCBench.board.level);

const ids = await page.evaluate(() => LCBench.levels().map(l => l.id));
const list = only ? ids.filter(i => i === only) : ids;
if (!list.length) { console.error('no such level: ' + only); await browser.close(); process.exit(2); }

const rows = [];
for (const id of list) {
  const row = await page.evaluate(async (id) => {
    await LCBench.load(id);
    const b = LCBench.board;
    const lint = b.lint(b.level);

    /* As handed over: the level's own pre-placed parts, nothing added. */
    b.clear();
    const untouched = b.runHeadless();
    b.reset();

    let solution = { status: 'no solution in the file', steps: 0 };
    let used = 0;
    if ((b.level.solution || []).length) {
      /* A solution the bench refuses to lay out — a part that will not fit
         where the file says to put it — is a failing level, not a crash. */
      try {
        used = LCBench.applySolution();
        solution = LCBench.runHeadless();
      } catch (e) {
        solution = { status: 'cannot be laid out: ' + e.message, steps: 0 };
      }
    }
    b.clear(); b.reset();
    return {
      id, title: b.level.title,
      source: b.level.source, verified: b.level.verified,
      par: b.level.par == null ? null : b.level.par,
      lint, untouched, solution, used
    };
  }, id);
  rows.push(row);
}

let bad = 0;
console.log('');
for (const r of rows) {
  const problems = [];
  if (r.lint.length) problems.push('lint: ' + r.lint.join('; '));
  if (r.untouched.status === 'solved') problems.push('solves itself untouched');
  if (r.solution.status !== 'solved') problems.push('its own solution does not solve it (' + r.solution.status + ')');
  if (r.verified !== true) problems.push('marked verified: false');
  if (problems.length) bad++;

  console.log(`${problems.length ? 'FAIL' : ' OK '}  ${r.id.padEnd(16)} ${r.title}`);
  console.log(`      untouched: ${r.untouched.status} after ${r.untouched.steps} steps`);
  console.log(`      solution : ${r.solution.status} after ${r.solution.steps} steps` +
              (r.par != null ? `  (par ${r.par})` : ''));
  console.log(`      source   : ${r.source}, verified: ${r.verified}`);
  for (const p of problems) console.log('      ! ' + p);
}

if (errors.length) {
  bad++;
  console.log(`\n${errors.length} console/page error(s) during the run:`);
  for (const e of errors) console.log('  ! ' + e);
}

console.log(`\n${rows.length - bad}/${rows.length} level(s) pass.`);
await browser.close();
process.exit(bad ? 1 : 0);
