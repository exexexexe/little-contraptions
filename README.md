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

**132 drawers**, each a single self-contained HTML file under `public/<slug>/index.html`.
The hub filters them by the tag on each card.

The table below covers the first 29 and has not been maintained since — the
card grid in `public/index.html` is the actual index, and `PROGRESS.md` is the
running log of what was added when. Rather than leave a stale count at the top
of the file, the number above is kept correct and the table is labelled for
what it is.

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

(The table above stops at 29; the hub itself is at 109. Bringing it up to date is on the list.)

`/api/keys` reports which optional keys are configured — `nasa`, `tmdb`, `groq`, `pexels` — plus
`store`, which is not a key but says whether the shared database is open. `pexels` gates
`/atmosphere/`; `tmdb` gates `/movie-night/`; `store` gates `/message-in-a-bottle/` and
`/who-else-is-here/`. Each says so on its own page and nothing else is affected.

`GROQ_API_KEY` powers `POST /api/generate`, the shared text-generation route used by
what-beats-this, character-match, universes-colliding, espionage, bureaucracy and
interview-beyond. Without it those six show a "needs a key" state and everything else is
unaffected. `GROQ_MODEL` optionally overrides the model (default `qwen/qwen3.8-27b`);
`GROQ_URL` overrides the endpoint, which is only useful for testing. Rate limited to 20
requests per IP per hour, in memory.

Every toy carries the same back-to-the-hub control in the bottom-left corner,
and the hub shows a live preview of a toy when you hover its card.

## The desktop rail

The Windows 98 mode keeps six widgets down the right-hand side. Three of them
do real work:

- **Weather Monitor** — the actual sky wherever the visitor is, from
  Open-Meteo, placed by `/api/where`. Falls back to geocoding the browser's
  time-zone name, then to an honest "no station" state. The sky is drawn as
  pixel art per condition and per day/night: sun, stars, a crescent moon,
  drifting cloud, rain, snow, fog bands and lightning. The title bar carries
  the station's own local time.
- **Desk Toy** — a Newton's cradle. Five real pendulums integrated as
  `-(g/L)sin(theta)` with air resistance, exchanging horizontal velocity
  through equal-mass elastic impulses when they touch. One in, one out; two
  in, two out — that comes out of the physics, not out of a script. Drag a
  ball; while held it is treated as infinitely heavy, so it shoves the others.
  It runs down in about half a minute and then something taps it again.
- **Defragmenting C:** — 168 blocks and a head that walks the drive.

The other three are the older ornaments: a camera watching nothing, a meter
measuring nothing, and a note from whoever left.

### Moving them about

They start in the tidy rail on the right and can be picked up:

- **Drag** one by its title bar — the note by its face — to put it anywhere.
- **Resize** by the corner grip. Width is the only handle; the pictures are
  canvases with a fixed aspect blown up to fill, so height follows from the
  content and nothing can be stretched out of shape. Everything scales
  together: a widget pulled to twice the width reads as one object twice the
  size rather than a big picture with small print under it.
- **Double-click a title bar** to swell it and again to put it back. Not to
  the whole screen — these are gadgets.
- **Double-click the bare desktop** to tidy them all back into the rail.

The first drag or pull takes the whole set into free mode at once: every
widget is measured where it sits and pinned there, so nothing jumps at the
moment of the first grab, and the rail leaves the flex row — which lets the
icon grid spread into the column it used to hold. Positions and sizes are
remembered in `localStorage` under `lc-w98-widgets`, clamped back into view
on load and on resize so a widget can never be stranded off an edge or
dropped under the taskbar.

### What they still are

Decoration. The rail stays out of the accessibility tree, and dragging,
resizing and the double-press are pointer gestures with no focusable control
among them — so a keyboard or screen-reader visitor loses nothing they were
being offered. That is the same bargain the cradle struck. In rail mode the
widgets are their own column and overlap nothing; in free mode they sit over
the icons, because that is where they were put.

Everything is drawn on canvases 84 pixels across and blown up by CSS with
smoothing off, so making one bigger sharpens it into bigger pixels rather
than blurring it. Short viewports shed widgets from the bottom up at measured
thresholds rather than letting the rail crowd the taskbar, and narrow ones
drop it entirely. Nothing animates while the desktop is down, the tab is in
the background, or the rail is off screen; under `prefers-reduced-motion`
nothing moves at all until a hand is on the cradle.

