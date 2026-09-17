# Verification harness

Two scripts the build gates run against. Neither is a runtime dependency of the
hub — the server still has none — so Playwright is installed **outside** the
repo and pointed at with `NODE_PATH`:

    mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
    npx playwright install chromium

Then, with the hub running locally (`PORT=3117 node server.js`):

    PW=/tmp/pw/node_modules/playwright node tools/verify/shoot.mjs \
      --url http://127.0.0.1:3117/workshop/ --out verification/phase-0/board.png

    PW=/tmp/pw/node_modules/playwright node tools/verify/sim.mjs \
      --url http://127.0.0.1:3117/workshop/ --level test-ramp

`$PW` is an absolute path to the Playwright package: ES modules ignore
`NODE_PATH`, so the import is done dynamically off that variable instead. Leave
it unset if Playwright is on the normal resolution path.

`shoot.mjs` exits non-zero if anything reached the console as an error, so it
gates rather than informs. `sim.mjs` drives the contraption bench's headless
test hook: it loads a level, places a solution, runs the simulation to
completion at full speed, and reports whether the win condition actually fired.

Screenshots land in `verification/<phase>/` and are committed, so a later
session can see what the gate actually looked at.
