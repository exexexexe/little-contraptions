# Little Contraptions

A small hub of self-contained web toys. Zero dependencies — one Node
static file server, one HTML page per toy.

The single exception is the ISS tracker's 3D globe, which loads Three.js from
a CDN. Every other toy is dependency-free, and that one falls back to its flat
map if the CDN does not answer.

## Run locally

    node server.js

Opens on http://localhost:3000.

## The toys

29 drawers, each a single self-contained HTML file under `public/<slug>/index.html`.
The hub filters them by the tag on each card.

| # | Toy | Tag | What it is |
|---|-----|-----|------------|
| 01 | [The Elsewhere Almanac](/weather/) | generator | Weather for 23 places that don't exist, each with its own animated sky. |
| 02 | [The Inventions of Humanity](/inventions/) | scroll story | A scroll through everything we've built, one era at a time. |
| 03 | [On This Day, But Dramatic](/on-this-day/) | real data | Wikimedia's on-this-day feed staged as a rolling news channel. |
| 04 | [Close Call](/close-call/) | real data | Live near-Earth objects (NASA, proxied) and earthquakes (USGS). |
| 05 | [Race Your Ghost](/type-ghost/) | game | Typing test against a keystroke replay of your own best run. |
| 06 | [Name My Thing](/name-my-thing/) | generator | Guild, band, shop, tavern, ship and startup names. |
| 07 | [Wikipedia Rabbit Hole](/rabbit-hole/) | real data | Random article, real outgoing links, breadcrumb trail. |
| 08 | [Going Outside](/going-outside/) | real data | Sunrise/sunset for your location, and whether it's worth it. |
| 09 | [The Good News Wire](/good-news/) | real data | Three real good-news outlets via the RSS relay. |
| 10 | [Album Cover of the Day](/album-cover/) | generator | Date-seeded sleeve, plus a photo mode that exports a PNG. |
| 11 | [The Multiverse Coin Flip](/multiverse/) | generator | A verdict here, and the outcome in neighbouring universes. |
| 12 | [Right Now, Somewhere](/right-now/) | real data | Live Wikimedia edit firehose with running counters. |
| 13 | [Your Dreams](/your-dreams/) | reflection | A localStorage pinboard of everything you want. |
| 14 | [The Guide Entry](/the-guide/) | generator | Dry encyclopedia entries for any noun, stable per word. |
| 15 | [Apocalypse Readiness](/apocalypse-quiz/) | game | Form 7-B, scored, with a downloadable result card. |
| 16 | [Explain It To An Era](/explain-to-an-era/) | generator | Twelve listeners, each asking the thing they'd actually want to know. |
| 17 | [Unknown Sport of the Day](/unknown-sport/) | reference | 107 real sports, each with an animated icon of what it involves. |
| 18 | [Rick's Wiki](/ricks-wiki/) | generator | Patent filings with schematics and unlisted side effects. |
| 19 | [The Daily Hence](/future-news/) | generator | A front page from a century hence, 101 headline shapes. |
| 20 | [Scale Comparison Machine](/scale/) | reference | 16 comparisons, each with its own animation and its arithmetic shown. |
| 21 | [The Everyday Hidden Thing](/hidden-thing/) | reference | 36 objects and what they're quietly doing, drawn and mostly animated. |
| 22 | [Perfume Match](/perfume-match/) | game | Notes in, character out — 47 of them. Real people clearly framed. |
| 23 | [Nature's Greatest Hits](/nature-hits/) | real data | Today's tally from iNaturalist, GBIF and USGS. |
| 24 | [ISS Tracker](/iss/) | real data | Live position on a 3D globe, ground track, and visible-pass prediction by in-browser SGP4. |
| 25 | [Field PDA — Zone Survey](/the-zone/) | generator | 26 places in the Zone, Geiger audio, and an unmarked catch on the bezel. |
| 26 | [A Sunny Afternoon in the City](/city-day/) | real data | 96 attributed Commons photographs across 12 SF landmarks, under a fictional HUD. |
| 27 | [The Radio Hub](/radio/) | generator | Fourteen invented stations on a draggable dial; optional real CC audio. |
| 28 | [Civilizations, Ranked](/civilizations/) | scroll story | Up the Kardashev scale — build a Dyson swarm, send a message through a wormhole. |
| 29 | [The Loot Terminal](/loot-terminal/) | generator | Fantasy item appraisal with a compendium that persists in the browser. |

Still to build: Movie night (needs `TMDB_API_KEY`) and Phase C (needs
`GROQ_API_KEY`). `/api/keys` reports both as unset.

Every toy carries the same back-to-the-hub control in the bottom-left corner,
and the hub shows a live preview of a toy when you hover its card.

## Server routes

    /api/keys              which optional keys are configured
    /api/nasa/neo?date=    NASA near-Earth objects, NASA_API_KEY or DEMO_KEY, 30 min cache
    /api/rss?feed=         relays one of a fixed allowlist of RSS feeds, 10 min cache
    /api/rss/list          the allowlist
    /api/iss/position      Open Notify relay — it has no HTTPS of its own
    /api/iss/tle           Celestrak orbital elements, 2 h cache

Keys are read from the environment and never reach the browser. The RSS relay
takes a short feed name, never a URL — an arbitrary `?url=` would make it an
open proxy.

## Structure

    server.js            static file server, respects $PORT
    public/index.html    the hub / card grid
    public/404.html      served for any unknown path
    public/weather/      "The Elsewhere Almanac"
    public/inventions/   "The Inventions of Humanity"

## Adding a new toy

1. Drop a self-contained folder under `public/your-toy/index.html`.
2. Add a card to the grid in `public/index.html` — copy an existing
   `.card-slot` block, bump the `No. 0N`, update the title, blurb, tag,
   and `href`.
3. Remove the "still being built" ghost card if it's no longer the last
   free slot, or leave it if there's still room.

## Live

https://hub-production-c107.up.railway.app

Railway project `little-contraptions`, service `hub`, deploying from `main`.

**Pushes to `main` do not currently redeploy on their own.** Every deployment
so far has been triggered manually. The evidence: the repository has no
webhooks, there are no `SKIPPED` deployments in the service history, and all
19 deployments carry `reason: deploy` rather than a push trigger — so push
events are not reaching Railway at all, rather than arriving and being
filtered. The likely cause is that this repository was created after the
Railway project, so the Railway GitHub App does not have access to it. Fix it
in GitHub under Settings -> Applications -> Railway -> Repository access, then
reconnect the repo in the Railway service settings.

## Deploy

Push to GitHub, then trigger the deploy manually — either **Deploy Latest
Commit** from Railway's command palette, or point `connect-service-source` at
the repo again. Railway detects the Node app via
`package.json` and runs `npm start` automatically — no build config
needed.