## Server routes

    /api/keys              which optional keys are configured
    /api/nasa/neo?date=    NASA near-Earth objects, NASA_API_KEY or DEMO_KEY, 30 min cache
    /api/rss?feed=         relays one of a fixed allowlist of RSS feeds, 10 min cache
    /api/rss/list          the allowlist
    /api/iss/position      Open Notify relay — it has no HTTPS of its own
    /api/iss/tle           Celestrak orbital elements, 2 h cache
    /api/where             coarse location from the caller's IP, 6 h cache
    /api/photos?mode=      Pexels relay for /atmosphere/, fixed search list, 1 h cache
    /api/preview?title=&artist=  Deezer metadata relay for /europop-guesser/, no key needed
    /api/movie?mood=       TMDB relay for /movie-night/, TMDB_API_KEY, 6 h pool cache
    /api/presence          POST: record this visit by city, GET: today's roster
    /api/bottle            GET: a surfaced note at random, POST: cast one
    /api/bottle/found      POST: mark a note as actually read
    /api/here?t=           how many people are on the hub right now — in memory only
    /api/scores            GET ?board= a leaderboard, POST a score; GET bare lists the boards
    /api/guestbook         GET the wall (?before= to page back), POST a signature
    /api/pixels            GET the shared canvas, POST up to your remaining pixels
    /api/story             GET the tail of the shared story, POST one sentence

Keys are read from the environment and never reach the browser. The RSS relay
takes a short feed name, never a URL — an arbitrary `?url=` would make it an
open proxy.

`/api/preview` needs no key at all: Deezer's public search endpoint is open, and it answers with a
30-second preview MP3 on Deezer's own CDN. The relay exists only because `api.deezer.com` sends no
`Access-Control-Allow-Origin`, which was confirmed by calling it from a real browser rather than by
reading the headers. **The audio is never proxied, cached or re-served** — the browser plays it
straight from Deezer, whose CDN does send `Access-Control-Allow-Origin: *`. Preview URLs are signed
and expire, so a fresh one is fetched each round. Spotify was considered and rejected: its
`preview_url` is now marked deprecated and nullable, needs OAuth, and its terms say preview clips
may not be offered as a standalone product.

`/api/movie` needs `TMDB_API_KEY` and answers one film, never a list — `/movie-night/` deals a
single card and the route is shaped to match. The moods are a fixed allowlist on the server, like
the RSS and photo relays, so the browser cannot turn it into a free TMDB proxy. Two upstream calls
per deal: `/discover/movie` for the pool (cached six hours, so a veto costs only the second call)
and `/movie/{id}` for the runtime, tagline and watch providers, which discover does not return.

Two things about TMDB that had to be found by trying rather than by reading: `with_genres` treats
`,` as AND and `|` as OR, so a comma asks for films that are both action *and* adventure (964 rows
against 3,877); and the discover index disagrees with the detail records about runtime — id 4105
answers a `with_runtime.lte=120` query and then reports 125 minutes. The route therefore checks the
runtime again after fetching details and deals another card if the cap was broken.

`/api/photos` needs `PEXELS_API_KEY` and answers `200 {ok:false, reason:"no_key"}` without one, so
`/atmosphere/` shows an honest needs-a-key panel instead of failing. `mode` is `nostalgia` or
`liminal` and the search terms are a fixed list per mode, indexed by number — the browser never
sends a query string. Same rule as the RSS relay, and the same reason: an arbitrary `?query=` would
make this a free image search running on somebody else's quota.

The five shared routes all sit on the same SQLite file as the bottles and the
presence map, and all five answer `200 {ok:false, why:"no_store"}` rather than
a 5xx when the volume is not mounted — every page that uses one has a state
for "there is no shared storage today", and none of them should read as a
broken server. Verified by starting the server with every writable directory
denied: all four data routes report `no_store`, all five pages show the honest
panel, and the arcade and the song guesser keep working with local scores only.

`/api/here` is the exception and is deliberately **not** in the database. "Right
now" is a fact about this process in the last ninety seconds; writing it down
would make the toy claim to know something it does not, and after a restart the
honest answer really is that nobody has said hello yet.

Identity on all of them is one random string the browser invents for itself
(`shared/lc-id.js`) — never derived from the address, the user agent or
anything else about the visitor, stored by the server as an opaque key, and
never sent back out to anybody.

`/api/where` is keyless. It exists because the hub's weather widget wants
somewhere to report on and the front door should not raise a browser
permission prompt to get it, and because ip-api.com serves plain HTTP only —
the same reason the ISS relay is here. City-level at best. Nothing is stored:
the address goes upstream, the answer is cached against it for six hours, and
that cache dies with the process. Failure answers `200 {ok:false}`, not a 5xx,
because the caller is an ornament with its own fallback.

## The Windows 98 desktop

The toggle in the corner swaps the card grid for a desktop. It is generated
from the cards, so a new drawer needs no edit there.

**Icons can be moved.** It starts auto-arranged; dragging one pins every icon
where it already sat and from then on they are placed by hand, snapped to the
grid's own measured cell. **Folders** hold drawers: drop one on a folder to
file it, drag it out of the open window to unfile it. Right-click anything for
the same operations as a list. All of it is remembered in `lc-w98-desktop`.

The rule the whole thing is built under: the desktop ornaments are decoration
and are fair to make pointer-only, but **the icons are the navigation**. So
every icon stays an `<a href>` a keyboard can reach, every gesture has a
context-menu equivalent (Shift+F10 and the menu key open it), and the Start
menu lists every drawer whatever the desktop looks like. Nothing a visitor does
out there can lose them a toy.

**Icon styles** — pixel, cartoon, flat, realistic — live in Display Properties.
One set of drawings; what changes is the contour. Every outline in the sprite is
`stroke="var(--ic-ink, <its own colour>)"`, which works because custom
properties inherit into a `<use>` shadow tree even though selectors do not. Only
contours are parameterised: a stroke on `fill="none"` is the drawing itself and
a stroke with no fill is a detail line, and both keep their own colour in every
style.

## Structure

    server.js            static file server and API relays, respects $PORT
    store.js             SQLite on the Railway volume; degrades to off
    public/index.html    the hub / card grid
    public/404.html      served for any unknown path
    public/weather/      "The Elsewhere Almanac"
    public/inventions/   "The Inventions of Humanity"

    public/shared/       the pieces more than one toy uses
      lc-generate.js       client for POST /api/generate
      lc-id.js             the one anonymous visitor id
      lc-commons.js        Wikimedia Commons: origin=*, the thumb-host rewrite,
                           and the no-credit-no-display rule
      lc-filters.js        the eight photograph grades
      lc-audio.js          the Web Audio bench, out of Room Tone
      lc-weather-fx.js     the twelve-effect particle field, out of the almanac
      world-land.js        world coastlines for a 720x360 viewBox

`NO_CACHE=1` serves every static file with `no-store`. An hour of browser cache
on a `.js` file is right in production and maddening while editing one.

## Adding a new toy

1. Drop a self-contained folder under `public/your-toy/index.html`.
2. Add a card to the grid in `public/index.html` — copy an existing
   `.card-slot` block, bump the `No. 0N`, update the title, blurb, tag,
   and `href`.
3. Remove the "still being built" ghost card if it's no longer the last
   free slot, or leave it if there's still room.

## Live

https://contraptions.up.railway.app

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

Push to GitHub, then trigger the deploy — Railway does **not** deploy on push
here. Either **Deploy Latest Commit** from Railway's command palette, or point
`connect-service-source` at the repo again with the branch you mean. Railway
detects the Node app via `package.json` and runs `npm start` automatically — no
build config needed.

One thing worth checking before you trigger it: **which branch the service is
actually tracking.** It is not always `main` — a narrow fix has more than once
been shipped on its own branch, and the service goes on tracking that branch
afterwards. Pointing it back at `main` will roll that work back unless `main`
already contains it, so compare first:

    git diff --stat <deployed-commit> HEAD -- <the files that branch touched>

An empty diff means `main` carries it and the switch is safe.
