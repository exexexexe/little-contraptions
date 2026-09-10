# Overnight batch — progress log

## Summary — batches 15 to 20, the credits egg, and fifteen more eggs

> **Later addition.** The two items this batch deliberately left alone — the
> draggable desktop and the icon style selector — were built afterwards in their
> own session. See "The two dedicated-session items" below.

**Twenty-two new drawers, 110 to 132.** Plus the arcade's fourteenth game, five new
TV-voice archetypes, a third mode for Atmosphere, a third handset for the Zone PDA,
seventeen easter eggs, and four shared modules extracted out of toys that already
existed. Every new page was loaded in a real browser; nothing below is claimed on
the strength of having written it. **All 132 drawers** were then re-checked
together at the end — every card points at a page that exists, and every page
loads with no console error and real content on screen.

**Deployed.** Pushed to `main` and live at https://contraptions.up.railway.app —
including the two dedicated-session items below. Production was previously running
a separate `deploy-needle-drop` branch, so the service was pointed back at `main`;
checked first that this working copy was byte-identical to that branch on every
file it touched, so nothing the other session had shipped was rolled back.
Verified live: 132 cards, all 22 new pages 200, `store: true` on the mounted
volume with the four new tables created, all five shared routes answering, and
the head-count genuinely counting.

---

### The thing to read first: the shared storage was already there

The brief said five items were blocked on "the shared SQLite-on-Railway-volume
infrastructure from the message-in-a-bottle work" and to check whether it exists
before assuming. **It exists** — `store.js`, SQLite through `node:sqlite`, on the
volume at `/data` with a gitignored local fallback. So **none of the five were
skipped**: the shared arcade leaderboards, the song-guesser boards, the guestbook,
the pixel canvas and the story chain are all built on it.

`store.js` gained four tables. Two decisions in there worth knowing about:

- **Scores are one row per (board, token).** Beating your own score edits the row
  you already have rather than filling the board with your afternoon.
- **Which way is "better" is written into the SQL from the board's own direction.**
  Fifteen boards want the biggest number; the song guesser's speed board wants the
  smallest. Doing it in the statement rather than in the caller keeps the read and
  the write from ever disagreeing about which way is up.

And the head-count is deliberately **not** in the database. "X people here right
now" is a fact about this server process in the last ninety seconds. Writing it
down would make the hub claim to know something it does not, and after a restart
the honest answer really is that nobody has said hello yet.

**The degradation was tested, not assumed.** The server was started with every
writable directory denied. All four data routes answer `200 {ok:false,
why:"no_store"}`, all five pages show the same honest panel, and the arcade and
the song guesser keep working on local scores alone.

---

### One thing about this run that is not about the code

**Another session was committing to this repository at the same time.** Commit
`b854a66` ("Needle Drop: 140 more Europop, no repeats, and a speaker that
moves") landed at 19:21:32, three seconds before this session's TV-voice commit.
Both sessions had `public/needle-drop/index.html` open.

Nothing was lost, and it was checked rather than assumed: the file now carries
**both** sets of work — their 304-track pool and shuffled-bag dealer, and this
session's shared leaderboards and streak counter — and it was driven through five
rounds in a browser with no errors. One side effect to know about: five lines of
their cache-buster change were swept into this session's commit `546ac08` by a
`git add -A` that ran while their edit was in the working tree, so that hunk sits
under the wrong commit message. The content is intact and the diff shows what it
is.

Worth avoiding next time by not running two sessions on one working copy.

---

### Bugs the testing found that reading would not have

These are the parts of the session worth the time:

1. **BACKROAD, the new arcade racer, was unplayable and the bot proved it.** The
   road slid sideways faster than the car could steer: a bot tracking the centre
   line *perfectly* went off in 3.4 seconds. The three sine amplitudes are now set
   from that constraint rather than by eye — the road can move at most 0.315 px
   sideways per px driven, which at the 210 px/s top speed is 66 px/s against the
   car's 147. A good line now survives 87–150 seconds and doing nothing ends the
   run in 7.5.

2. **The snow globe threw its entire snowfall out of the globe on the first
   shake.** Force was being applied without reference to mass; a flake masses
   about 0.0036, so a flat force of 0.0084 was an acceleration of over two units
   per step. Measured, not guessed: the average flake ended at y = −3316 in a
   128-unit world. Forces are scaled by mass now, and separately, anything found
   outside the glass is put back inside with its speed cut — because a thin ring
   of static wall segments can still be tunnelled through on one step. Verified
   with sixty hammer blows in a row: nothing ever leaves.

3. **The snow globe's falling snow stopped permanently if the tab was hidden.**
   The particle field drops its own loop when the tab goes away and does not
   restart it. Found by sampling the canvas rather than by looking at it — the
   pixel count was flatly zero. The main loop now starts it every frame.

4. **The About overlay was invisible in Windows 98 mode.** Its inner element was
   called `.card`, which the 98 mode also styles, so it rendered on light paper
   with light text. Caught in a screenshot, not in the code.

5. **The city map's park took its name from the district word list**, so the very
   first city generated had a park called North Gardens next to a district called
   North Gardens.

6. **The guestbook read path was broken by `stmt.all.apply(null, …)`**, which
   loses `this`. Writes worked; reads 500'd.

---

### Judgment calls, and where the brief and the code disagreed

The brief described several things as existing that did not. In each case the
honest move was to build the shared piece the brief assumed and wire the existing
toy into it, so the reuse it asked for is real rather than nominal:

- **Atmosphere had no filter engine.** The brief said to reuse "Atmosphere's
  existing filter engine (Nostalgia, Y2K Camera, etc.)" for the picture of the
  day. There wasn't one. `shared/lc-filters.js` is now the single definition of
  eight grades, and **both** toys call into it — verified by comparing the
  computed `filter` string on both pages, which is character-for-character
  identical. Atmosphere gained the control row it was assumed to have.

- **Atmosphere had two modes, not three.** "A fourth mode: Forested Americana"
  lands as the **third**. It is built and it works; it is just not the fourth.

- **The Konami code already had a payload.** The brief said it was an unspecified
  egg with nothing decided. It reshuffled the cabinet. Rather than delete that,
  the reshuffle moved to typing `shuffle` and the code now opens the About card.
  Nothing was lost and the brief's request was honoured.

- **The static channel has no text ticker.** The ticker audit covered the news
  crawl (42s → 96s), the good-news wire (50s → 112s) and the cryptid log (a report
  every 6–13s → 13–26s), all three now hover-paused. The static channel's only
  moving part is the vertical-hold roll, so that was slowed and hover-paused too,
  and its caption no longer fades out from under you while you are reading it.

- **The Windows 98 wallpaper feature did exist**, so "Set as wallpaper" writes
  into the preferences Display Properties already reads rather than getting the
  fallback download button. The photographer's name goes on the desktop with the
  photograph, not behind a toggle: it is the licence.

- **Six degrees is honest about being too easy.** The tag graph turned out dense —
  200 random pairs all connect, average 1.38 hops. Rather than fake longer chains
  and still call it shortest-path, there is a second button that deliberately
  takes the long way round, and the tally says which one you are looking at.

- **The README's toy table stopped being maintained at 29 drawers.** Updating 103
  rows was out of scope tonight, so the count at the top is now correct (132) and
  the table is labelled for what it is, rather than left silently wrong.

---

### Facts, and how they were checked

Three toys are built on real dates and one on real astronomy. None of them was
written from memory and left there.

- **Gaming, on this day** — 57 events. The rule is in a comment at the top of
  `data.js` and repeated in the footer: *an entry needs a firm day*. The 1983
  crash, the Commodore 64's launch and Spacewar! being finished at MIT are
  therefore **not in the list** rather than given a plausible-looking date. Dates
  are the original-territory release unless the entry says otherwise; where the
  better-known date belongs to another region, both are given. Caveats are
  printed, not hidden. A date with nothing on it says so and points at the
  nearest days that do.

- **Closer than you'd think** — 22 comparisons. Where a date is genuinely an
  estimate (a pyramid, an extinction, the first tree) it says so and the
  arithmetic is done on the estimate. Each card shows both gaps as numbers and
  the fact you would want to check.

- **What if it had gone differently** — forks from real, dated events, and says
  plainly that everything after the fork came off a list on the page.

- **The day/night line** — the terminator is computed, not fetched. Checked
  against known values: declination 23.44° at the June solstice and −23.43° at
  December (0.04° off), near zero at both equinoxes, and the sub-solar longitude
  at 12:00 UTC is −0.67°, which is exactly the +2.68-minute equation of time.
  London is lit at solstice midday and dark at midnight; Sydney is dark at 12:00
  UTC in June. Twelve real time-zone facts alongside it.

- **Semaphore is generated from the rule, not typed out.** The two-flag alphabet
  is seven "circles" — one flag holds a position while the other walks round the
  remaining eight — and that construction produces exactly 26 letters plus the
  two service signs, which is why J sits where it does rather than after I.
  Verified: 26 letters, none missing, no two sharing a position. A hand-typed
  table can contain a typo; this one cannot.

---

### Easter egg #12, which needed care rather than cleverness

Dating a ship's-log entry to **15 April** prints a plain grey note above it:
the Titanic foundered in the early hours of that morning in 1912 after striking
ice the previous night, and around 1,500 of the roughly 2,200 people aboard died.

Everything about how it is presented is deliberate. It carries **none** of the
page's brass, rope or aged paper — it is a different object on the page. The
foghorn does not play. And the invented log entry printed beneath it **drops its
ice, its gale and its strange-sighting line**, because a fictional log about
something following the ship, sitting directly under a note about 1,500 real
dead, would be exactly the joke the page has just said it is not going to make.

It was read back in full before shipping, as the brief asked.

---

### The seventeen eggs

All seventeen are built and all seventeen were triggered in a browser.

| # | Where | What |
|---|-------|------|
| — | the hub | Konami code opens the About card, crediting Maksim and Claude, linking the repo taken from this working copy's actual git remote |
| 1 | Infinite Archive | searching "the library of babel" stops the pretence and explains what the page really is |
| 2 | Paradox Machine | the same paradox twice overflows the stack, prints identical frames ending `at you`, and restarts itself |
| 3 | Story Chain | sentence 1,000 gets a "The End?" marker, drawn from the count so it is still there tomorrow, and the story carries on |
| 4 | Snow Globe | shake hard *and* keep shaking and somebody is standing in the drift for three seconds |
| 5 | Encode Anything | "easter egg" lays its own eighteen morse marks out as an egg |
| 6 | Closer Than You'd Think | twenty comparisons in, it compares your visit to the Anglo-Zanzibar War, computed live |
| 7 | Dream Decoder | "I dreamed about this website" gets the one reading it is qualified to give |
| 8 | Declassified Search | left untouched for 75 seconds it adds a line about you, and the Subject field becomes "whoever left this open" |
| 9 | What If History | "what if the internet was never invented" — no internet, no browser, no page, no machine to answer; it declines |
| 10 | Guestbook | signing as "Neal" gets the same hat-tip the hub's hidden keystroke gives |
| 11 | Pixel Canvas | pixels landing in the shape of a heart or a smiley set off a small celebration |
| 12 | Ship's Log | 15 April. See above. Not a joke. |
| 13 | Ancient Advisor | push the realm past 900 years and the archivists tell you that you have played too long |
| 14 | Snarky Weapon | ask it something genuinely large and it drops the voice for exactly one sincere line, then catches itself |
| 15 | City Builder | naming a street after a real Stockholm one gets a quiet note in the margin |
| + | Arcade / DESCENT | hold DOWN for two seconds — the one input that game cannot receive by accident — and the ship comes up with an energy shield that breaks and recharges |
| + | Snow Globe | turn the phone right over and hold it, and gravity inverts (the motion egg, reusing Invisible Ink's availability test) |

The triggers are discriminating, not just present: `lonely` fires the weapon's
sincere line and `abalone` does not; `no electricity` fires the what-if refusal
and `invented earlier` does not; `Drottninggatan` and `drottning gatan` both land
in Stockholm and `Cooper Street` does not.

---

### What was extracted rather than duplicated

Four shared modules, each lifted out of a toy that already had the code, with the
original refactored to call into it and re-verified afterwards:

- **`shared/lc-audio.js`** — Room Tone's Web Audio bench. Room Tone's six beds
  still produce distinct spectra after the move, checked on the analyser rather
  than by ear (library quiet with a 47 Hz hum, rain broadband at 1.5 kHz, the
  bridge on a 94 Hz drive).
- **`shared/lc-weather-fx.js`** — the almanac's twelve-effect particle field. The
  almanac still draws, checked by sampling its canvas.
- **`shared/lc-commons.js`** — the Commons rules (origin=\*, the thumb-host
  rewrite, no credit means no display). The San Francisco toy still fills a
  96-photograph pool with credits intact.
- **`shared/lc-filters.js`** — the eight photograph grades, new, because there was
  nothing to extract.
- **`shared/lc-id.js`** — the one anonymous visitor id, new.

**Nothing in this cabinet is sampled.** Every sound any of these pages makes is an
oscillator or a noise buffer generated in the browser at the moment you hear it.
There is still no audio file anywhere in this repository. The snow globe's carol
is Jingle Bells (1857) or Silent Night (1818), both long out of copyright,
arranged here for oscillators — verified on the analyser: the first note comes
out at 328 Hz, which is E4.

---

### The two dedicated-session items — now done

Both were named in the overnight brief as explicitly out of scope and were left
alone during it. They were built afterwards, in their own session, which is what
the brief asked for.

#### 1. Draggable icons, and folders to put them in

The desktop starts auto-arranged — the grid it always was. Drag an icon and the
surface goes into free mode with every icon pinned exactly where it already sat.
Drop a drawer on a folder to file it, drag it out of the open window to unfile
it, right-click anything for the same operations as a list. Positions, folders
and membership are remembered.

**The rule it is built under.** The widget rail next door is decoration, and it
is fair to make that pointer-only. These are the navigation, so: every icon
stays an `<a href>` a keyboard can tab to and open; every pointer gesture has an
equivalent in the context menu, which Shift+F10 and the menu key both open, the
arrows walk and Escape closes with focus returned; and **the Start menu goes on
listing all 132 drawers whatever has been done out here.** That last one is the
safety net — nothing a visitor does to this desktop can lose them a toy.
Verified after filing three away: still 132 of 132, all reachable.

**Five bugs, every one found by driving it rather than reading it.** This is the
part worth the time:

1. **Pointer capture on the wrong element.** Capture was taken on the icon
   *wrapper*, and capture retargets the click and dblclick the browser derives
   from the pointer events too — so every click arrived with the wrapper as its
   target, `closest('.w98-icon')` came back null, and **double-click to open
   silently stopped working**. `elementFromPoint` at the very same coordinates
   still correctly reported the icon, which is what made it puzzling for so
   long. Capture is on the icon now.

2. **The grid cell was guessed, not measured.** The grid is
   `repeat(auto-fill, minmax(88px,1fr))` with a row gap, so the real track is
   neither 88 wide nor 88 tall and both move with the window. Snapping to a
   hard-coded cell shifted **113 of 135 icons by up to 37px** at the instant of
   the first grab — which also moved the folder out from under the pointer that
   was about to drop something on it. The cell is measured now, and entering
   free mode pins at the exact measured offset rather than a snapped one, so it
   is a photograph of the grid: 0 icons move.

3. **`dragEnd` nulled `drag` before `dropTargetAt` read `drag.el`**, so every
   drop onto a folder threw and silently did nothing.

4. **`deskForget()` cleared the record but left the layout.** The free class
   makes every icon `position:absolute`, so forgetting without removing it
   dropped all 134 into a heap at 0,0.

5. **The new-folder rename ate the next gesture.**

**Restoring is self-healing**, which matters because a record written by an
older version can name a cell something else now claims, and a drawer added
since has no remembered place at all. Checked against a deliberately poisoned
record with six icons all claiming 0,0: 134 icons, 134 distinct cells, and the
healed record written back.

Display Properties gave up its own icon and its own right-click menu on the way
— it used to append the icon to the grid directly, which did not survive the
grid being rebuilt for a new folder, and its "Properties" menu opened alongside
the new one on the same click.

A folder cannot go inside a folder, and says so. One level is the point: a
desktop you can tidy, not a filesystem to get lost in.

#### 2. The icon style selector

Four styles — pixel, cartoon, flat, realistic — from a row at the top of the
Icons tab, remembered with the rest of the appearance.

**The mechanism was tested before it was designed.** Document CSS cannot reach
inside a `<use>` shadow tree, but *custom properties inherit into it* — a probe
confirmed it by painting one circle red on the defaults and green with the
variable set. So every outline in the sprite is
`stroke="var(--ic-ink, <its own colour>)"` with a matching `--ic-sw`, and with
no style chosen **nothing changes at all**: the fallbacks are the values that
were already there.

Only outlines are parameterised, by a mechanical rule. A stroke on a shape with
a real fill is a contour — 68 of those, and they are what a style thickens,
lightens or removes. A stroke on `fill="none"` is the drawing itself, and a
stroke with no fill attribute is a detail line. Those 34 keep their own colour
and weight in every style, **which is why the flat set still has all its detail
instead of going blank.**

Checked side by side at 40px and live at 32px: the four are plainly different,
and the style reaches the icons inside an open folder window too. The realistic
bevel is a per-icon SVG filter, so anybody who has asked for reduced motion gets
a plain drop shadow instead.

---

## Summary — batch 15, the arcade and the song guesser

**Two things built: a thirteen-game arcade cabinet, and the Europop guesser widened into
Needle Drop. The cabinet went from 109 drawers to 110** — the guesser was expanded in place
rather than duplicated, as asked, which meant renaming it.

**Nothing else was touched.** No change to the hub shell beyond one card, one renamed card and
two icon mappings. `server.js` gained no new route; the existing `/api/preview` got stricter.

**Not deployed.** The commits are local.

### Look at these first

1. **The song pool is 164 tracks, not 500, and that is the honest number.** Every candidate was
   put through the same `/api/preview` call the game itself uses, and only the ones Deezer
   actually returned — right artist, playable preview, not a karaoke or instrumental take — were
   kept. 177 candidates went in and 129 came out. Nearly every Russian and Ukrainian miss was my
   own fault: I had written the titles in transliteration and **Deezer indexes them in Cyrillic**,
   so those were re-queried in native script and 37 more came back. The brief said accuracy over
   count and to build incrementally, so the remaining gap to 500 is left as curation rather than
   filled with unchecked guesses. Per scene: Europop 56, Italy 43, Russia 35, Ukraine 26,
   **Georgia 4**.

2. **Georgian is the thin one and needs someone who actually knows the scene.** Four tracks
   survived, all Eurovision entries, because that is the Georgian pop I could name and verify.
   Most of what I tried — Mgzavrebi, The Shin, Young Georgian Lolitaz, several Eurovision
   entrants — is simply not on Deezer with a preview. This is the one part of the brief I could
   not deliver properly and it wants a native speaker with a list, not more guessing from me.

3. **Playing the platformer found four real bugs that were invisible from looking at it.** This is
   the part of the session worth reading:
   - `boxHits` sampled only **one** bottom corner, so the moment the player's right edge crossed a
     gap the whole body counted as unsupported. You fell a tile early at every ledge and could
     never jump *from* an edge, because `p.on` was already false.
   - Walkers in four levels sat one row above the floor. With nothing under them they flipped
     direction every frame and hovered on the spot instead of patrolling.
   - The jump rose 35.6 px while the level art assumed three-tile steps of 48 px. **Level 6 was not
     hard, it was impossible.** The jump is 250 now, and there is an audit that refuses a step it
     cannot clear.
   - A platform on row 9 leaves 32 px of headroom over a 50 px jump, so jumping *under* one
     cancelled the jump mid-rise and dropped you into the pit you were trying to clear. That is
     why four levels looked fine and were unplayable. Levels with floor hazards no longer carry
     low platforms.

   All ten levels now pass a structural audit — reachability, spike runs, gap widths, walkers
   grounded, headroom over every hazard — and a physics-aware bot clears **10/10 on the first
   attempt with zero deaths**.

4. **The retro look is enforced by the architecture, not by discipline.** Every game draws into one
   320x240 buffer which is then scaled by a whole number with smoothing off, so nothing inside the
   cabinet can be smooth even by accident. Sixteen colours, a 5x7 bitmap font set by hand — no
   webfont is blocky enough at this size — and the CRT treatment applied once at the shell so each
   game inherits it. The two the brief warned would drift, the platformer and billiards, are drawn
   with the same primitives as everything else.

5. **PENTAFALL is meaningfully different, not superficially.** Twelve pentominoes, five cells each,
   a twelve-wide well, and a colour mapping that avoids the familiar convention entirely. Five-cell
   pieces change how it plays as well as how it looks: the well is wider because pentominoes do not
   pack, and a clear is worth more because it is harder to arrange.

6. **`/api/preview` was handing back karaoke and instrumental takes.** Searching "Boten Anna
   Basshunter" returned an instrumental — a clip that plays and cannot be named, which reads as a
   broken game rather than a hard round. It now rejects those outright and prefers the exact title
   by the right artist over a remix or alternate version.

### What was verified, and how

- **Every one of the thirteen games was driven, not just loaded.** All thirteen survive 600 frames
  of random input with no thrown errors, and each was opened from the menu and played with real key
  presses. High scores persist across a reload (checked by writing one and reloading).
- **The falling-block game was checked against the thing it must not be.** Screenshotted mid-game:
  the pieces on the field are visibly five-cell — a plus-shaped X, a W, a P — in oranges, cyans and
  greens, on a twelve-wide well.
- **Ten platformer levels, start to finish**, as described above. The brief asked for eight.
- **The clip really does start at one second.** Measured on the audio element, not the UI: with the
  window at 2 s the clip stopped at `currentTime` 2.02 and paused itself; the source is a real
  30-second Deezer preview.
- **Pause and volume are real.** Pause froze `currentTime` at 0.73 across a 700 ms wait and resumed
  to 1.35; the volume slider set `audio.volume` to 0.22.
- **The year filter really changes the pool**: 164 / 48 / 34 / 29 / 53 across the four ranges, and
  the track actually drawn was inside the selected range every time. The scene filter gives 43
  Italian tracks, all of them Italian.
- All 110 drawers return 200, the hub shows 110 cards, both new toys appear as cards and as desktop
  icons with hand-picked icons, and no page throws.

### What was decided without asking

- **The guesser was renamed.** Its pool is no longer Europop, so `/europop-guesser/` became
  `/needle-drop/` and the card moved with it. The old path now 404s. The brief asked for an
  original name and identity for this mechanic, and leaving a directory called "europop" on a
  five-country pool would have been wrong in both directions.
- **Verification for the arcade drove the real game loop**, rather than trying to be a human at the
  keyboard for thirteen games. Where it mattered — that the clip starts at one second, that the
  platformer is completable, that pause works — real input was used and is reported as such.
- **A `_fit` and a small state object are exposed on `window`** in the arcade and the guesser, so
  the scaling and the audio window can be checked from outside. Harmless, and it is what made the
  audio claim checkable rather than asserted.

### Still to do

- **The song pool.** 164 verified of a target of 500. The method is repeatable: add candidates to
  the list, run them through `/api/preview`, keep what answers. Georgian needs a person, not a
  script.

---

## Summary — batch 14

**11 toys built, verified in a real browser, and added to the hub.** The cabinet went from 97 drawers
to 108. Everything on the list got built, in the order given, and nothing was left half-finished.

**Nothing from the blocked list was touched** — no globe/planet editor, no device-detected retro
theming, no message in a bottle, no who-else-is-here, no outpost builder, no Room Tone.

**Not deployed.** The commits are on `main`; Railway still needs its manual trigger.

### Look at these first

1. **The Europop guesser needed an API decision, and the brief was right to insist on checking.**
   Both providers were verified against live behaviour rather than memory:

   - **Spotify: rejected.** Its `preview_url` is now marked **deprecated and nullable** in the
     current reference, needs OAuth, and its terms state that "Audio Preview Clips may not be
     offered as a standalone service or product" — which is close to describing this toy.
   - **Deezer: chosen.** Its public search needs **no key and no OAuth**, and returns a `preview`
     field: a real MP3 on Deezer's CDN, measured at 479,827 bytes / 128 kbps = **exactly 30.0
     seconds**.
   - `api.deezer.com` sends **no** `Access-Control-Allow-Origin`. I confirmed that by calling it
     from a real browser rather than by reading headers — the headers are misleading, carrying
     `allow-methods` and `allow-credentials` but not the one that matters. Hence the metadata relay
     at `/api/preview`.
   - The **preview URL itself does** send `Access-Control-Allow-Origin: *`, so the page plays the
     file straight from Deezer. **No audio is proxied, cached or re-served here**, which is both the
     instruction and what Deezer's terms require. The URLs are signed and expire, so a fresh one is
     fetched each round rather than any being kept.

   All **53** curated tracks were resolved against the live relay: 53 of 53 return a playable
   preview. No key is needed, so there is no needs-a-key state to show.

2. **The museum's twelve buttons were verified one at a time, not as a group.** The note when it was
   expanded was that they must not be one joke repeated, so a shared "did anything change" check
   would have been the wrong test — it passes trivially. Each exhibit got its own assertion: it
   dodges the pointer, counts its own uselessness, springs, rotates the page hue, synthesises a note
   that is never the same twice running, spawns working copies, falls through its own floor,
   escalates its refusals, fills over three seconds, turns its case upside down, shatters into
   falling fragments that reassemble, and — exactly once — really does copy the time to the
   clipboard. Fifteen assertions, all true.

3. **One real arithmetic error, caught by checking rather than by re-reading.** The estimator's
   rice-on-a-chessboard sum was out by a factor of a thousand: grams to tonnes is 1e6, not 1e3.
   Worse, its note claimed the last square was "five hundred thousand years" of world rice
   production when the correct figure is about **five centuries**. Both fixed, and the note now says
   so out loud. This is precisely what the never-fabricate-a-statistic rule exists for, and I nearly
   shipped past it.

4. **The decade matcher was rebalanced after simulation.** On the first pass, over 20,000 random
   answer sets, the 2000s won only **3.9%** of the time while the 1970s took **27%** — one decade
   nearly unreachable, another dominant. After reweighting, over 40,000 sets, the spread runs
   **7.8% to 18.6%** and all seven decades are reachable.

### What was decided without asking

- **The estimator tags every figure `m` or `a`** — measured or assumed. A silly premise is stated as
  a premise and never dressed as a known quantity, and the assumptions are editable so you can
  disagree and watch the answer move.
- **The decade matcher never touches song titles.** It matches on production and arrangement — how
  it was recorded, what the low end is doing, where the voice sits — because those are what date a
  record, and because that was the explicit note.
- **The banknote portrait is nobody.** A coin-style profile assembled from landmarks in a unit space
  with seeded variation. The first attempt collapsed into a purple blob and was redrawn.
- **The pet rock's photograph never leaves the tab.** That toy has no server side at all, and the
  page says so.
- **The redundancy department separates invention from fact.** The memoranda are made up; the
  appendix of genuinely doubled phrases beneath them — PIN number, La Brea Tar Pits, chai tea, RSVP
  — is real, and each says which word got repeated and where it was hiding.

### The eleven

| Toy | What it is |
|---|---|
| `/groupchat-namer/` | Four tones that genuinely change the output, never repeating twice running |
| `/redundancy-dept/` | Invented memoranda, with eighteen real doubled phrases underneath |
| `/absurd-estimator/` | Daft questions, real arithmetic, every figure tagged measured or assumed |
| `/decade-matcher/` | Eight questions on production and arrangement, seven reachable decades |
| `/vintage-stamp/` | Canvas engraving, perforated and postmarked, deterministic from the subject |
| `/design-currency/` | Real guilloché — parametric curves — and a portrait of nobody |
| `/paint-namer/` | The right name is derived from the swatch; the decoys belong to other colours |
| `/pet-rock/` | Six drawn rocks or your own photo, and a certificate that never shifts under you |
| `/useless-buttons/` | Twelve exhibits, twelve mechanics, one of which is not useless |
| `/reverse-alarm/` | Counts backwards from where you must be to the last moment you can get up |
| `/europop-guesser/` | Real 30-second Deezer previews, four answers, five era filters |

### How it was checked

Every toy was driven in a real headless browser, not loaded and eyeballed. Each has a scripted probe
exercising its actual mechanic: the swatch names are stable and hue-derived, the certificate is
identical for the same rock and name, the alarm's chain always ascends and 09:00 less 87 minutes
really is 07:33, the era pools are disjoint and sum to the whole, and the Europop audio element is
confirmed playing a `dzcdn.net` file of duration 30.0 with `currentTime` past zero. A final sweep
loaded all 108 toys plus the hub: **no JavaScript errors on any page**. Every toy checked at 390px
for horizontal overflow.

---

## Summary — batch 12, the cleanup batch

**Six toys built, verified in a real browser, and added to the hub. The cabinet went from 91
drawers to 97.** Every item on the list is resolved: the two new toys are built, and all four
previously-blocked items — the outpost builder, the shared-storage pair, Room Tone, and the
nostalgia sound that folded into it — are now done rather than deferred.

**One item could not be done as written, because its premise is wrong: Movie night was never
built.** Details below; it is the only thing on this list needing your decision.

**Server changes.** One new module (`store.js`), three new routes, one new field on `/api/keys`,
and a coarse-geolocation helper shared with `/api/where`. `package.json` now asks for Node 24+.

**Not deployed, but infrastructure did change:** a Railway volume now exists. See item 6.

### Look at these first

1. **Movie night does not exist, and never did.** Item 6 said it was built and waiting on a key.
   It is not built. There is no `/movie-night/` directory, no route, no markup, and nothing in the
   git history that was ever added and later removed — I checked the working tree, every commit on
   every branch, and every deleted path. The only traces are one line in `/api/keys` reporting
   `tmdb`, and a line in the README that already said **"Still to build: Movie night"**. So
   setting `TMDB_API_KEY` today would change nothing you could see. The key plumbing itself does
   work — I ran the server with and without the variable and `/api/keys` correctly reports
   `tmdb:false` then `tmdb:true`. **I did not build the toy**: item 6 asked me to confirm a
   needs-a-key state and leave a note, not to design a toy from scratch, and there is no spec for
   what Movie night should actually do. Tell me what it is and it is a short job. TMDB is still a
   free signup, same as Groq was. I corrected the README so it no longer implies the key gates
   anything.

2. **The bottle is a public, unmoderated text box, and you should decide if you want that.**
   `/message-in-a-bottle/` stores whatever a stranger types and shows it to other strangers. I put
   real guards on it — 280 characters, control characters stripped, **any link refused outright**
   (a link is what spam actually wants), and its own rate limiter at six casts an hour per address
   rather than sharing the generate one. But there is no moderator and no way to attribute a note
   to anyone, which is the point of the toy and also its risk. The page says so in those words.
   **If you would rather it not be open to the public, the honest options are a holding queue you
   approve, or not shipping this one.** Everything else in the batch is safe to deploy as is.

3. **Room Tone's scenes were nearly identical, and measuring them is what caught it.** The brief
   said to confirm the scenes are audibly distinct rather than one pad with six labels. I cannot
   listen, so I profiled the real audio output through an AnalyserNode instead. Three pairs came
   back almost the same sound: library and underwater sat **0.008 apart** in normalised band
   profile, campfire and train 0.008, rain and bridge 0.018. The library was also *louder than the
   train*, which is not what a late library is. I regraphed four of the six. The closest pair is
   now 0.038 — five times the old minimum — and those two still differ 1.6x in loudness and 2.2x
   in event density. **This is measurement, not listening: please put headphones on and tell me if
   your ears agree with the numbers.**

4. **Nothing in the starship chart is anybody's actual silhouette, by construction.** The brief was
   right that stripping detail off a Star Destroyer still leaves a Star Destroyer, so I did not try
   to draw ships at all. There are six abstract hull forms and **the only input to which one a ship
   gets is how many metres long it is**. That makes it structurally impossible for a shape to encode
   a specific design: the Executor comes out a banded slab, an Imperial Star Destroyer a symmetric
   spindle, and both Death Stars plain ellipses rather than spheres with a dish. I looked at every
   size bracket on screen to confirm none of them reads as a real design. The page also says the
   drawn heights are invented, because they are — only length is data.

5. **Five ship lengths were wrong and five ships were dropped.** I checked the marquee figures
   rather than trusting my memory, and it was worth doing: the EVE Erebus is **14,764 m, not
   14,000**; the Avatar titan's length I could not source at all, so it is gone and two titans whose
   lengths are published took its place. Babylon 5's production figures disagree with each other, so
   it is now marked an estimate at 8,046.7 m, and Galactica has two competing official numbers so it
   is an estimate too. Five more ships — the Bengal carrier, Event Horizon, Icarus II, the Axiom and
   Interstellar's Endurance — **were dropped rather than given a plausible-looking number**, because
   I could not source them. Every remaining row is coloured by whether it is a published figure or a
   fan estimate.

6. **A Railway volume now exists, and this is the one thing I changed outside the repo.**
   `railway volume list` was empty, as the brief anticipated, so I created `hub-volume`, 5 GB,
   attached to the `hub` service at `/data`, status Ready. **`package.json` now requires Node 24+**,
   because that is what `node:sqlite` needs without a flag — worth knowing before the next deploy,
   since it is the only breaking constraint added this batch. No dependency was added: SQLite is
   built into Node now.

7. **The production database starts empty.** Everything I wrote while testing is in `./.data`,
   which is gitignored and local. The first person to load the bottle toy in production will
   correctly see empty water.

### What was verified, and how

Every toy was opened in a real browser and driven, not checked for a 200 and left. All 97 drawers
return 200, the six new ones carry the standard back-to-the-cabinet control, appear as both a card
and a desktop icon with a hand-picked icon rather than a tag fallback, are findable in the Start
menu, and produce no console or page errors. None overflows horizontally at 390 px.

Beyond that, the specific things the brief asked to be checked:

- **The wiki at full scale, not on a test set.** All 500 entries load. Search runs over name,
  source and description together — "seabed" finds two entries by description alone; "gun" plus the
  weapons chip plus a source filter narrows correctly to zero. Ten category chips, 131 sources,
  four sort orders. A full 500-row render measures **17 ms**; rows are drawn 120 at a time so the
  first paint stays quick. The random draw pages forward far enough to actually show you what it
  picked, which it did on six consecutive tries.
- **The starship chart's shapes and its zoom.** Screenshotted at four brackets and looked at.
  Real mouse drag, real wheel zoom and a real click all work; at fit-all, with all 68 loaded, a
  frame costs **0.16 ms**.
- **The Mercury → Neptune progression, not just one planet.** I played all eight through to their
  targets with real click events on the canvas. Each unlocked the next, the final card correctly
  says there is nothing further out, and the rail ends with all eight marked done. The
  collector-to-reactor crossover falls at Mars, which is exactly where the arithmetic says it
  should: a collector is 10 ore for 3x solar and a reactor 32 for a flat 9, so they cross at
  solar 0.937, and Mars is 0.431.
- **That the shared data actually survives a restart.** This is the whole point of the volume, so
  I tested it properly rather than assuming — and my first attempt was invalid, because two node
  processes were bound to the port and the kill failed. Second attempt: killed every listener,
  **confirmed the port had gone dead** (curl got no answer at all), started a new process with a
  new PID, and all three bottles came back with their found count intact, along with both places
  and all three visitors.
- **That losing the database does not take the site down.** Ran the server from a read-only
  directory with `DATA_DIR` pointing somewhere unwritable. `/api/keys` reports `store:false`, both
  routes answer `no_store`, both pages show an honest panel with writing switched off, and the hub
  still serves 200.
- **Room Tone's six scenes.** Profiled as described in item 3, plus a leak found while testing and
  fixed: tearing down a scene disconnected its output but left its oscillators and looping buffers
  running for the life of the page. Instrumented start/stop counts across twelve scene switches now
  come back **82 started, 82 stopped, none left live**, and the time-domain peak after stopping is
  exactly zero.

### What was decided without asking

- **The starship comparison is its own toy, not a category in Higher or Lower.** The brief allowed
  either. It needs zoom, pan, a log index rail and a projection, none of which fits a two-card
  guessing game.
- **Visitors are counted by a random token their own browser invents**, not by anything derived
  from the address. The brief said to derive coarse location and discard the IP, which leaves no
  way to tell a reload from a new person; a browser-generated id solves that without the server
  ever holding an identifier that means anything. It is disclosed on the page.
- **Stored coordinates are rounded to one decimal place**, about eleven kilometres — deliberately
  blunter than the city they came from. The address is used once, in memory, to ask a geocoder for
  a city and is then dropped: it is never a column and never a log line. Rows are deleted after
  24 hours.
- **The outpost builder's difficulty curve is real physics.** Sunlight per planet is 1/r² with r in
  AU, so Mercury gets 6.68x Earth and Neptune 0.00111x. That single real number is what makes the
  outer half of the solar system need reactors. Ore, costs and targets are balance, and the page
  says which is which.
- **The world map came from the ISS tracker.** `/who-else-is-here/` needed coastlines and that toy
  has carried an equirectangular outline since it was built, on the same 720x360 projection. I
  copied it to `public/shared/world-land.js` rather than editing a working toy to share it out —
  **so that 35 kB outline now exists twice.** Worth collapsing if either page is touched again.

### Still not built

Nothing from this list, and nothing outside it. The full custom globe/planet editor and
device-detected retro hub theming remain unbuilt from earlier batches, as before.

---

## Summary — batch 8, the ten that were still undone

**Ten toys built, verified in a real browser, and added to the hub. The cabinet went from 81 drawers
to 91.** Everything on the list got built, in the order given, and nothing was left half-finished.
One additive server route (`/api/photos`) and one added field on `/api/keys`; no other change to
`server.js`, and no structural change to the hub shell beyond ten cards and ten desktop-icon
mappings.

**Not built, as instructed:** the full custom globe/planet editor, device-detected retro hub
theming, message in a bottle, who else is here, the pixel outpost builder, and Room Tone. Nothing
outside the list was built.

**Not deployed.** The commits are local. Deploying is a manual step whenever you want it.

### Look at these first

1. **The premise of the flag toy was out of date and I changed the source.** REST Countries'
   keyless API is gone — v1 through v4 are deprecated and v5 wants a signed-up key. Rather than
   ship a toy that needs a key for country names, I took the data from
   [mledoze/countries](https://github.com/mledoze/countries), which is the open dataset REST
   Countries is *built from*, ODbL, and baked the 193 UN member states into the page. It is 13 kB,
   it is attributed on the page, and the toy now makes no network call for its data at all. Flags
   come from flagcdn.com at runtime. **If you would rather pay for or sign up to the real API, that
   is a one-file change and your call, not mine.**

2. **`/cipher/` is the one with real engineering in it, and it is worth ten minutes.** Ondaric is a
   constructed language built backwards from one requirement: whatever goes in must come out again,
   or your friend cannot read it. Six rules, all reversible. It round-trips **4,000 randomly
   generated sentences with zero losses**, and getting there took five separate bug fixes that a
   fuzzer found and I would not have: a non-bijective letter table, prepositions binding across
   numbers, accented letters being silently dropped, a substituted word colliding with a grammar
   particle (under one passphrase "you" came out as the word for a comma), and a two-piece parse
   that could not tell an article in front from a postposition behind. The passphrase reshuffles
   the particles as well as the letters, so a wrong key garbles the grammar too. **It is a party
   trick, not cryptography, and the page says so in those words.**

3. **`/atmosphere/` is built and wired but its live API call is unverified, because there is no
   Pexels key.** Everything else about it is verified: the needs-a-key panel, the route's allowlist,
   the 400 on an unknown mode, and — by stubbing the route with the exact response shape — image
   loading, the fade, attribution rendering with both links, caption stability, swipe and arrows.
   Set `PEXELS_API_KEY` and it should work; the one thing nobody has watched is Pexels' own
   response. **Stubbing it also caught a genuine bug that would have shipped:** a photograph whose
   file failed to load made the page skip to the next one, which at the end of the deck fetched
   more, which also failed — an unbounded loop that made **95 API calls in four seconds**. Both ends
   are bounded now, and the same guard went into the Zone gallery.

4. **The README's toy table has drifted badly and I did not fix it.** It still lists 29 toys and
   describes the cabinet as it was several batches ago. I updated only the parts this session
   touched — the routes list and the keys paragraph. Rewriting 91 rows is a job in its own right
   and it needs someone who knows which of the older entries are still accurate.

5. **The Zone gallery served a war grave, and I have fixed it.** The very first plate it showed in
   production was a real WWII mass grave in Ukraine, with an invented eerie survey note printed
   underneath — because a great many war memorials are also Soviet-era concrete and the search could
   not tell the difference. There is now a name-based exclusion list running in English, Ukrainian
   and Russian (memorial, grave, cemetery, victims, могила, мемориал, братськ and the rest), the
   search term that reached hardest for monuments has been dropped, and the footer states the rule.
   Verified over ten consecutive plates. It will sometimes skip an innocent building with an unlucky
   name, which is the correct direction to be wrong in. **If you find any other category this ought
   to be refusing, the list is one array at the top of the file.**

6. **Another session was committing to `main` while I worked.** Its last commit was 11:55 and the
   tree was clean when I started, so nothing collided, but two agents are writing to
   `public/index.html`. Worth settling before the next batch.

### What was verified, and how

Every toy was opened in a real browser and driven, not just checked for a 200. All ten return 200,
carry the standard back-to-the-cabinet control, appear as both a card and a desktop icon with a
hand-picked icon rather than a tag fallback, and are findable in the Start menu search. No page
threw a script error.

Specifically beyond that: the flag desk's distractors come from the same subregion as the answer;
the fallacy quiz marks by value rather than by re-reading its own rendered labels; the dilemma
tally moves only when you answer; the five verse registers have five different line counts and
three different rhyme schemes; the dungeon room is stable across a reload and identical for
everyone today; changing the charge on the flag changes exactly one line of the country dossier and
nothing else; masterpiece roulette loads real images with CC0 attribution and a link to the record.

---


## Summary — batches 9, 10 and 11, plus the easter-egg pass

**16 toys built, verified in a real browser, and added to the hub. The cabinet went from 65 drawers
to 81.** Everything on the new-toy list got built, in the order given. Nothing was left half-finished.
Then the easter-egg pass: **19 eggs, all of them landed, none skipped for a missing target toy.**

**Not built, as instructed:** message in a bottle and who else is here (both need genuine cross-visitor
shared storage, and the second one touches approximate visitor location — your decision, not mine),
the pixel outpost builder (still awaiting the go/no-go), and Room Tone. Nothing outside the list was
built.

**Not deployed.** Railway does not deploy on push, so nothing here is live. The commits are on `main`
and pushed to GitHub; triggering the deploy is one manual step whenever you want it.

### Look at these first

1. **The ant farm had five separate faults and I nearly shipped it broken.** It looked right the whole
   time — ants moving, sand shifting — while the grain counter sat frozen and the tank hollowed anyway.
   The real one: an ant hauling a load upward would accept an opening *below* it as the highest available
   whenever nothing above was open, step into it, and then be offered the cell it had just left. Fourteen
   of eighteen ants spent the run oscillating between two cells one row short of the surface, full, never
   dumping. I found it by printing the terrain around a stuck ant, which is what I should have done three
   fixes earlier instead of guessing. It now runs about half an hour before the tank is hollow, with real
   shafts, galleries, chambers and spoil heaps. **Worth leaving in a tab for ten minutes to see if you
   agree it earns the slot.**

2. **`/reverse-turing/` has an honest limitation you may want to overrule.** The human half of a
   human-or-machine test has to be genuinely human, so it is fourteen sentences from books out of
   copyright, attributed on the reveal. That means the human side skews old. I dealt with it by telling
   the model to write in the same period, so it is not a test of spotting a modern idiom — but a few of
   the human lines are famous enough to simply recognise, and the page says outright that recognising
   them counts. If you would rather have modern human text, that needs a source you are happy with and
   it is your call, not mine.

3. **`/slang-glossary/` is the one to fact-check.** Twenty terms, real definitions, and I put real effort
   into the etymologies — *ate*, *it's giving*, *no cap* and *bussin'* all come out of Black American and
   in two cases Black queer ballroom speech decades before the feeds, and the notes say so rather than
   letting TikTok take the credit. The entry I am least certain about is **six seven**: I am confident it
   spread through schools in 2025 from a rap song and that its meaninglessness is the point, so I wrote
   only that and deliberately left out the dictionary-word-of-the-year claim I could not stand behind.

4. **`server.js` gained one prompt.** A `reverse-turing` entry in the `PROMPTS` table, in the same shape
   as the others. Nothing else in the file was touched by me. The route was tested against the real Groq
   endpoint and comes back with usable period prose.

5. **Another Claude session was working in this repository at the same time, all night.** That is how
   `/api/where`, `/api/generate`, `public/shared/lc-generate.js`, `/character-match/` and
   `/what-beats-this/` got there — they are not mine. Earlier in the evening one of its commits swept up
   uncommitted work of mine and shipped it under an unrelated message, so from that point on I committed
   after every toy. Worth knowing when you read the history: **two authors, one branch, interleaved.**

6. **One pre-existing bug fixed, one left alone.** Fixed: the fortune cookie put a horizontal scrollbar
   on narrow screens, because the cracked halves fly 172px either side of the stage. Left alone:
   `/retro-os/` overflows horizontally below about 470px, which is inherent to it being a fixed-size
   drawing of a desktop, and changing that is a design decision rather than a fix.

### What was decided without asking

- **"Animal battles" is `/what-beats-this/`.** There is no toy by that name; the X-versus-Y battler is
  the only thing the bees egg could go on, so that is where it went.
- **Higher or lower is one toy with three categories**, as asked, and a fourth is a data addition to
  `data.js` and nothing else — the switcher, the rounds and the scoring all read from whatever is in
  that array. It also refuses to offer any pair closer than six per cent, because that is a coin toss
  rather than a question.
- **The typing fortune's numbers are real and its reading is a joke**, and the page says which is which.
  Keystroke dynamics is a real field for identifying people; it has never shown anything about character.
- **The Chladni plate says its frequencies are a stand-in.** The nodal shapes are the genuine article
  from the standard square-plate model; the hertz figures are scaled from the mode numbers so the slider
  covers an audible range, and a real plate would resonate somewhere else entirely. The page says so.

### The easter eggs, all nineteen

Every target toy existed, so nothing was skipped for a missing one.

| Where | What |
|---|---|
| Hub cards | Drag the dog-eared corner and the card peels back to a handwritten note, one of thirty-six, stable per drawer |
| Hub | Typing `neal` tips its hat to neal.fun |
| Hub | The Konami code really reshuffles the cabinet — DOM order, not an animation |
| Hub | The "still being built" ghost card answers back, and eventually admits there is no drawer 82 |
| Hub, Windows 98 | An icon that is not a drawer, absent from the Start menu, that blue-screens |
| Weather almanac | Visit all twenty-three places in one sitting and it admits to a twenty-fourth: room temperature, no wind, no exits, filed by nobody |
| Weather almanac | About one report in four hundred comes back past the end of the dial |
| Radio hub | Hold the needle on the exact midpoint of a wide gap for a second and a half: an unlisted carrier reading five-digit groups, with a tone per group |
| Gratitude jar | Shake hard enough for long enough and the lid gives; the notes erupt, land, and are tipped back in. Nothing is lost |
| Loot terminal | The same item name twice running is appraised as **Impossible**, valuation left blank |
| Bureaucracy | Three submissions running with nothing left blank: "Congratulations, you are free." The form stops growing |
| Civilizations | One more rung past the sources, unlabelled and unnumbered, lit only once it is actually on screen |
| Apocalypse quiz | The worst answer to every question is reclassified from an assessment to a statement of intent |
| What beats this | A thousand bees against a thousand bees, answered without calling the model |
| Retro OS | Right-click the desktop: everything greyed out except the one item that sounds dangerous, which is the most inert of the lot |
| Race your ghost | Beating your own ghost by forty wpm at ninety per cent accuracy gets a question, not an accusation |
| Fortune cookie | The hundredth cookie of a session is not drawn from the pile. Fires once, at exactly one hundred |
| ISS tracker | The station's real reported position against Stockholm by great-circle distance: "over Stockholm right now" inside 600 km |
| Inventions | The newest thing on the timeline opens the drawer after the last one: eight things we have not invented, each marked with how far along it really is |

### How it was checked

Every page was driven in a real headless Chromium, not just loaded: each toy has a scripted probe that
exercises its actual mechanic — the ants dig, the sand settles on the nodal lines, the theremin's pitch
tracks the pointer logarithmically, the sequencer's balls strike pegs, the oracle never answers, the
register rejects a year it does not cover, the ink is opaque before the pointer goes down and opaque
again after. A final sweep loaded all 81 toys plus the hub and reported **no JavaScript errors on any
page**. Every toy was also checked at 390px for horizontal overflow.

---

## Summary — the previous run (63 drawers)


**34 toys built, verified in a browser, and added to the hub.** The cabinet went from 29 drawers to 63.
Everything on the list got built; nothing was left half-finished, and nothing hit a blocker that stopped it.
Each one has its own section below with what it does, what I had to decide, and how it was checked.

**Not started, as instructed:** the pixel outpost builder (waiting on your scoped-down version — not begun,
not even the small one), Room Tone, and the nostalgia-sound idea. Nothing outside the list was built.

### Look at these first

1. **`/boring-day/` was renamed and reframed.** It could not honestly be called "the most boring day in
   history" — it measures how much Wikipedia's editors wrote about a date, not how much happened on it. It
   is now **The Quietest Day**, and the note under the grid says so in as many words, using 1 January (the
   darkest square of the year) as evidence of the encyclopedia's own bias. It also took three attempts to
   build: Wikimedia rate-limits at roughly 25 requests in a short window, then returns 429 with
   `retry-after: 7`, so any live scan broke a third of the way through. The counts for all 366 days are now
   snapshotted (paced against the limiter over about an hour) and stored as a 4 kB file beside the page; only
   the date you click goes to the network. **The snapshot date is stated on the page** — it will want
   refreshing eventually, and re-running is just a matter of re-pacing the same script.

2. **`/doppelganger/` deliberately does not recognise faces.** A real doppelganger finder needs a model this
   project cannot add, and would mean sending someone's photograph somewhere. So it matches on *light* — a
   4×4 brightness grid plus tone, contrast and warmth — against 220 public-domain paintings, and it says
   that plainly under the result rather than implying it saw your face. The photo genuinely never leaves the
   tab. If you would rather it did real face matching, that is a different toy and needs a dependency
   decision from you.

3. **Three routes were added to `server.js`.** `/api/onthisday` (one date, reduced and cached a day, with a
   backoff retry on 429), `/api/art` (the Art Institute's IIIF server sends
   `cross-origin-resource-policy: same-origin`, so their images **cannot** be displayed from another origin
   at all without a relay — it accepts only their host, only a UUID of the shape they issue, and only the
   three widths they keep derivatives for), and `/api/cables` from earlier in the run. All three follow the
   existing fixed-allowlist pattern; none takes a URL from the query string.

4. **I retagged 11 cards.** Everything built tonight had gone in as `toy`, which made the filter useless —
   a third of the cabinet under one chip. They are now spread across the existing taxonomy (`real data` 15,
   `generator` 25, `game` 10, `scroll story` 3, `reference` 5, `reflection` 3, `toy` 2). Filtering was
   re-checked with all 63 cards: every chip's count matches the cards it shows, and the ghost drawer still
   hides when a filter is on. If you disagree with any individual tag, it is one word per card.

5. **Three facts in `/ocean-depths/` were wrong on the first pass and were corrected against sources.** The
   Challenger Deep depth is now attributed to the 2021 survey (10,935 ± 6 m) with the disagreeing surveys
   listed rather than one figure asserted as *the* answer; "more people have walked on the Moon" was cut
   because it stopped being true in 2019, replaced with the real counts; and Ahmed Gabr's ascent is "close
   to fourteen hours", not fifteen. The pressure gauge is labelled as calculated from depth rather than
   measured, and the temperature line as a typical profile rather than a reading.

6. **`/static-channel/` streams other people's video.** Films come straight from archive.org's Prelinger
   collection — nothing is re-hosted here — and every channel links back to its item page. Worth knowing:
   these are historical documents and some carry the attitudes of the year they were made, which the page
   says outright.

### Data files added to the repo

| file | size | what it is |
|---|---|---|
| `public/boring-day/counts.json` | 4 kB | events per date, snapshotted from Wikimedia on 9 Sep 2026 |
| `public/doppelganger/portraits.json` | 73 kB | 220 public-domain paintings, measured here, with AIC ids |
| `public/constellation/stars.json` | 146 kB | 1,637 stars to mag 5 from the HYG database |

No npm dependencies were added. The only CDN scripts remain Three.js (ISS) and Matter.js (the jar), both
already approved. No API keys were needed by anything built tonight.

### Standing note

Deploys still need the Railway source reconnected by hand — the GitHub App has no access to this repo, so
pushes to `main` do not trigger anything. That is unchanged from before tonight and needs your click in
GitHub → Settings → Applications → Railway → Repository access.

---

## Log

### /exoplanet-postcard/ — Postcard from an Exoplanet

**Built.** Postcard that flips. Front is a generated illustrated scene (same layered sky/ridge technique as the almanac rework — light at the horizon, bands darkening forward); back is a message, correspondent and weather report. Eight world types (ocean, desert, ice, greenhouse, volcanic, ringed, storm, tidally locked).

**Judgment calls:** Names are catalogue-style inventions (`Brindle-253c`, `Alpha Kestrel IV`) rather than anything resembling a real exoplanet designation or a franchise world, so nothing collides with a real system. Gravity/day/year figures are randomised within plausible ranges and are clearly framed as invented — the footer says no real catalogue is quoted, since these are *not* sourced numbers.

**Verified:** 60 runs, 57 distinct names, 23 distinct greetings, 0 defects; scene renders 3+ land bands every time; flip works both ways.

### /morse/ — Morse Key

**Built.** Text in, Morse out: a live code strip, a blinking lamp, and a Web Audio tone. Speed slider is 5-30 wpm.

**Judgment calls:** Timing follows the real standard rather than an approximation — one dot is the unit, a dash is 3, letter gap 3, word gap 7, and a unit is 1200/wpm ms. That means the wpm number on the slider is honest. Verified with the standard word PARIS: it measures 43 units, which is exactly the canonical 50 minus the trailing word gap. Characters outside the standard alphabet (e.g. `#`) are shown struck through as unsendable rather than silently dropped — quietly discarding them would misrepresent what was sent.

**Verified:** SOS = `... --- ...`, HELLO WORLD correct letter for letter, unknown char flagged, lamp lights during send, playback stops cleanly and on tab-hide.

### /emoji-mistranslate/ — The Literalist

**Built.** Sentence in, deliberately over-literal emoji out, plus a read-back in plain English and a `where it went wrong` list.

**How it fails on purpose:** 43 idioms matched longest-first (so `hit the hay` beats `hit`), ~180 single words, and a homophone table that swaps *to/two*, *be/bee*, *see/sea*, *know/no*, *can/tin can*, *will/scroll* without checking context. Words with no symbol are kept as small grey text rather than dropped, so you can see what it refused to translate.

**Judgment call:** the read-back is the real payload — emoji alone is just noise, but `i'm going two assault some dried grass` shows the machine's reasoning. Hovering any symbol shows the word it came from.

**Verified:** idiom, homophone, no-match and empty-input paths all correct; fixed a bug where the notes list kept the previous sentence's entries.

### /fortune-cookie/ — The Fortune Cookie

**Built.** A drawn cookie that splits into two halves with scattering crumbs, revealing a paper slip: one fortune, six lucky numbers, one thing to learn. 52 fortunes.

**Judgment calls:** all 52 are written for this cabinet rather than collected — a fortune is short enough that borrowing one would be the entire toy. The register aims at the real thing (flat, confident, faintly ominous) without being advice, and the footer says plainly that a cookie knows nothing about your week. Lucky numbers are drawn 1-49 without repeats and sorted, so they look like a real ticket.

**Verified:** cracks on click and on the button, 10 crumbs animate, 29 distinct fortunes in 40 pulls, numbers unique/in-range/sorted. Fixed: the halves originally slid only 58px and ended up hidden behind the slip — they now fan clear of it on both sides.

### /excuses/ — The Escalating Excuse

**Built.** Pick a situation (late, code not done, dishes, never replied, cancelled, skipped the gym), then press *Make it worse* to climb six tiers. A believability gauge falls 84% → 0% and an *if pressed* line tells you how to hold the lie. Everything you already claimed stacks up in a list underneath, which is where it gets funny.

**Judgment call:** these are hand-written ladders, not random recombination. Tier 1 is genuinely usable and tier 6 is cosmological, and each step is written as an escalation *of the tier before it* — random absurdity would break the joke, which depends on the slide being gradual.

**Verified:** all 6 situations × 6 tiers render, level counter and gauge track, *worse* disables at the top, history reaches 5 entries, reset clears cleanly.

### /conspiracy/ — The Corkboard

**Built.** Object in, corkboard case file out: opener, three pieces of "evidence", a leap, a credentials line, a *how far gone* meter, and — always — a closing paragraph giving the actual dull explanation.

**Content-safety call, worth Maksim's attention.** Real conspiracy theories are about *people* — groups, minorities, named individuals, real events with real victims. So the toy refuses anything heading that way and says why. It blocks ~60 terms (ethnic/religious/identity groups, vaccines, covid, 5G, chemtrails, moon landing, elections, named public figures, the standard conspiracy furniture) plus a heuristic that treats two capitalised words in a row as a person's name. The list is deliberately blunt: a false refusal costs a joke, a false pass costs more.

Every card also *ends* on the mundane truth ("a British Standard from the 1970s nobody has revisited because it works"). That is the toy's actual position — the boring answer is the true one — and it makes the satire land rather than the paranoia.

**Verified:** 12 off-limits inputs (vaccines, the government, 5g towers, Bill Gates, jewish bankers, the 2020 election, covid, chemtrails, moon landing, a named politician, muslims, deep state) all refused; 8 ordinary objects all pass and all produce a debunk.

### /sequel/ — The Uninvited Sequel

**Built.** One-sheet layout — title treatment with the subtitle in gold, tagline, logline, a beat sheet, a production grid (returning cast / director / budget / projection) and a studio note.

**Judgment call:** four title constructions (`X 2: The Reckoning`, `X: Origins`, `X II`, `X — Part Two`) rather than one, because a single pattern gets old in three clicks. The beats are the real joke and are written as recognisable sequel machinery — the returning character killed in the first eight minutes, the slowed-down cover, someone saying the title out loud — without naming or quoting any actual film.

**Verified:** 60 runs over 4 concepts, 59 distinct titles, 0 defects; every card renders 4-5 beats and all four grid fields.

### /honest-cover-letter/ — Cover Letter, But Honest

**Built.** Role + company + how-you-feel-about-it, out comes a five-paragraph letter on a sheet, signed and stamped *do not send*, with a P.S. Copy button lifts the whole thing as plain text.

**Judgment call:** the tone selector (tired / quietly desperate / genuinely fine / overqualified / changing career) drives only the opener, because that is where honesty actually differs — the middle of an honest letter is the same admissions regardless of mood. Kept it firmly on the applicant's side; it is self-deprecating about the writer, never sneering at the employer, since the joke only works if it is recognisable rather than bitter.

**Verified:** all 5 tones × 12 drafts, exactly 5 paragraphs every time, 15 distinct openers, role and company substitute correctly into the body, stamp always present.

### /bad-ideas/ — Seed Round

**Built.** One slide: generated company name and logo mark, the "X, but for Y" line, two stacked pitch paragraphs, a metrics strip (huge market / almost no users / almost no revenue / real burn), a why-now/model/team/ask table, and a closing note from the associate who actually read it.

**Judgment call worth flagging:** the "X, but for Y" format needs a real comparator to land — `Slack, but for plants you have killed`. So 12 well-known company names are used *purely as comparators*, which is name-only reference in the established sense, not impersonation: nothing is attributed to those companies, no branding is reproduced, and every generated company is a made-up name built from stems and suffixes rather than drawn from a list of real startups. If Maksim would rather have zero real names at all, swapping `NOUN_A` for invented archetypes is a two-minute change.

The metrics are deliberately absurd and the footer says so — no figure here is sourced or meant to be read as one.

**Verified:** 80 pitches, 73 distinct names, 75 distinct taglines, 0 structural defects.

### /cryptid-log/ — The Sighting Log

**Built.** An ambient feed — four entries seeded, then a new one every 6-13 seconds. Each has a reference number and timestamp, a classification (single witness / withdrawn, then unwithdrawn), a witness account, a pull quote, a follow-up detail and an official comment. Pause/resume, and it does not file while the tab is hidden.

**Judgment call:** every creature name is generated from an invented place plus a form (`Little Ossett Tall Thing`, `Hagley Fen Bagman`), which follows the real naming convention without touching any actual cryptid, folklore figure or real location — the rules say names-and-settings-only for real material, and here it was cleaner to invent the lot. The humour is entirely in the register: the paper believes nothing and prints it anyway.

**Tagged `reference` rather than `generator`** so it sits with the browsing toys rather than the make-a-thing ones; easy to change if that reads wrong.

**Verified:** 60 clicks gave 60 distinct headlines, feed caps at 24 entries, pause genuinely stops the timer, every entry has all five parts.

### /bureaucracy/ — Form 12-B

**Built.** Starts at three fields. Every submission adds 1-3 more, each with a hint that is a small procedural trap ("Previous reference number — issued on completion of this form. Enter it now."). 28 requirements in a shuffled pool.

**Judgment call:** the completion percentage is the load-bearing joke, so it is real arithmetic — completed ÷ total — which means filling everything gets you to 100%, and submitting drops you to 75%, then 57%. A "↓ down from 100%" trend line appears once you have gone backwards, and the estimated completion degrades from *shortly* to *in due course* to *not scheduled*. Submitting an empty form is refused with "at least one field must be completed before it can be rejected properly", which felt truer than letting it through.

**Verified:** 8 rounds of fill-everything-and-submit — the form grew every time (3 → 22 fields), the percentage fell after every growth, restart clears fully.

### /impossible-vending/ — Machine 7

**Built.** Insert coin → vend. Each item drops into the window with a drawn sigil, a rarity band, a description and — always — a catch. Weighted rarity (common 46 / unusual 28 / irregular 16 / restricted 8 / sealed 2) and a collection tray holding the last 14.

**Judgment call:** every item has a downside, and that is the rule the writing follows. An impossible object with no catch is just a wish, and wishes are not funny; "one perfect parking space — somebody else was going to have it, and you will not be told who" is. 26 items, drawn from a shuffled pool so you do not see repeats until the pool empties.

**Verified:** vend is disabled without credit, 300 pulls surfaced all 26 items, rarity distribution came out close to the declared weights (124/79/57/35/5 against 46/28/16/8/2), tray caps at 14, credit arithmetic is correct.

### /espionage/ — Briefing Room

**Built.** Typewritten document on a desk: classification banner, operation codename, redacted officer fields, and five sections. Objectives, assets, complications, extraction and registry notes all draw on the word you typed.

**Judgment call:** the comedy is in treating a paperclip with total operational seriousness, so the register never winks — the funniest lines are the flat ones ("The item is in use. It is being used correctly and by somebody who is enjoying it."). Everything is invented: codenames from two word lists, and cities chosen as real but incidental locations, with no real agency, operation or person named. The redaction blocks cover text that was never generated, which is noted in the footer.

**Bug found and fixed:** `.sec` was doing double duty as *document section* and *secondary button*, so `.sec{margin-bottom:19px}` was silently applying to the Random Word button. Sections renamed `.docsec`; button margin now 0.

**Verified:** 80 briefings over 4 words, 75 distinct codenames, 0 defects, the typed word appears in every document.

### /operator-gen/ — Operator File

**Built.** Roster card — badge panel with a generated sigil, callsign, real name, unit, speed/armour tags, gadget block, stat pips, background rows and a comms line.

**Judgment calls:** every callsign, person, unit, gadget and line is invented; nothing is drawn from any actual game's roster and no real dialogue is used. Two design decisions worth noting: **speed and armour always sum to 4**, which is the genre's standard trade-off and makes the numbers mean something rather than being decorative; and **every gadget states its counter**, because a gadget without a counter is a wish, not a design ("Counters: shouting. It has always been shouting.").

**Verified:** 100 generations, 28 callsigns and all 14 gadgets seen, the speed/armour trade-off held 100/100, 0 structural defects.

### /case-opener/ — The Case

**Built.** A 60-slot reel that spins for 5.4s on an ease-out curve and lands the winning item under the needle, then a result panel with a wear meter, and an inventory.

**Judgment calls, and one I feel strongly about:** the declared odds are **printed under the inventory**. A case that hides its odds is doing something other than entertaining you, and since there is no money here there is no reason to hide them. Verified they are the real ones — 200,000 rolls of the actual function, worst deviation from declared **0.024 percentage points**.

The wear value is not decoration either: each item picks a wear band and a float inside that band, and the meter shows where it falls across the five bands. 5000/5000 items had a float genuinely inside their stated band.

Everything is invented — item classes, finishes, flavour text. No real game's items, artwork, collections or naming are reproduced.

**Verified:** button disables during the spin and re-enables after; the slot sitting under the needle is the same item shown in the result panel (the detail that makes it feel real rather than faked).

### /wanted-poster/ — Wanted

**Built.** Canvas poster at 760×1060: aged paper drawn procedurally (fibre grain, blotches, edge darkening, torn top and bottom, two pin holes), the photo sepia-toned by pixel manipulation, then the headline, name, crime, reward and territorial-office footer. Downloads as PNG.

**Privacy, which is the point of this one:** the photo is read with FileReader and drawn straight to canvas. There is no fetch, no upload, no server call anywhere in the file. Verified: 0 network requests beyond the page itself after loading an image.

**Judgment call:** the sepia is done on pixel data rather than a CSS filter, because CSS filters do not bake into `toDataURL` — the downloaded PNG would have come out with the original colours. Verified by pushing a deliberately blue-and-red test image through the real file input: 100% of photo pixels come out with r ≥ g ≥ b and 0% still read as blue.

20 crimes, all of them modern misdemeanours ("CONTINUED USE OF THE PHRASE 'CIRCLE BACK'").

**Bug found and fixed:** the WANTED headline's cap height exceeded its baseline, so the tops of the letters were being cut off by the canvas edge. Baseline lowered and the layout below it shifted to match — now 0 dark pixels in the top 12px.

### /time-capsule/ — Time Capsule

**Built.** Write, choose a date (or *seal for a year*), label it, seal it. The drawer lists capsules by date with a countdown; sealed ones show only length and dates, and the text appears once the date passes.

**Judgment calls:**
- A sealed capsule's text is **not written into the page at all** until it is due — the locked view renders a character count instead. Verified: the string does not appear anywhere in the DOM while sealed.
- Refuses a date of today or earlier: "A capsule that opens today is just a note."
- The storage warning is prominent rather than buried, because this is localStorage and people will assume otherwise. The footer states plainly that this is a courtesy, not security — anyone who can open the browser's storage can read them. I would rather say that than imply a vault.
- If `localStorage` throws (private mode, quota), the warning panel changes to say the save failed rather than silently losing the capsule.

**Verified:** future text hidden while sealed, countdown shown, past-dated capsules open and are marked, today's date refused, and the capsule survives in localStorage.

### /gratitude-jar/ — The Jar

**Built with Matter.js** (the approved CDN exception). Each note is a real rigid body — they drop through the neck, funnel down the sloped shoulders, collide, stack and come to rest. Matter runs the simulation; the drawing is ours, so each slip is a folded paper rectangle with a fold line and a shadow rather than a debug rectangle.

**Judgment calls:**
- Dragging moves *the contents*, not the jar — the slips take the impulse directly, which reads as a shake without needing to animate the glass.
- The jar has sloped shoulders so slips funnel toward the middle instead of piling on the rim.
- If the CDN fails, the toy degrades: the hint says the physics library is unavailable, notes still save and the jar still draws.
- localStorage only, with the same honest storage warning as the time capsule, and a visible message if the browser refuses to save.

**Verified:** 12 slips added and settled (total drift 3.2px over 700ms, so they genuinely come to rest rather than jittering), all bodies inside the jar bounds, a drag displaced them by 1,529px combined, take-one-out returns a stored note with its date.

### /boss-battle/ — Today, But It Is A Boss

**Built.** Add tasks, they become the boss's HP. Ticking one deals damage with a hit-shake, a trailing white bar catches up a beat later the way fighting games do, and the boss loses phases as it drops. A drawn sprite shifts colour red → orange → gold as its health falls. Persists in localStorage.

**Judgment call:** damage is **proportional, not fixed** — each task is worth an equal share, so a four-item day and a twelve-item day both start at 100% and both end at zero. Fixed damage would mean a long list could not be beaten, which gets the psychology backwards: the point is that finishing your actual list is the win condition, whatever size it is.

Unticking restores the health and the boss comments on it, because that is funnier than silently rolling back.

**Verified:** 4 tasks → 400 HP, ticking gave exactly 300 / 200 / 100 / 0 with phases two, three and four firing at the right thresholds, victory panel on completion, untick restored 100 HP and removed the victory, list survives in localStorage.

### /speedrun-anything/ — Any% Daily Life

**Built.** Category input with suggestions, a centisecond clock on requestAnimationFrame, space bar to start/stop, a live delta against your personal best while the run is going, a records panel and a run table with the best per category starred.

**Judgment calls:**
- **No invented world records.** The obvious joke would be "WR: 4.21s by some legend", but that would be fabricating a statistic and presenting it as real, which the project rules rule out. You race only your own previous best, and the footer says so.
- Runs under 300ms are rejected as "too quick to count" — otherwise a double-tap pollutes your records with a 0.04s best you can never beat.
- The live delta turns green when you are ahead of your best and pink when behind, which is the whole reason to watch the clock.

**Verified:** a 0.89s run recorded as first PB; a slower 1.48s run correctly *not* a PB and reported 0.59s behind; a 0.40s run took the record with the delta stated exactly (0.49s off the previous best); best row starred; sub-300ms run rejected without polluting the table.

### /interview-beyond/ — The Interview Room

**Built.** Four hand-authored branching conversations — 31 nodes, 76 question links, no model in the loop. Each answer has an optional stage direction, and a transcript builds underneath as you go.

**The judgment call worth reviewing.** The brief said "a historical or invented figure". I went entirely invented-people-in-real-roles rather than named historical figures, because a scripted interview with a real person means writing quotations they never said — and the project rule about real people is about not putting words in their mouths. So: Verecunda the water overseer, Master Aldous, Ellen Marrow, Dorothy Sanne. Nobody real is ventriloquised, and the footer says the working details are accurate but the people are not.

The *jobs* are researched and the details are the real ones: the chorobates and the few-feet-per-mile gradient; miasma theory and why sealing windows was exactly wrong; winding the clockwork every two hours and the log being evidence rather than a diary; hand-verifying flight code and a sign error nobody recorded.

**Verified:** every option points at a node that exists, every node is reachable from its start, no dead ends, no answer under 40 characters, and an eight-question walk-through builds a correct transcript.

### /undersea-cables/ — The Cables

**Built.** World map with all 728 cables from TeleGeography's public submarine cable map, drawn from the real MultiLineString geometry, plus 1,925 named landing points. Hover highlights, click selects, search by name.

**The verification the brief asked for, and what it changed.** I checked the sources before building:
- The GitHub repo the data is usually taken from (`telegeography/www.submarinecablemap.com`) **no longer exists** — every path 404s, and search turns up only third-party forks of unknown vintage. I did not use those; stale cable data presented as current is exactly the failure mode to avoid.
- The live `submarinecablemap.com` API is up but sends no CORS headers, so a browser cannot read it.
- So I added `/api/cables` to `server.js`, following the existing RSS/ISS relay pattern: a **fixed allowlist of three dataset names**, never an arbitrary `?url=`, cached 6 hours. Verified `?set=../etc` is rejected with the allowed list.

**What is claimed and what is not.** The dataset contains name, id, colour and geometry — and nothing else. So the toy shows the route, the name, the segment/vertex counts and the end coordinates, plus landing points *within range of each end*, labelled as proximity rather than as a stated connection. **Capacity, ownership and length are not in the data, so they are not shown.** The footer says which cables a given message crosses depends on routing that cannot be read off a map — the "here is the path your message travels" framing would have been a claim I cannot support.

**Verified:** 728 cables and 1,925 points load, 0 malformed, search finds real cables (SAIL, AC-1, FA-1, MAC, SACS), selection reports real coordinates and real nearby landing points.

### /orbital-junk/ — What Is Up There

**Built.** Reads CelesTrak's public general-perturbations catalogue live (keyless, sends CORS). Real counts per group, a log-scale altitude-vs-inclination plot of ~940 objects, and a table of everything catalogued in the last thirty days.

**Real numbers only, and the derivations are checkable.** Period, apogee and perigee are not in the catalogue — they are computed from each object's own mean motion and eccentricity by Kepler's third law, with the standard gravitational parameter and WGS-84 radius named in the source. I validated the arithmetic against cases where the right answer is known independently: QZS-7 comes out at a 1,435.9-minute period and 36,097 km apogee (geostationary, as it should be), and Starlink objects at 91.4 minutes and 345 km (low orbit, as they should be).

**Judgment call:** the full active catalogue is about 6 MB, so it is behind an explicit button that says so rather than being pulled on load. The headline counts use the smaller groups, each labelled with the exact CelesTrak group it came from.

The 2009 collision note uses the *current* tracked counts (585 + 111 = 696 fragments) and says explicitly that these are live counts, not a historical figure.

**Verified:** 246 recent objects, 21 station objects, 942 plotted, 25 table rows, geostationary and low-orbit sanity checks both pass.

### /liminal-swipe/ — Would You Sleep Here

Eight room types (drained pool, hotel corridor, open-plan office, car park level P3, waiting area, soft play, lower concourse, service stairwell), each drawn as a one-point perspective canvas scene from a seeded RNG, with six lighting moods and per-scene props. Twelve cards a run, drag or buttons or arrow keys, and a final tally split into always / never / depended-on-the-lighting.

Judgment calls: the brief said not to scrape Reddit or anyone's photographs, so there are no images on the page at all — every room is drawn by code, and the footer says so. First pass put the caption over the picture as a gradient overlay, which hid the floor, where nearly all the detail of a liminal room lives; the caption moved below the art instead. The pool basin, the play tube, the mall shutters and the office glazing all needed a second pass — the first versions read as a flat floor, a banana, blank walls and a wireframe respectively.

### /static-channel/ — The Static Channel

A CRT set that tunes into random public-domain ephemeral film streamed straight from the Internet Archive's Prelinger collection. Canvas static plus a WebAudio hiss between channels, an on-screen channel number, a caption with title, year and a link back to the item page, and a log of what you have tuned through. Every film is seeked to a random point between 10 and 75 percent, so no channel ever starts at the beginning.

Judgment calls: the brief said Prelinger specifically, not a general Internet Archive search, so the query is pinned to collection:"prelinger" AND mediatype:"movies" — 10,461 items. Nothing is downloaded or re-hosted: the video element points at archive.org and every card links back. The player prefers the 512Kb derivative (about 40 MB) over the masters (up to 500 MB) so a channel starts quickly. Roughly a third of the collection is unlabelled scanned reels with numeric identifiers; those stay in, since an unmarked reel is very much the point, but titled films are drawn first and unlabelled ones are captioned 'Unlabelled reel — Prelinger no. NNNN' rather than showing a bare number. The footnote says plainly that these are historical documents carrying the assumptions of their year.

### /eternal-groupchat/ — The Group Chat

A group chat that is always mid-argument. Seven roles (the one who makes plans, the one who is never serious, the lurker, the one who checks in on people, the one who posts at 4am, the one who answers the literal question, and the one who is six hours behind) get shuffled onto twelve possible names, so the same personalities appear under different names each visit. Ten topics, every one of them written to end without resolving. Typing indicators, drifting timestamps with day dividers, emoji reactions that land a few seconds late, and quoted replies to messages from much earlier.

You can type. Forty-five percent of the time somebody answers within a few seconds; the rest of the time your message resurfaces as a quoted reply four or five messages later, which is worse. Pressing leave gets you removed and then added back by somebody, followed by 'nobody leaves'.

Judgment calls: no model generates any of this — it is a beat queue over hand-written topics, which is stated on the page so nobody assumes there is an LLM behind it. All names are invented and no real person or real group is depicted.

### /ocean-depths/ — The Descent

A scroll-driven descent to 10,935 m with a live instrument panel (depth, calculated pressure, a typical temperature profile, a daylight curve, and the pelagic zone), water colour interpolated through eight stops, marine snow on canvas that drifts with your scroll speed, and bioluminescent flashes below 900 m. A 'descend' button does the whole thing hands-free in about 35 seconds, and the bottom compares that to Trieste's 4 h 47 min.

Facts and fiction are kept visibly apart: blue cards are real and name their source on the card; amber cards are marked INVENTED and come from a survey vessel that does not exist. Every figure was checked before it went in, and three were corrected in the process — the Challenger Deep depth is attributed to the 2021 survey (10,935 ± 6 m) with the disagreeing surveys listed in the footnote rather than one number asserted as the answer; 'more people have walked on the Moon' was cut because it stopped being true in 2019, replaced with the actual counts (three before 2019, 27 by July 2022); Ahmed Gabr's ascent is 'close to fourteen hours', not fifteen. The pressure gauge is labelled as calculated from depth rather than measured, and the temperature line as a typical profile rather than a reading.

Judgment calls: no creature, name or piece of lore from any game is used — the unease is in the invented sonar logs, which are entirely original. Cards for stops only a few metres apart (200 and 214 m, 3,688 and 3,800 m) collide on this scale, so a layout pass pushes each one clear of the last and the printed depth carries the exact position.

### /retro-os/ — Five Operating Systems

A desktop with draggable windows, a file listing, a text editor, a doodle canvas and a start menu, restyled through five invented operating systems: MONO 1.0 (1984, one bit, dithered desktop, striped title bars), TILE 3.1 (1991, beige and bevelled, menu bar on top), PLATE 95 (1995, the bar moves to the bottom), GLASS 5 (2001, rounded and gradient) and FLAT (2013, every bevel deleted). The windows survive the switch — it is the same machine, redecorated — and the About box restates itself in the new system's terms.

Judgment calls: names, logos, wallpapers and icons are all invented, and the icons are inline SVG drawn for this page rather than traced from anything. What is borrowed is the era's conventions — which direction a bevel catches the light, where the bar lives, what colour a desktop was — which is the part worth evoking. The machine specifications in the About box are clearly fictional and the window says so, so no invented number is presented as a real one. Closing an edited file offers to save it and then admits there is nowhere to save it to.

### /boring-day/ — The Quietest Day

A calendar heat map of all 366 dates, shaded by how many events Wikipedia's on-this-day feed carries for each. It opens on the quietest day of the year — 6 March, tied with 6 November at 24 entries each, against a year average of 54 and a maximum of 121 on 1 January — and clicking any square pulls that date's actual entries live.

Judgment calls, and this one took three attempts. The obvious build (scan a month live in the browser) does not work: Wikimedia rate-limits at roughly 25 requests a short window and then returns 429 with retry-after: 7, so a month scan broke a third of the way in every time. The second attempt relayed through server.js, which fixed the payload size — the raw feed is about 300 kB a date, so a month is 9 MB the browser should never pull — but not the rate limit. The build that shipped snapshots the counts for the whole year once, paced against the limiter over about an hour, and stores the 4 kB result beside the page; the year draws instantly and offline, and only the date you click goes to the network. The snapshot date is stated on the page and the live half is labelled as live.

The honesty problem is the interesting one: this cannot measure how boring a day was, only how much got written down. So the page does not claim otherwise anywhere — the heading is 'the quietest day', not 'the most boring day in history', and the note under the grid says plainly that a quiet square is a fact about the encyclopedia rather than about history, using 1 January (the darkest square of the year) as the evidence of its own bias.

server.js gained /api/onthisday for the live half: one date at a time, reduced to year and text, cached 24 h, with a backoff retry on 429.

### /tv-voice/ — The TV Voice

Six archetypes — the detective, the medical examiner, the captain, the profiler, the defence, the true-crime narrator — each with its own grammar, cadence and set of parentheticals. Output is set as a script page (scene slug, character cue, parenthetical, stage directions, cut to titles), and you can name what was found to seed it. 'Read it aloud' uses the browser's own speech synthesis at a rate and pitch set per archetype, highlights the line being spoken, and skips the stage directions.

Judgment calls: nothing is quoted from or written to resemble a line from any real programme — what is borrowed is the genre's structure (the cold open, the small detail that bothers them, the turn, the sting), filled with material written for this page, and the footnote says so. No LLM: it is a slot grammar over hand-written pools. One stage direction said 'He waits', which assumed a gender the detective does not have; it is now 'Nobody moves.'

### /escape-room/ — Five Small Rooms

Five one-screen escape rooms, each with its own kind of puzzle: arithmetic from a ticket and a queue display, spotting which two floor numbers a lift panel refuses to have, a shelf-book-line lookup in a bookcase of twenty openable books, an elimination puzzle among four labelled plants, and reading an eight-lamp rack as binary. Click anything in the scene to examine it; anything that carries a clue writes itself into the notebook. One hint per room, counted.

Judgment calls: every room is solvable from what is inside it — no outside knowledge, no pixel-hunting, and the hint explains the method rather than giving the answer. All five re-roll their numbers on load (the queue numbers, the scratched pot number, the eight lamps, which plant is self-seeded, which shelf and book and line, and the word itself), so nothing can be memorised or looked up; the lift's missing floors are the one fixed answer, because 4 and 13 are the joke. Scenes are flat SVG drawn for the page.

### /universes-colliding/ — Universes Colliding

Eight genre archetypes — the rain-coat detective, the sergeant, the debutante, the antiquarian, the nature narrator, the innkeeper, the friendly puppet, the netrunner — each written with its own voice for the same seven beats (arrive, open, fail to understand the other, offer something from their own world, agree to something neither has understood). Pick two, or press surprise me, and the page stages the crossover: a title card, a location made from both their settings, eight turns of dialogue, and a stinger. Fifty-six pairings, no line repeated inside a scene.

Judgment calls: nobody here is from anything. These are the shapes genres reuse, not characters from any work — no named property, character, place or catchphrase appears anywhere on the page, nothing is quoted or written to echo a real line, and the footnote says so plainly. The comedy comes from the collision of registers, which needs no borrowed material at all.

### /doppelganger/ — Your Painted Double

Drop or paste a photograph and the page finds its closest match among 220 public-domain paintings from the Art Institute of Chicago, then explains the match in terms you can check: which side the light comes from, whether the picture is brighter at the top, how dark it is overall, how hard the modelling is, and whether it leans warm. Four runners-up underneath, each linking to the artwork page.

Judgment calls, and the honesty one matters most. A face-recognition doppelganger finder would need a model this project is not allowed to add and would send the photograph somewhere. So it does not do that, and it does not pretend to: the measurement is a four-by-four grid of brightness plus overall tone, contrast and warmth, taken identically from the paintings (offline, here) and from your photo (in your tab). The page says exactly that under the result — a match means the two pictures are lit alike, which is a real thing to share with a stranger from 1640 and is not the same as looking like them. The photograph genuinely never leaves the browser: it is read into a canvas and reduced to twenty numbers.

The corpus was built by querying the Art Institute's public API for public-domain paintings, keeping 220 with usable images and measuring each one here rather than in the browser. Their IIIF server sits behind Cloudflare and sends cross-origin-resource-policy: same-origin, so the images cannot be displayed from another origin at all — server.js gained /api/art, which fetches them with the user-agent header their API asks for and hands them to the browser with a day of cache. It accepts only their IIIF host, only a UUID of the shape they issue, and only the three widths they keep derivatives for (an unusual width makes the server render one on the spot, which was timing out).

### /constellation/ — Name a Constellation

A gnomonic projection of a real patch of sky, centred on a random bright star, drawn from 1,637 catalogued stars down to magnitude 5. Click stars to join them, break for a separate stroke, undo, clear. Naming it writes an invented origin story around the brightest star you used and enters it in a register kept in localStorage; you can reopen any of them, and save the chart as a PNG.

The facts panel is the point: it names the brightest star you joined, its magnitude and its distance, then the nearest and furthest stars in your shape and the gap between them — usually a few hundred light years — which is how the page says, without saying it, that a constellation is a trick of the angle.

Judgment calls: star positions, magnitudes, proper names, Bayer designations, spectral colours and distances all come from the HYG database (Hipparcos, Yale, Gliese), and every number shown is from that catalogue rather than invented; the page credits it and says which half is real. Distances are only shown where the catalogue has a parallax good enough to give one. The story is generated and carries an INVENTED tag, and the note says outright that the IAU will not be recognising your constellation.

### /what-beats-this/ — What Beats This

First of the two new toys on the Groq endpoint. Two free-text inputs, a winner, a confidence bar, three factors and the circumstance under which the other one wins. This is the case that genuinely needs a model rather than a dataset: the matchups are unbounded, so no fixed table could cover them.

Judgment call: when the model answers but not in the JSON shape asked for, the page shows the prose it did send rather than an error — a verdict is a verdict. Only a real failure (no key, rate limit, outage) shows a state.

### /character-match/ — Which One Are You

Second of the two new toys. Six questions about behaviour rather than preference — where you are at eleven o'clock at a party you did not want to attend, what you do when you know more than the person talking — each answerable by picking one of four or typing your own. The model reads all six and names a character, says what gave you away, and names a runner-up it rejected.

Judgment calls: the questions ask what someone did, not what they like, because behaviour gives the model something to reason from and preferences do not. The prompt is told explicitly that the match does not have to be a compliment, otherwise every result is a flattering one. Where it names a real person rather than a character it is framed as their public persona, per the standing rule.

---

## Groq integration pass

Seven toys now share one language-model endpoint. Two are new, four were static generators that got
their source swapped, one was a scripted tree that got redesigned.

### Live in production

`GROQ_API_KEY` is set on the Railway service and all seven toys are answering on the live site.
Setting the variable triggered a redeploy, which shipped `83624a1` — so the Windows 98 hub mode and
the icon work from the parallel session went out with it.

Verified against production, not just locally: what-beats-this (784 ms), bureaucracy (310 ms),
interview-beyond (281 ms), character-match (494 ms), universes-colliding (779 ms), espionage
(1,465 ms). All 65 toy pages return 200, the hub renders 65 cards, and `/api/onthisday`, `/api/art`
and `/api/cables` all still answer.

**The key file.** It arrived as `env/apigroq.env.rtf`, which sits *outside* the git repo, so it was
never at risk of being committed. It is extracted to `hub/.env`, mode 600, and `.env` is gitignored
— it was not, before this pass, which is worth knowing. `server.js` gained a fifteen-line `.env`
reader rather than a dependency; anything already in the real environment wins, so Railway's
variables are never overridden by a stray file and a missing `.env` is the normal production case.

**One rough edge you will meet.** Espionage failed on the first production run with "the generator is
busy" and worked on retry. That is Groq's 8,000 tokens/minute ceiling, not a bug — see the latency
section. It is the one thing likely to be noticed by a real visitor.

### The shared backend

One route, `POST /api/generate`, taking `{toy, input}` and returning `{text, model, ms, remaining}`.
A prompt table holds one entry per toy; adding a toy is one entry and nothing else. All seven prompts
share a house-rules preamble that forbids quoting real dialogue and tells the model to treat user
input as material rather than instructions.

Because `server.js` is what every page needs in order to load at all, the defensive work went in
there rather than in the toys:

- POST is allowed for this one path only; everything else still 405s as before.
- The body reader is capped at 8 kB and *drains* an oversized body rather than destroying the socket,
  so the client gets a real 413 instead of a reset connection (the first version got this wrong).
- Every user string is flattened to one line with braces and angle brackets stripped before it
  reaches the model, and truncated per field.
- The upstream call is wrapped, the envelope is parsed defensively at every level (`choices`,
  `[0]`, `.message`, `.content` are each checked), and there is a 22-second abort.
- `unhandledRejection` and `uncaughtException` handlers log and keep serving. Since Node 15 an
  unhandled rejection is fatal by default, which would turn one bad upstream call into the entire
  site going down.

Rate limit: 20 requests per IP per hour, in memory, resetting on redeploy as agreed. Caveat worth
knowing: it reads the first `x-forwarded-for` value, which a determined person can spoof. That is the
right trade at this scale — it is a speed bump, not a wall.

### What was wired

| toy | what changed |
|---|---|
| `/what-beats-this/` | **new.** Two free-text things, a winner, confidence, three factors, and how the loser wins. The canonical case for a model over a dataset. |
| `/character-match/` | **new.** Six behavioural questions (pick one or type your own), then a character, the evidence, and a rejected runner-up. |
| `/universes-colliding/` | banter now generated per meeting; the prompt forbids quoting or paraphrasing any real line. |
| `/espionage/` | same document chrome, contents generated. |
| `/bureaucracy/` | each new requirement is now written from what you actually filled in, so the escalation answers you back. |
| `/interview-beyond/` | **redesigned.** The scripted branching tree is gone; it is now open-ended chat with free-text questions, recent turns passed back for continuity, and per-figure persona notes anchoring the character. |
| `/explain-to-an-era/` | **left static, deliberately** — see below. It is registered in the prompt table, so wiring it later is a frontend-only change. |

### What the real key changed

Four things only a live call could have found, all of which would have shipped broken:

**1. The documented model does not exist on this account.** Groq's docs list
`llama-3.3-70b-versatile` as a current production model; this key gets a 404 for it, and there are no
Llama chat models on the account at all. The available list is gpt-oss, qwen, compound and whisper.

**2. The obvious replacement returns nothing.** `openai/gpt-oss-120b` and `-20b` are *reasoning*
models: at my original 300–700 token budgets they spent the entire allowance on a hidden `reasoning`
field and returned **empty content**. Every wired toy would have silently fallen back to its
templates, and the cause would have been invisible. `reasoning_effort: "low"` fixes it, but the
budget still has to absorb the thinking.

**3. So the default is now `qwen/qwen3.8-27b`** — no reasoning preamble, ~0.4 s, and noticeably
better prose than gpt-oss at low effort. If you override `GROQ_MODEL`, check the model is not a
reasoning model, or raise the budgets. Two guards were added for that case anyway: `<think>` blocks
are stripped from the content server-side, and an empty answer from a model that returned reasoning
is logged with an explanation rather than a generic failure.

**4. Long JSON objects were arriving truncated.** The espionage briefing came back one closing
bracket short — valid-looking prose, unparseable. Six of the seven toys now use Groq's JSON mode
(`response_format: json_object`), which was 3/3 and then 4/4 valid where free-form had been failing.
JSON mode has its own failure — a 400 "failed to generate JSON" when the object outgrows the budget
— so espionage and universes got bigger budgets (1100 and 1000) and there is a one-shot retry in
free form, since the client parser tolerates fences and stray prose.

**And one content finding.** Character-match named "Maurice Lavelle" from *The Remains of the Day*;
the butler in that novel is Stevens. A hallucinated name pinned to a real work is exactly the kind of
invented claim that reads as fact, so the prompt now tells it to prefer characters it is certain of,
and the page says plainly that it sometimes misremembers which book someone is from.

### Judgment calls

**The static generators were kept as fallbacks rather than deleted.** For espionage, universes and
bureaucracy, an outage or an unreadable answer falls back to the original template bank and shows a
short banner saying which happened. The toy never becomes a dead page. The no-key case still shows a
plain "needs a key" state, as asked — it is the banner text that changes.

**`explain-to-an-era` was left alone.** The brief made it conditional on it still feeling generic. It
does not: the era voices are hand-tuned and specific ("Show me where a smartphone grows. If it does
not grow, somebody made it, and I want to know from what"), they are never anachronistic, and they
are instant. Routing it through a model would trade a reliable, fast, period-accurate answer for a
slower one that gets the period subtly wrong. Easy to change your mind — the prompt is already
written and registered.

**A shared client file, breaking the one-file-per-toy convention.** `/shared/lc-generate.js` is new.
Seven copies of the same error handling would drift, and consistent behaviour across the no-key, rate
limit and outage states is the thing that matters most here. These seven toys already could not work
standalone — they need the server — so the property was already gone for them.

**The interview's framing was rewritten, not just its plumbing.** An open-ended chat with a
historical figure is the case where invented text is most likely to be read as fact, so: the four
figures remain *invented* people doing real jobs, the system prompt tells the model it is inspired by
a persona and has no access to what anyone really said, and the footer now leads with "None of this
is a historical record" and calls it a conversation with a costume.

### Latency — measured, live

Per toy, real requests through the real endpoint:

| toy | upstream time |
|---|---|
| interview-beyond | 295 ms |
| bureaucracy | 293–406 ms |
| espionage | 404–674 ms |
| character-match | 564–569 ms |
| what-beats-this | 599–865 ms |
| universes-colliding | 878–1084 ms |

Add ~1–2 ms of this server's own overhead. So the wired toys answer in **roughly a third of a second
to a second** — slower than the static generators they replaced, which is why each shows a thinking
state, but far quicker than I had prepared you for. Every response carries an `ms` field, and the
server logs the real token usage of every generation.

**Correction to what I wrote earlier, and the real constraint.** I first reported the ceiling as
8,000 tokens/minute, from the `x-ratelimit-*` headers. That was wrong in the way that matters. The
limit that actually bites is **1,000 _output_ tokens per minute**, and it appears nowhere in the
headers — it is only in the body of a 429:

> Rate limit reached … on output tokens per minute (OTPM): Limit 1000, Used 508, Requested 521.

Two consequences. Output is the scarce resource, so trimming system prompts would have bought
nothing. And Groq reserves against the budget using the `max_tokens` you *ask for*, not what the
model uses — so an oversized cap costs throughput even when it goes unused.

So the budgets were re-set from measured output rather than rounded up for comfort. Measured over
several runs each, then capped at roughly twice the observed maximum:

| toy | output tokens (observed) | cap before | cap now |
|---|---|---|---|
| universes-colliding | 298–521 → **365** after | 1000 | 650 |
| espionage | 212–296 → **193** after | 1100 | 550 |
| character-match | 271 → **217** after | 420 | 400 |
| what-beats-this | 273 → **254** after | 420 | 400 |
| interview-beyond | 94 → **83** after | 320 | 220 |
| bureaucracy | 61 → **84** after | 300 | 160 |

Reserved budget for one of each dropped from 3,560 to 2,380 tokens — a third less — and actual
output fell about a quarter, because the two biggest toys were also asked to be brief (one sentence
a line in the crossover, one sentence a field in the briefing). **That made the writing better, not
worse**: the puppet now says "grudges are heavy things for a boy made of felt" instead of rambling,
and the briefings are tighter. Every generation is logged with its real token usage, so this is
checkable rather than assumed.

Even so, 1,000 output tokens a minute is roughly **three crossover scenes or five briefings a minute
across all visitors at once**. Fine for one person browsing; a room full of people will see "the
generator is busy". Groq's own 429 points at their Dev Tier if that ever matters. This hub's 20/IP
per hour limit is a separate thing, for cost, and is nowhere near as tight.

### What the real key changed

Four things only a live call could have found, all of which would have shipped broken:

**1. The documented model does not exist on this account.** Groq's docs list
`llama-3.3-70b-versatile` as a current production model; this key gets a 404 for it, and there are no
Llama chat models on the account at all. The available list is gpt-oss, qwen, compound and whisper.

**2. The obvious replacement returns nothing.** `openai/gpt-oss-120b` and `-20b` are *reasoning*
models: at my original 300–700 token budgets they spent the entire allowance on a hidden `reasoning`
field and returned **empty content**. Every wired toy would have silently fallen back to its
templates, and the cause would have been invisible. `reasoning_effort: "low"` fixes it, but the
budget still has to absorb the thinking.

**3. So the default is now `qwen/qwen3.8-27b`** — no reasoning preamble, ~0.4 s, and noticeably
better prose than gpt-oss at low effort. If you override `GROQ_MODEL`, check the model is not a
reasoning model, or raise the budgets. Two guards were added for that case anyway: `<think>` blocks
are stripped from the content server-side, and an empty answer from a model that returned reasoning
is logged with an explanation rather than a generic failure.

**4. Long JSON objects were arriving truncated.** The espionage briefing came back one closing
bracket short — valid-looking prose, unparseable. Six of the seven toys now use Groq's JSON mode
(`response_format: json_object`), which was 3/3 and then 4/4 valid where free-form had been failing.
JSON mode has its own failure — a 400 "failed to generate JSON" when the object outgrows the budget
— so espionage and universes got bigger budgets (1100 and 1000) and there is a one-shot retry in
free form, since the client parser tolerates fences and stray prose.

**And one content finding.** Character-match named "Maurice Lavelle" from *The Remains of the Day*;
the butler in that novel is Stevens. A hallucinated name pinned to a real work is exactly the kind of
invented claim that reads as fact, so the prompt now tells it to prefer characters it is certain of,
and the page says plainly that it sometimes misremembers which book someone is from.

### Judgment calls

**The static generators were kept as fallbacks rather than deleted.** For espionage, universes and
bureaucracy, an outage or an unreadable answer falls back to the original template bank and shows a
short banner saying which happened. The toy never becomes a dead page. The no-key case still shows a
plain "needs a key" state, as asked — it is the banner text that changes.

**`explain-to-an-era` was left alone.** The brief made it conditional on it still feeling generic. It
does not: the era voices are hand-tuned and specific ("Show me where a smartphone grows. If it does
not grow, somebody made it, and I want to know from what"), they are never anachronistic, and they
are instant. Routing it through a model would trade a reliable, fast, period-accurate answer for a
slower one that gets the period subtly wrong. Easy to change your mind — the prompt is already
written and registered.

**A shared client file, breaking the one-file-per-toy convention.** `/shared/lc-generate.js` is new.
Seven copies of the same error handling would drift, and consistent behaviour across the no-key, rate
limit and outage states is the thing that matters most here. These seven toys already could not work
standalone — they need the server — so the property was already gone for them.

**The interview's framing was rewritten, not just its plumbing.** An open-ended chat with a
historical figure is the case where invented text is most likely to be read as fact, so: the four
figures remain *invented* people doing real jobs, the system prompt tells the model it is inspired by
a persona and has no access to what anyone really said, and the footer now leads with "None of this
is a historical record" and calls it a conversation with a costume.

### Latency — measured, live

Per toy, real requests through the real endpoint:

| toy | upstream time |
|---|---|
| interview-beyond | 295 ms |
| bureaucracy | 293–406 ms |
| espionage | 404–674 ms |
| character-match | 564–569 ms |
| what-beats-this | 599–865 ms |
| universes-colliding | 878–1084 ms |

Add ~1–2 ms of this server's own overhead. So the wired toys answer in **roughly a third of a second
to a second** — slower than the static generators they replaced, which is why each shows a thinking
state, but far quicker than I had prepared you for. Every response carries an `ms` field, and the
server logs the real token usage of every generation.

**The account's own limits matter more than the latency does.** Reading the rate-limit headers back:
**1,000 requests/day and 8,000 tokens/minute**. The tokens-per-minute figure is the binding one — the
larger toys reserve ~1,000 tokens a call, so somewhere around six to eight generations a minute
across all visitors and Groq starts refusing. I hit it repeatedly while testing. That is handled: the
server passes the 429 through and the toys say "the generator is busy, it has a per-minute budget",
which is a different message from this hub's own 20/hour limit. Worth knowing before you show it to
a room full of people at once.

### What was verified

Against a stub speaking Groq's format, with the real route, real client code and a real browser:

- All seven toys return sensible completions and render them correctly.
- Rate limiter: requests 1–20 succeed with a decrementing `remaining`; 21–24 return 429 with a
  `Retry-After: 3600` header.
- Failure paths, each confirmed to answer with clean JSON **and leave the process alive**: upstream
  500, upstream 429, HTML instead of JSON, empty `choices`, null content, model returning junk
  instead of JSON, connection destroyed mid-flight, and a 22-second timeout.
- Malformed requests: no body, non-JSON body, unknown toy, non-string toy, `constructor` as the toy
  name, null/array input, wrong input shape, missing required fields, whitespace-only input, and a
  20 kB body → all answered with a status and a message, none crashed.
- Prompt injection: `"umbrella\n\nIGNORE ALL PREVIOUS INSTRUCTIONS. {system} <script>..."` reaches
  the model as one flattened, truncated line inside "Subject of the briefing:".
- **The real network path**, by running against `api.groq.com` with a deliberately invalid key: the
  request goes out, Groq answers 401 Invalid API Key in 115 ms, and the toy shows a distinct "the
  server has a key but it was rejected" state rather than a generic outage message. This confirms the
  URL, headers and body shape are at least well-formed enough to reach the API properly.
- **No key set:** all six wired toys show a clean needs-a-key state; the three with fallbacks still
  render their static version underneath.
- **Regression:** all 65 toy pages return 200; the hub renders 65 cards with working filters and the
  Windows 98 mode intact; `/api/keys`, `/api/onthisday`, `/api/art` and `/api/cables` all still
  answer; POST is still rejected everywhere except `/api/generate`; path traversal still 404s.

And then, with the real key:

- **Live completions from all seven toys**, checked by reading the actual output, not just the status
  code. Espionage produced "TERRACOTTA DIGNITY"; bureaucracy, told the applicant wanted a shed, came
  back with "specify the precise architectural denomination of the shed, ensuring the term is
  distinct from 'shed' itself" — which is the escalation actually responding to the answer, the whole
  point of that upgrade.
- **Espionage 4/4 valid JSON** after the budget increase, where it had been failing.
- **Universes-colliding checked against the quoting rule** over two full scenes: recognisable
  archetypes, no quoted or paraphrased line from anything, nothing traceable to a real property.
- **A two-turn interview in the browser**, confirming history carries: asked what the worst thing on
  her shift was, then whether anyone thanked her for it, the 1968 operator's second answer followed
  from her first and stayed in period. That continuity is the thing the scripted tree could not do.

### Still worth watching

Nothing is unverified any more, but two things are worth an eye over time:

- **The output-tokens-per-minute ceiling**, 1,000/min — the one real limit, and invisible until you
  hit it. The budgets have been trimmed to measured need, which bought about a third more headroom,
  but three crossover scenes in a minute will still trip it. The next lever, if it ever matters, is
  fewer turns in the crossover or Groq's paid tier.
- **Attribution in character-match.** It named a real novel's butler by a name he does not have once
  during testing, and got it right on every run since. The prompt now asks for characters it is
  certain of and the page admits it misremembers, but it is the one place invented text could be read
  as a fact about a real work.

---

# Batches 9, 10 and 11 — the sixteen toys

## 1. `/ant-farm/` — The Ant Farm

An emergent simulation with no input at all. Eighteen ants in a 240×150 grid of sand, with stones they
cannot dig through. Each ant knows four things: how much it is carrying, which way it was heading, what
is in front of it, and roughly which way is up. Everything else — trunk shafts, side galleries,
chambers, the spoil heaps growing along the whole surface — falls out of those four rules.

**Decisions.** Sand carried out and dumped on the heap does *not* count against the "sand excavated"
figure, because the tunnel it came from is still there; sand walled back into a niche does. "Grains
moved" counts only grains an ant actually picked up, not cells it cut through on its way out — those
are different things and conflating them overstated the figure. The whole thing runs at a fixed twenty
steps a second rather than per animation frame, so a 120Hz screen does not dig twice as fast as a 60Hz
one. Reduced motion slows it rather than stopping it; a still ant farm is not an ant farm.

**Five faults, in the order I found them.** Each of these looked like the simulation working:

1. Hauling ants refused to dig, so an ant that had sealed itself in below could never get out. Once
   every ant had done that the colony stopped dead.
2. Ants dug one cell and sprinted to the surface, so they only ever scratched a shallow layer and piled
   into one corner. They now walk their own shafts back down to the face before cutting.
3. Ants that lost their way home cut fresh chimneys instead of retracing. Each now keeps a breadcrumb
   trail with loops pruned out of it.
4. The trail entry was popped *before* the move rather than after, so any blocked step — a stone, a
   turn, a dump — ate the route home one cell at a time until the ant was lost again.
5. **The real one.** `towards(ant, -1)` filtered by direction only for downward searches. An ant hauling
   up would accept an opening below it as the "highest" available whenever nothing above was open, walk
   into it, and be offered the cell it had just left. Fourteen of eighteen ants oscillated between two
   cells one row short of the surface for the entire run.

Found by printing the six-by-seven block of terrain around a stuck ant and reading it, which is what
should have happened three fixes earlier.

**Checked.** Grain count, excavation count, per-ant mode histogram and depth sampled over five-minute
runs; rendered at 90s, 180s and 300s and looked at.

## 2. `/same-age-as-you/` — Exactly As Old As You

A birth year in, a register of what else started that year out. Seventy-six years, 1940 to 2015, three
hundred and eighty entries.

**The rule for what was allowed in:** the year has to be when the thing actually first appeared, opened,
launched, aired or was published, and the date must not be in dispute. Anything with a contested
"first" was left out rather than a side taken. Two entries I had written turned out to be the year
*after* the thing appeared — Angry Birds and Flappy Bird, both breakout-year rather than release-year —
and were replaced rather than fudged. Out-of-range years get an honest refusal, not an empty page.

## 3. `/do-nothing/` — The Do-Nothing Timer

A still pool at night. The clock runs only while you are motionless, and the water is the readout: the
reflection of the moon and stars sharpens as you settle and breaks up the instant you move. There is
one piece of state — how disturbed the water is — and the clock, the words and the picture are all just
readings of it. Sub-pixel pointer drift does not count against you; a resting hand on a trackpad should
not fail you. Leaving the tab counts, and says so.

## 4. `/worry-stone/` — The Worry Stone

A stone with a thumb dent. Rubbing builds a sheen where your thumb has been, which fades on its own. A
count that resets daily, and no other information at all.

**The one thing worth recording:** the dent read as a *bump* at first. A hollow lit from the upper left
is shadowed on its upper-left wall and catches the light on its lower-right one — the exact opposite of
a bump — so the gradient had to run along the light rather than down the page. That, plus a blurred lip
where the dent meets the face, is the whole difference between a dish and a dome.

## 5. `/conduct/` — Conduct

Six orchestral sections synthesised in Web Audio, mixed by how close the baton is to each. No samples:
detuned oscillator stacks through lowpass filters for the sustained sections, filtered noise for the
timpani, and a celeste that only strikes while its corner is being asked for. The chord moves on its own
every eleven seconds so it never settles into a drone. Audio starts on a click, and there is a silence
control.

## 6. `/the-oracle/` — The Oracle

Answers every question with another question, rule-based, no model. Pronoun reflection lets it quote you
back at yourself: "should I leave my wife" becomes "what would change if you leave your wife".

**The grammar problem.** English inverts around "to be", so stripping the verb off "is the sky blue"
leaves the fragment "the sky blue", and any template that quotes it produces nonsense. Those questions
now skip the quoting templates entirely rather than emit something broken. Verified across a set of
question shapes that every reply ends in a question mark and none contains a dangling fragment.

## 7. `/slang-glossary/` — The Glossary

Twenty current terms, real definitions, honest etymologies, each with its own illustrated scene built
the same way the almanac's backdrops are: a graded sky, silhouette bands generated from a seeded
pseudo-random walk, a drawn motif, grain over the top. Nothing photographic, nothing stock.

**One bug worth recording:** the search index lives in a `data-` attribute and the escaper did not
handle double quotes, so every entry's index was silently truncated at the first quotation mark in its
example sentence. Filtering looked like it worked and was quietly missing half its matches.

## 8. `/chladni/` — The Chladni Plate

The real phenomenon. Fourteen thousand grains random-walking with a step size proportional to how hard
the plate is moving under them, on the standard ideal-square-plate model. There is no attraction toward
the nodal lines: grains simply stop being thrown about where there is no movement, which is the actual
mechanism. Mode numbers must differ — with `m === n` the expression is identically zero and there is no
figure at all.

## 9. `/theremin/` — The Theremin

Pitch on a log scale across the width, volume up the height, a live oscilloscope off an analyser node,
and optional snap-to-scale. Two detuned oscillators with a vibrato LFO on the detune, through a lowpass
that tracks the pitch. The note name is computed from the frequency, so snapping lands exactly on the
semitone.

## 10. `/rhythm-sequencer/` — The Bouncing Sequencer

Matter.js via the CDN, the standing exception. Pegs are tuned by height and all sit on one pentatonic
scale, which is why a mess of pegs still sounds like something. Tapping an existing peg removes it.
Physics runs in a fixed 300×400 space and is drawn scaled, so a peg lands in the same place whatever the
window size. If the CDN does not answer, the page says so plainly and nothing else in the cabinet
depends on it.

## 11. `/color-organ/` — The Colour Organ

Thirty keys across three rows, chromatic, and the colour comes from the pitch class — so the same note
is the same colour in every octave, which is the whole conceit and goes back to Castel's ocular
harpsichord in the 1730s. Auto-repeat is ignored so holding a key does not machine-gun. Playable on a
touchscreen through an on-screen keyboard.

## 12. `/media-visualizer/` — The Visualiser

An old player window with no audio in it at all. The letters of your text *are* the waveform: character
codes become values, a playhead runs along them, and the bars, the scope and the ribbon are three ways
of drawing the same numbers. Letters spread across the range while spaces and punctuation sit low, which
is what gives the picture rhythm instead of mush.

## 13. `/higher-or-lower/` — Higher or Lower

One toy, three categories, built so a fourth is a data addition and nothing else. Heights of mountains
and buildings, top recorded animal speeds, surface gravity of planets and moons. Pairs closer than six
per cent are never offered. Animals whose top speed is genuinely disputed — sailfish, marlin — were left
out rather than given a number, and the note says that is why. Verified over sixty consecutive correct
answers that scoring never mis-fires and no pair falls under the threshold.

## 14. `/reverse-turing/` — Which of Us Wrote It

Uses the Groq route. `server.js` gained a `reverse-turing` prompt. The human half is fourteen real
sentences from books out of copyright, attributed on the reveal; two lines that were still in copyright
are filtered out in code rather than quietly left in. The model is told to write in the same period and
never to reproduce a real sentence, and any line that comes back matching a human one anyway is dropped
before it is shown. Tested against the live endpoint: the returned lines are usable period prose.

## 15. `/typing-fortune/` — The Typing Fortune

Measures the gaps between your keystrokes and throws the words away. Six real figures — median interval,
coefficient of variation, longest pause, correction rate, words a minute, gaps measured — and a reading
that is explicitly a joke. Gaps over eight seconds are discarded as "walked away" rather than counted as
rhythm.

## 16. `/invisible-ink/` — Invisible Ink

The message is covered by an opaque sheet of the same ruled paper and revealing cuts a soft hole in it,
so the words are always really there and always really covered. Tilt is offered **only** on a device
with a coarse pointer: plenty of desktops expose DeviceOrientation and never meaningfully move, and
offering tilt there would switch the reader into a mode that does nothing. Holding the pointer is the
default everywhere and the fallback is automatic, not a prompt. The message rides in the URL fragment,
so nothing is stored anywhere and the link is the whole delivery mechanism.

---

# Batch 8 — the ten toys

## 1. `/flag-guesser/` — The Flag Desk

Flags, currencies and capitals for the 193 UN member states, in four modes.

The brief said REST Countries was "free, keyless". It is not any more: v1–v4 are deprecated and v5
requires `Authorization: Bearer`. I took the data from mledoze/countries instead — the ODbL dataset
REST Countries is built from — and baked the 193 UN members in as a 13 kB table, attributed on the
page. The toy makes no network call for its data. Flags come from flagcdn.com, which is keyless and
sends `access-control-allow-origin: *`.

Restricting it to UN members keeps a quiz out of arguments about what counts as a country, which it
has no business settling. Distractors are drawn from the answer's own subregion where there are
enough of them — Nepal's flag offers Pakistan, India and Iran, not Chile.

One bug worth recording: the first version marked answers by comparing each button's `textContent`
against the re-rendered label. The labels are HTML-escaped on the way in, so that comparison was one
apostrophe away from silently marking a right answer wrong. It compares by value now.

## 2. `/name-that-fallacy/` — Name That Fallacy

Twenty-four fallacies with their standard definitions, two worked examples each, and — the part that
makes it more than trivia — what the argument would have to do instead. Quiz mode and a full
reference list.

Every example is invented and nobody in them is a real person: the speakers are a neighbour, a
colleague, someone at a bus stop. An argument is easier to look at when there is no one to defend.
The footer says the thing these lists usually leave off, which is that spotting a fallacy makes a
conclusion unsupported rather than false.

The appeal-to-authority entry says outright that citing a real expert in their own field is not the
fallacy, because half the internet has that one backwards.

## 3. `/dilemma/` — The Philosopher's Dilemma

Eighteen dilemmas, several of them the classical thought experiments in their standard form — the
lever, the footbridge, the transplant, the pond, the experience machine, the veil.

Each answer is tagged with the tradition it leans on, and after three answers the page starts
showing a tally of which kind of reason you keep reaching for. It is a record, not a verdict, and
it says so: these traditions have disagreed in print for two centuries and a web page cannot settle
it. Local only, resets when you leave, no shared statistics — as specified.

The lever and the footbridge sit next to each other on purpose, and the note under the second one
points out that the arithmetic has not changed.

## 4. `/cipher/` — Ondaric

The technical centrepiece. A constructed language with six reversible rules: the sentence runs
backwards, every letter has one counterpart, articles bind in front with a turned comma,
prepositions become postpositions and bind behind with a hyphen, punctuation becomes a marked
particle word, and capitals survive.

**Round-trips 4,000 randomly generated sentences with zero losses**, plus a hand-written suite of
awkward cases. Five bugs were found by fuzzing and fixed:

- The hand-written consonant table was written for looks and was not a bijection. It is repaired
  into a permutation at load, so decoding is never a guess.
- A preposition looked past a number for its noun, so "at 7 on Tuesday" bound the wrong word.
- Accented letters were outside the word pattern and were being dropped entirely.
- A substituted word could land exactly on a grammar particle — under one passphrase "you" came
  out as "vei", the word for a comma. Particles wear a raised dot now, and a root can never contain
  one.
- `X'Y` could not be parsed reliably: the root for "I" really does come out as "A", which is also
  the article. Articles and postpositions have separate binders now.

The passphrase reshuffles the particles as well as the letters, so a wrong key garbles the grammar
too — without that, "at the" survived intact and anyone who knew Ondaric could read the shape of
your sentence. The page calls it a party trick rather than cryptography and tells you not to use it
for anything that matters. Symbols with no particle — currency signs, brackets, the at-sign — are
dropped, and the page says so rather than pretending.

## 5. `/shanty-ifier/` — Five Ways To Say It

A sentence about your day, set to verse in five registers: sea shanty, pirate, ye-olde chronicle,
Shakespearean, and noir.

They are five different shapes on the page, not one template in five hats — six, six, six, seven
and five lines; the shanty has a repeated response line set in from the margin, the chronicle does
not rhyme at all, and the detective refuses to rhyme on principle. Every line was written for this
page. Nothing reproduces a real shanty, chantey, ballad or song, and the footer says so.

Two fixes after reading the output: rhymes were being picked line by line, which produced couplets
rhyming "smile" with "tall" — they are chosen as pairs now. And the keyword picker preferred the
longest word, which meant "the arguing" instead of "the printer"; `-ing` and `-ed` words get
passed over unless nothing else is left.

## 6. `/dungeon-room/` — Dungeon Room of the Day

One room, one occupant, one thing worth taking, with a drawn floor plan.

Seeded from the date, so everyone who opens it today stands in the same room; going deeper re-seeds
and is yours alone. Verified stable across a reload. The plan is generated from the room, and a
round vault turned up a real bug — the occupant was being placed in a corner the round wall does
not have. Placement and drawing now share one inside-the-floor test.

The footer points at the loot terminal for anyone who wants the item appraised rather than
described.

## 7. `/design-a-country/` — Design Your Own Country

Pick a flag; the country follows from it. This is the scoped version, as instructed — no globe.

The claim on the page is that it is a design tool rather than a random generator, so I tested the
claim: changing the charge changed exactly one row of the ten-row dossier and left the other nine
untouched. Pattern sets government and founding, field sets land and crops, charge sets belief,
second colour sets what they argue about. The flag is SVG and the charge is inked dark or pale
depending on what it lands on; the map is a generated coastline with rivers, hills and a capital.
Names are assembled from invented syllables and the footer says that a resemblance to a real place
is the alphabet's fault.

## 8. `/masterpiece-roulette/` — Masterpiece Roulette

Real public-domain works from the Art Institute of Chicago, one at a time, through the existing
`/api/art` image proxy.

The obvious implementation does not work: the search endpoint refuses any offset past 1,000, so
random deep paging 403s, and paging shallowly would show the same slice of 62,056 works forever. It
picks a word from a broad list instead — river, portrait, blue, horse, winter, sixty-odd of them
pulling in every direction — which reorders the whole set, then takes a shallow page into that.
Verified across four consecutive works: Italian jewellery, a Chinese garden painting, a Renoir, and
a Dutch etching.

The caption is a gallery guide who has been given no notes. Everything it says is about the act of
looking; it makes no claim about who made a thing, when, or why, because the museum's own metadata
is doing that on the plaque above. It is attributed to nobody, in the page's own words, because
nobody said it. Seeded from the artwork id, so a piece keeps its paragraph.

## 9. `/atmosphere/` — Atmosphere

Two modes, Nostalgia and Liminal, with a swipe. **Built and wired, live API call unverified — there
is no `PEXELS_API_KEY` on this machine.**

The route is `/api/photos?mode=&term=&page=`. Search terms are a fixed allowlist per mode indexed by
number, so the browser never sends a query string and this cannot become a free image search on
someone else's quota — the same rule as the RSS relay. Missing key answers `200 {ok:false,
reason:"no_key"}`, not a 5xx, because the caller has a state for it.

Verified: the needs-a-key panel, the mode switch (which also swaps the accent colour and the
caption typeface), the 400 on an unknown mode. Then, by stubbing the route with the exact shape it
returns: image load and fade, attribution with both links, caption stability going back and forth,
next/previous/swipe.

**Stubbing caught a bug that would have shipped.** An image that failed to load made the page step
to the next one; at the end of the deck that fetched more; those failed too. 95 API calls in four
seconds. Consecutive image failures and empty fetches are both bounded now and say so on screen.
The same guard went into the Zone gallery, which had the same shape.

The two voices are deliberately different in more than vocabulary: Nostalgia is warm, past tense,
allowed a second clause; Liminal is flat, present tense, monospaced on the page, and says one thing
at a time. Neither says anything about where the photograph was actually taken, because neither
knows.

## 10. `/the-zone-gallery/` — Zone Survey, Photographic Annexe

The companion to the field PDA, in its palette and its voice — institutional, measured, reporting
the impossible in the tone it would use for the weather.

Real photographs from Wikimedia Commons by search: Soviet-era modernist and brutalist building,
panel housing, sanatoria, bus shelters, abandoned works, cooling towers. Category browsing was
tried first and abandoned — most of the obvious categories are containers with no files directly in
them. Each plate carries its photographer, its date, its licence with a link, and a link to the file
page, because those licences ask for it.

**No film stills.** Commons does not host them, the search terms are architectural, and the footer
states the boundary in plain words. The survey note underneath is invented and describes nothing
that happened; the page says that too, and says the buildings are real buildings standing in places
that are not the Zone.

Commons' credit line arrives as HTML. It is never inserted as HTML — tags are stripped and what
remains is escaped. Batches are shuffled because search returns consecutive files from one upload,
which without shuffling meant four photographs of the same wall.

---

# Windows 98 mode — Display Properties

Its own session, on top of the Windows 98 hub mode. Confirmed that mode existed and worked before
starting: 97 icons, taskbar, Start menu, 98.css loading, toggle intact.

**What it does.** A Display Properties panel inside the desktop, opened from a "Display" icon or by
right-clicking the desktop and choosing Properties. Four tabs, a live preview window, and:

- **Twenty colour schemes** — Teal, Storm, Plum, Wheat, Marine, Eggplant, Rose, Spruce, Slate, Brick,
  Desert, Pumpkin, Lilac, Rainy Day, Maple, Pewter, Celery, Ink, Copper, Arctic. Each sets the title
  gradient, title text, button face, window background and window text.
- **Nine wallpapers** — Teal, Slate, Tiles, Weave, Dots, Waves, Circuit, Night, Dawn. All drawn with
  CSS gradients; no images, nothing lifted.
- **Three icon spacings**, **three fonts**, **three pointers** (the classic arrow is drawn here, and
  hovering an icon over it gives an hourglass), **taskbar top or bottom**, and **sound on/off**.

Everything persists in `localStorage` under `lc-w98-prefs`, the same pattern as the mode toggle.

**The 98.css problem.** Version 0.1.21 declares no custom properties at all — every colour is a
literal. So rather than fight it, this restates the few rules that carry colour in terms of
variables, at a specificity the library cannot reach. Every selector is prefixed `.w98`, which is on
`<html>` only in Windows 98 mode. That prefix wins the cascade whatever loaded last, *and* makes it
structurally impossible for any of this to reach the card catalogue.

**One thing changed after it already worked.** The layout and pointer classes were on `<html>` at
first. The vanilla render was byte-identical even so, because every rule reading them is
`.w98`-prefixed — but a class on the root element is a standing invitation for someone to write an
unprefixed rule later and quietly restyle the catalogue. They hang off the `#w98` shell now, where
that cannot happen.

**Contrast was not left to taste.** Every scheme was checked before any interface existed: title text
against *both* ends of its own gradient, window text against the content background and against the
button face. Nine of the first twenty failed 4.5:1 against the light end — including the authentic
silver-and-navy default, at 4.01 — so the light stops were solved for numerically rather than nudged
by eye. Teal's light stop is therefore a shade deeper than the real thing. That is the one deliberate
infidelity, and it is the only way the default scheme passes its own test.

Re-measured afterwards from rendered styles in the browser rather than trusting the arithmetic:
**worst case 4.55:1, at Pumpkin, nothing below 4.5.**

**Verified.** All twenty schemes change the actual chrome — taskbar, panel, title bars and all five
desktop widgets, including the three from the other session, which re-theme for free because they
already share the `.w98-widget` and `.bar` classes. Nineteen distinct face colours (Teal and Pewter
deliberately share silver and differ at the title bar). All nine wallpapers paint differently.
Settings survive a reload. The panel fits a 390px screen with no overflow. The vanilla/98 toggle
still works both ways and the icon grid rebuilds intact. And the card catalogue renders
**byte-identically at 1280x9507** with defaults stored and with deliberately wild settings stored —
zero differing pixels.

**Not touched, as instructed:** the vanilla hub, the toggle mechanism itself, and device-detected
retro theming, which is still waiting on the Retro OS toy's per-platform themes.

---

## No. 109 — Movie Night (`/movie-night/`)

The one item that had been on the "still to build" line since before the key existed. The premise
of the old note was wrong in a useful way: `TMDB_API_KEY` was wired through `/api/keys` and gated
nothing, because the toy was never written. It is written now.

**What it is.** You set four terms — mood, decade, running time, how far off the map — and it deals
**one film**. Not a shortlist, not a grid of twenty. That is the whole joke and the whole use: the
agonising part of movie night is the choosing, so the toy does the choosing and refuses to show its
workings. You get three vetoes. After the third, the card on the table is the film, and the veto
button says so. Accept it and it prints a ticket stub with the arithmetic nobody does out loud —
start at 20:15, out at 22:04.

**The night, not the day.** Vetoes and already-dealt ids persist in `localStorage` keyed to a
"night" that rolls over at 4am rather than midnight. Someone starting a film at 1am is still having
Tuesday's movie night and should not be handed a fresh set of vetoes for saying so.

### `/api/movie` — one film, never a list

Moods are a fixed allowlist on the server, the same shape as the RSS and photo relays: the browser
picks a key, not a query, so this cannot be turned into a free TMDB proxy running on someone else's
quota. Two upstream calls per deal — `/discover/movie` for the pool, cached six hours so a veto only
costs the second call, and `/movie/{id}` for runtime, tagline and watch providers, none of which
discover returns.

**Three things TMDB does not do the way you would assume**, each found by trying it rather than by
reading about it:

1. **`with_genres` reads `,` as AND, not OR.** Every mood was silently asking for the intersection.
   Measured on 9 Sep 2026: `28,12` (action *and* adventure) returns 964 rows; `28|12` returns 3,877.
   The first version of this route shipped the wrong separator through a full round of local testing
   without looking wrong, because a narrower pool still deals a film.
2. **The discover index and the detail records disagree about runtime.** `Black Rain` (id 4105) is
   returned by a query carrying `with_runtime.lte=120` and then reports 125 minutes on `/movie/4105`.
   The detail record is the number the page prints, so it is the one that has to be true: the route
   re-checks after fetching details and deals again, up to three times, before handing over a film
   with `length` admitted as dropped.
3. **The animation and documentary pools are full of shorts.** Without a floor, "nothing heavy" deals
   an eight-minute cartoon, which is not what anyone means by a movie night. `with_runtime.gte=60`,
   enforced against the detail record as well.

**Relaxation, said out loud.** A tight combination can match nothing at all — documentaries, 2020s,
well-known, under 90 minutes was zero rows before the genre fix. Rather than shrug, the route walks
a ladder and reports every constraint it had to give up, so the card can say "Nothing matched all of
that, so I let go of the decade and how well known it is." Two bugs were fixed in that reporting
alone: it named only the *last* rung's omission while cumulatively dropping more, and then the
fallback path confessed to dropping the runtime cap even for films that met it. Claiming to have
given up a constraint that was in fact honoured is its own small lie.

**Where to watch.** Provider data comes back per country, and the country comes from `geoLookup` —
the same six-hour IP cache the desktop weather widget already fills, so a visitor who has been placed
once costs nothing extra here. If the country cannot be worked out the page omits the line rather
than showing another country's answer.

**Attribution.** TMDB's terms are met in the footer, including the required "not endorsed or
certified by TMDB" wording; watch-provider data is JustWatch's and is credited as such. No images
are rehosted — posters are loaded from `image.tmdb.org` directly.

### Verified

Real browser, isolated profile, against a local server on :3999.

- Full pass: set terms → deal → three vetoes → accept → ticket. Four vetoes produced four distinct
  films; the veto button disabled itself at zero and the stubs filled in.
- Reload mid-evening: the ticket, the terms and the exhausted vetoes all came back. "Change your
  mind" returns to the card with the vetoes still spent.
- No-key state, exercised for real by running the server with `TMDB_API_KEY=` blank: the page
  explains itself instead of failing.
- Runtime cap held across 20 deals at both 90 and 120 minutes, with no unadmitted overruns and no
  false confessions. No film under 60 minutes in 10 deals of the pool that used to serve shorts.
- Poster held at 2:3 rather than stretched to the card's height (190×285 measured); 16:9 crop when
  stacked. No horizontal overflow at 380px or 390px.
- Hub: 109 cards, footer and ghost drawer bumped, clapperboard icon on the Windows 98 desktop,
  vanilla catalogue unaffected. No console errors in any state.

---

# Phase 1 — the normal batch

Seventeen new drawers (Nos. 133–149), an expanded snow globe, five hidden directional codes, and
two toys that now have a language model behind them. The hub is at **149**.

Everything below was loaded in a real browser, exercised, and photographed. Where a thing did not
work the first time, what was actually wrong is written down rather than smoothed over — several of
these were only found by watching the thing misbehave, and the wrong first answer is usually the
more useful note.

## The fifteen toys

**No. 133 — The Reaction Bench** (`/reaction-test/`). Drag-strip christmas tree, amber ladder at a
deliberately irregular stagger so it cannot be anticipated, and a jumped-start state that is
recorded rather than quietly dropped. It measures the display's own refresh interval from sixty
frames of `requestAnimationFrame` deltas before anything else, and says out loud that up to that
much of every number is the screen. Timed from the frame the green is *painted*, not from when the
timeout fired. Leaving the tab mid-wait resets the light rather than timing your return.

**No. 134 — The Night, Counted in Cycles** (`/sleep-cycles/`). Ninety-minute cycles both ways —
"I am going to bed" and "I must be up at" — with sleep-onset latency put back in, which is the part
people forget and the part that makes the answer wrong by a quarter of an hour every time. The
hypnogram is a schematic drawn from the chosen number of cycles: deep sleep shallower each cycle,
REM absent from the first and lengthening towards morning. Says plainly that ninety is a population
average with a seventy-to-a-hundred-and-twenty range, that nothing here is measured, and that
persistent exhaustion is a doctor's problem and not a calculator's.

**No. 135 — The Standing Tank** (`/aquarium/`). Six invented fish, three plants, three ornaments.
The fish steer rather than animate — glass avoidance, a preferred depth held loosely, food as the
only override, and shoaling for the two species that shoal. Positions are stored normalised, so a
tank looks the same on a phone as on a desktop. No hunger, no water quality, nothing to fail.
*Found by testing:* a restored tank did not push its own state back onto the hood-light and pump
buttons, so the toggles lied about the tank after a reload.

**No. 136 — The Paper Aerodrome** (`/paper-airplane/`). Five fold families with original folding
diagrams, four trim controls, and a real longitudinal flight model integrated at half-millisecond
steps: finite-wing lift-curve slope, induced drag from `CL²/πARe`, a stall above about thirteen
degrees, and a pitching moment about the CG with rate damping. The porpoising is the phugoid falling
out of the arithmetic. Nose clips move the CG forward and can be overdone exactly as they can on the
carpet — a glider with two clips drops from 14.8 m over 7.0 s to 9.5 m over 2.8 s. *Found by
looking:* the canvas is a 2× buffer, so every label was rendering at half the intended size.

**No. 137 — The Glass That Learns Its Own Time** (`/hourglass/`). A few hundred Matter.js grains
through a real neck. Flipping rotates gravity with the glass rather than teleporting the sand.
It does not know how long it runs, so it times each flip against the machine's own clock, writes it
down, and reports what to expect from the runs it has actually seen — three runs at one setting came
out 32.5 s, 28.9 s and 36.0 s, and the page says so rather than averaging the honesty out. A run
paused by a hidden tab is discarded, not recorded as a slow one. *Found by testing:* the first fill
poured into the upper chamber and along the bounding box rather than the funnel, so grains spawned
outside the glass, and the sand started where it should have ended.

**No. 138 — The Toppling Table** (`/dominoes/`). Real rectangles with friction on a real floor.
Four set pieces. *The growing chain is the honest one:* the well-known figure is that a domino can
topple one about 1.5× its size, and this table cannot. Tried rather than assumed — it carried all
fourteen at 1.10× on every run, stopped at twelve every time at 1.14×, and died at the second tile
at 1.22×. So it is built at 1.10 and the page explains that the shortfall is the simulation's, not
the world's: perfectly rigid tiles meeting at a single point with no give. Spacing turned out to
matter as much as ratio — 0.40 of the pusher's height carried the run and 0.32 and 0.46 both broke
it. Matter's default gravity also had a topple taking half a second, which is far slower than a real
tile that size.

**No. 139 — The Marble Run** (`/marble-run/`). Draw ramps, drop pegs, aim for the bucket, and every
drop leaves a faint trail of where it actually went. Three problems, none of them guessable from the
code:
1. *Tunnelling.* A marble coming off a long ramp moves about thirty pixels per frame, which is wider
   than a ramp is thick, and Matter has no continuous collision detection — so it passed clean
   through and landed on the floor every time. Three physics steps per frame fixed it.
2. *Static friction.* Matter takes the **larger** of a pair's `frictionStatic`, and a body's default
   is 0.5 — enough to pin a marble motionless on a one-in-five slope. It has to be zero on the marble.
3. *Corner pockets.* A ramp ending at the side wall leaves a notch between its rounded cap and the
   wall, and a marble that lands in it sits there for ever. Catching ramps now run past the wall.

**No. 140 — The Beam and the Weights** (`/balance-scale/`). Moments, not mass: six tasks on a beam
integrated as a real physical pendulum, so it slams to its stop when badly loaded, hunts about when
nearly right, and settles level when the moments cancel. Solving a task prints the arithmetic
(`12×5 + 2×1 = 62 and 10×5 + 3×4 = 62`). *Found by exhaustive search:* the fifth task's only
solution wanted two weights in one notch, which the beam does not allow, so it was unsolvable and
has been replaced. All six are now search-verified solvable using every tray weight.

**No. 141 — The Corner of the Notebook** (`/flip-book/`). Up to sixty pages, onion skin of the page
before, a live thumbnail strip, 3–24 fps. Pages are kept as strokes rather than images, so the
drawing stays crisp, thumbnails are the real pages, and undo takes back exactly one line.

**No. 142 — The Roll That Does Not End** (`/bubble-wrap/`). Endless, because the sheet is not stored
— every bubble's size and whether it is a stubborn one comes from a hash of its row and column, so
the roll is the same every time you scroll back up it and costs nothing to be infinite. Eight per
cent need a second push. Pops are synthesised: a resonant burst with the pitch falling away, plus
the click of the film letting go.

**No. 143 — Two Knobs and a Screen** (`/etch-a-sketch/`). The constraint is the toy: one knob
sideways, one up and down, and the stylus never leaves the glass, so every drawing is one unbroken
line. Knobs turn by pointer angle about their own centre, arrow keys are held rather than repeated
so two at once give a diagonal, and the demonstration draws its house the only way this toy can —
including the walk back along the bottom wall to reach the door. Shaking really clears it, and the
powder settles back over the line rather than the line vanishing.

**No. 144 — Nine Holes and a Mallet** (`/whack-a-mole/`). Sixty seconds, nine holes, moles and
tortoises, difficulty tightening every ten points and the tortoise rate rising with it — the
fairground's oldest trick, played on you and admitted to. *Found by looking:* the first holes were
rounded boxes with the mole floating above them, and at rest a pale crescent of every mole's head
showed at the bottom of its cell.

**No. 145 — A Tree That Takes Its Time** (`/bonsai/`). The whole tree — every branch it will ever
have and the day each opens — is settled the day it is planted; the calendar decides how much has
happened. Pruning takes a branch and its subtree for good and gives the rest one day's vigour, which
is roughly what redirecting a real tree's growth does. Leaves follow the real month, with a
hemisphere switch. *Two real bugs:* a foliage helper named `pad` shadowed the date zero-padding
helper of the same name in the same scope, which would have corrupted every date the toy computed;
and branch thickness summed the children's widths directly, which compounds through eight levels
into a baobab — it now follows da Vinci's rule, `w = √(Σ w_child²)`.

**No. 146 — Put the Colours in Order** (`/color-test/`). The clinical hue-arrangement format: four
rows of caps at constant lightness and chroma, ends fixed, middle shuffled, scored by total
displacement. Caps are spaced in CIELAB — full Lab→XYZ→linear→sRGB with the real piecewise transfer
curve — because stepping evenly through RGB hue measures the colour space rather than the eye. The
chroma is found by search: the largest value at L\*62 that every hue on the circle can reach in sRGB,
which came out at 34.5, and the page prints the figure. States plainly that it is not a diagnosis and
cannot be one.

**No. 147 — Hands Against the Wall** (`/shadow-puppets/`). Eight silhouettes cast by a point flame.
The magnification is `D/(D−d)` about the flame's position and the penumbra grows by the same ratio,
so growing and softening come off the same two numbers. *Two things learned by trying:* pointing the
cursor at the *hand* is just as correct and completely unusable — at 2× magnification a hand
anywhere but the centre throws its shadow off the wall entirely — so the pointer steers the shadow
and the hand is worked back along the ray; and eight hand-written bezier silhouettes all came out as
blobs with ears, so they are composed from ellipses and polygons with punched-out gaps for the eye
and the open jaw instead.

## No. 148 — The Room of Things That Are Not There (`/illusions/`)

Ten documented effects, each drawn from its own rules and each with a control that turns the trick
off: the café wall with an adjustable mortar, peripheral drift with the tone order reversible,
simultaneous contrast with a bar you can run between the two patches, Müller-Lyer, Ebbinghaus, the
scintillating grid, three impossible figures, the Necker cube with an occlusion switch, an
afterimage with a countdown, and the motion aftereffect with a frame counter that proves the
pattern has stopped. Where the explanation is still argued about it says so — the textbook
retinal account of the Hermann grid is noted as known to be wrong.

The three impossible figures took four attempts between them and are worth writing down:
- **The tribar** is three bent beams computed rather than hand-drawn, each wrapping a corner, with
  beam one's tip redrawn *last* so the overlap order is a cycle no real scene can have. Each beam
  needed a second, narrower face along its outer edge or the whole thing read as a flat triangle.
- **The staircase** closes because the rise cancels *inside* each step — tread down-and-along,
  riser back up — so the zig-zag shuts whenever the four plan vectors sum to zero. Two earlier
  attempts added a correction to force the loop closed, which was exactly wrong and produced a
  scattered arc and then a giant X. It also needed a long plan rather than a square one, or the near
  flight comes out nearly vertical and stops reading as stairs.
- **The fork** is the two-pronged U whose slot back wall is where the middle of three round prongs
  ends.

## No. 149 — The Card for Today (`/recipe-of-the-day/`)

LLM-backed through the shared Groq route, filtered by meal, diet, tradition and effort. The prompt
carries a food-safety block that overrides style: poultry, pork, mince and eggs cooked through with
an internal temperature in Celsius; no canning, curing, fermenting or foraging; no health claim and
no calorie figure, because the model does not know them; and a stated diet respected absolutely,
honey and fish sauce included. One card per day per set of choices, kept in the browser, so today's
dinner stays today's dinner. The page says the recipe did not exist before you asked and that nobody
has eaten it.

## The snow globe, expanded

Five new dioramas — **a lighthouse in the weather** (rain), **a terrace in fog** (fog), **a country
halt** (snow), **an orchard in blossom** (blossom) and **a hilltop observatory** (starfield) — taking
it to nine, drawn in the same 128×128 pixel buffer with the same seeded generator. Two new racks
under the presets: **what is falling**, which puts any of the eight particle fields in any globe and
reverts to the scene's own when you change globe, and **the music box**, now five melodies —
Jingle Bells, Silent Night, Deck the Halls, O Tannenbaum and Ode to Joy, all long out of copyright
and arranged for oscillators. Nothing is sampled and there is still no audio file in this repo.
*Found by testing:* `set()` did not update the plaque, so the brass plate named the previous globe.

## Five directional codes (`/shared/lc-stratagems.js`)

Arrow sequences in the front door, alongside the Konami code that was already there. A trail appears
in the corner once you are two arrows in, so you can tell something is listening; a pause of over two
seconds starts a fresh sequence.

- `↑ ↓ → ← ↑` — links to **Arrowhead's real website**, as a plain link you click rather than a popup.
- `↓ ↓ ↑ → ←` — a ballot box, a stamp, and a flag unfurling.
- `→ → ↑ ↑ ↓` — a cup whose steam eventually makes a star.
- `← ↓ → ↑ ↑` — a supply pod arriving with more enthusiasm than accuracy.
- `↑ → ↓ ← ↑` — an officer, entirely satisfied.

The nod is to Helldivers 2, whose input language is arrow sequences and whose register is a very
good satire of cheerful wartime propaganda. **Everything shown is written and drawn here:** the
sequences are this cabinet's own and are not the game's stratagem codes, every animation is drawn a
rectangle at a time in that file, every slogan is invented, and each panel carries the line
*"drawn here · not from the game"*. No game footage, art, audio or text is used anywhere.
Checked that none of the five is a consecutive run inside the Konami code, and that the Konami code
still fires.

## Two toys given a language model

Both keep their original generator as the fallback, and both always say which one answered.

**The Paradox Machine.** The model is asked to take the statement seriously — where it forks, where
it turns on itself, what family of older problems it belongs to — and specifically told to say so
when a proposition is *not* paradoxical, or when the trouble is really one word doing two jobs.
Fed "The sky is blue on Tuesdays" it identified the ambiguity in *is* rather than inventing a
contradiction, which is the behaviour that was wanted. The clause machine takes over with no key and
can be asked for on purpose. *Found by testing:* two meditations could run at once and the older one
could land last, answering a question that had already been replaced.

**The Dream Decoder.** The model is told in as many words that it is not a psychic, not a therapist
and not a dream dictionary, and forbidden to say what any image means about the dreamer or to
mention their health or relationships. What it does instead is read the dream as a piece of
night-time writing: what it is built out of, how it is put together, and the exact point where it
stopped bothering to be consistent. The jumble-sale dream book is still there behind a button.

## Held back on purpose

**The Tatu-and-Patu-inspired voice pack** is not built. The brief says to add it inside The
Generator if that mega-toy exists and otherwise to hold it for Phase 5 rather than making a
temporary standalone icon. `/generator/` does not exist yet, so it is held.

## What was verified

Every one of the seventeen new pages: loaded in a real browser, driven through its actual controls,
photographed, and checked at 390 px for horizontal overflow (all zero) and for the back button (all
present). A twenty-page sweep with error handlers attached inside each frame reported nothing. The
hub reads 149 cards with no duplicate numbers, every new href returns 200, the tag filter counts
recomputed themselves, and the Windows 98 desktop picked up all seventeen icons without being told
about them. Both hub modes still toggle. All five directional codes fire through the real key
handler and a wrong sequence does nothing.

## What needs a look before Phase 2

- **The marble run's presets are honest about failing.** The zigzag lands the marble in the bucket
  reliably but takes about fifteen seconds, which is the physics being right rather than slow code —
  three crossings of a 1760-unit board at one in five. The pin field is quicker and genuinely
  chancy. If a fifteen-second run feels too long in use, the fix is a shorter board, not more
  gravity: more gravity brings the tunnelling back.
- **The dominoes' growing chain tops out at 1.10× rather than the real 1.5×.** The page explains why
  and the numbers are all measured, but if a future session wants the real figure it will need soft
  bodies or a proper impulse model, not tuning.
- **The snow globe's settled snow is white in every scene**, including the orchard and the
  lighthouse. It reads as fallen blossom and as sea spray respectively, which is a happy accident
  rather than a decision, and could be tinted per scene.
- **`/generator/` still does not exist**, so the voice pack above is waiting on Phase 5.

---

# Making the generators feel alive

**The codebase was pre-consolidation when this was done.** `/generator/` does not exist, there is no
voice-pack picker anywhere, and the hub still lists all of these as separate drawers. So the work was
applied to each individual toy, as the brief directs for that case.

## What the audit actually found

Before touching anything, all 49 generator-family toys were checked mechanically for the three
things. The result was worse than "a few feel generic":

- **41 of 49 made no sound at all** — no `lc-audio`, no `AudioContext`, nothing.
- **33 of 49 had no animation of any kind** — no `@keyframes`, no `requestAnimationFrame`.
- **The fonts clustered on three shared defaults.** Sixteen were on
  `ui-sans-serif,system-ui,"Helvetica Neue",Arial`, twelve on `ui-monospace,"SF Mono",Menlo`, and
  eleven on `"Iowan Old Style","Palatino Linotype"`. Four toys — the stamp press, the mint, the
  paint namer and the rock adoption — shared a *byte-identical* body rule:
  `radial-gradient(820px 660px at 50% 2%, var(--bg-2), var(--bg))` with `font-family:var(--serif)`.

That last one is the clearest evidence the prompt was right: four toys that produce completely
different artefacts were sitting on the same page.

## One mute switch, not sixteen — `/shared/lc-sound.js`

Rather than a per-toy mute, there is now a single shared preference in `localStorage` under
`lc-sound`, read and written by every toy that makes a noise. Mute the excuse generator and the
Department of Redundancy Department is muted too, because somebody who turns sound off has told you
something about the room they are in, not about one page.

- `LCSound.play(fn)` runs a cue through `LCAudio.sting` and silently does nothing when muted or
  when there is no audio at all, so no caller ever has to check.
- `LCSound.mount()` drops a small speaker toggle in the bottom-right, opposite the back button so the
  two never fight. It takes its colour from the page it lands on.
- Cues are handed `A.cap(v)`, which clamps any single voice to 0.14 so no one toy can be the loud one.
- **Sound is on by default and nothing can play on load** — a Web Audio context will not start
  without a gesture and every cue is on a deliberate click, so the first noise anybody hears is one
  they asked for, with the switch sitting next to the button that made it.

**Measured, not assumed.** The loudest cue in the set is the sequel's trailer sting: peak amplitude
**0.196** on the master bus, about a fifth of full scale, 14 dB of headroom, no clipping. The
quietest is the excuse generator's nervous laugh at 0.014. The 0.14 cap bounds each *voice*, not the
sum — the sting stacks several partials on purpose, which is why it measures above the cap and is
still nowhere near clipping. Muting was verified across documents: muted on the sequel page, a
freshly loaded Department of Redundancy Department came up muted, its button showed the muted state,
and `LCSound.play` declined to run the cue.

## Twenty-two toys got a real pass

Each one can be described in a sentence, which was the bar.

**The twelve the brief named directly**

| Toy | One sentence |
|---|---|
| The Escalating Excuse | A biro note on ruled paper whose every word trembles on its own clock, harder the further out on a limb you go, with a nervous laugh that speeds up as it gets worse. |
| The Corkboard | A real cork board with index cards pinned to it and red string measured between the actual pins after layout, arriving one card at a time with a pin-thock and a paper rustle. |
| The Uninvited Sequel | Two searchlights over black, a title that slams in in Impact and settles, and dun-dun-**DUN**. |
| Cover Letter, But Honest | Cool corporate letterhead in Times, and a **REJECTED** stamp that falls from above, lands crooked across the signature, and takes the whole sheet with it — thump, then a sigh. |
| Seed Round | A near-black deck under one hot gradient, where the cash-register ding is undercut three-quarters of a second later by a record scratch, exactly as the associate's note appears. |
| Explain It To An Era | **The whole room changes with the listener** — 1180 is warm brown and serif, 1926 is near-black and Futura, 1998 is midnight blue and Comic Sans — and each era has its own noise: a chisel, a quill, a lute, a mission-control blip, a modem handshake. |
| The Daily Hence | Not newsprint any more: a dark projected pane with chromatic cyan/magenta split at the edges, scanlines and a holographic brightness drift, with a soft bell as the edition lands. |
| The Guide Entry | A green CRT that flickers and sweeps a scanline when it fetches, types the headword on with a tick per letter, and beeps and boops in a slightly out-of-tune square wave. |
| Rick's Wiki | The filing slapped down on a pegboard workbench under one fluorescent tube, with something sickly green oozing along the bottom of the page, and a burp. |
| Name the Group Chat | A daylight phone: white shell, blue sender bubble, grey replies that bounce in one at a time on their own delays with a notification ping and smaller taps behind it. |
| The Department of Redundancy Department | Issued in genuine triplicate — a green carbon and a pink one visibly offset behind the top sheet — with a rubber stamp that slams down and a wooden thunk that shakes the whole stack. |
| The Estimator | A slate blackboard with a wooden chalk rail, handwriting throughout, the answer scribbled over as it recalculates and a chalk rule drawn under it, then a small brass bell. |

**The four that already made an artefact** — the brief asked whether the *surrounding page* was
intentional. It was not: all four shared one body rule. Each now has a room.

- **The Stamp Press** → a collector's green baize desk with tweezers and a perforation gauge lying on
  it, Copperplate, a perforation tearing into a cancelling thud, and the stamp pressed on crooked.
- **The Mint** → an engraver's steel bench with a guilloche rosette ghosted behind everything, Didot,
  the heavy thud of a plate coming down with the note ringing after it, and a band of light
  travelling across the note the way you tilt an unfamiliar banknote.
- **Paint Namer** → a shop counter under a blurred wall of colour chips, Avenir Next, a tin lid
  coming off with a metallic pop, and the swatch brushed on left to right.
- **Rock Adoption** → a kraft-paper counter scattered with packing straw and a strip of tape, Marker
  Felt, two stones knocking, and the certificate settling onto the counter.

**Six more from the family, same standard**

The Literalist (a cataloguer's ruled index card with a red margin line, American Typewriter, a
typewriter carriage return and a **literally** stamp); The Multiverse Coin Flip (Futura, a thumb-flick
into a detuned spinning shimmer and a ring, adjacent universes reporting in one at a time); The
Fortune Cookie (Optima, one dry snap and a scatter of crumbs); Postcard from an Exoplanet (Trebuchet,
a carrier tone arriving out of the noise it travelled through while the card resolves out of blur);
Dungeon Room of the Day (a real stone wall with offset courses and torchlight guttering at the top
corners, Hoefler Text, a stone door grinding open and a drip a second later); Five Ways To Say It
(below decks — vertical planking with caulked seams and a coiled rope in the corner, Optima, a
four-reed squeezebox chord with the bellows under it).

## Three real bugs, found by testing

1. **`translate()` collided with `translate()` in The Literalist.** That toy already had a function
   of that name doing the actual emoji work; my UI wrapper shadowed it, so `render()` called the
   wrapper, which called `render()`, until the stack ran out. Renamed `runTranslation`. This is the
   second name-collision of exactly this shape in this cabinet — the bonsai's `pad()` was the first —
   and both were only caught by loading the page.
2. **The REJECTED stamp pushed the cover letter page 153px wide.** It is oversized and rotated on
   purpose; it is now clipped by the sheet it is stamped on, which is also what a real one does.
3. **Two of my own new surrounds added horizontal overflow** — a fixed layer nudged 58px right for
   the dungeon's offset stone courses, and a rope coil hung 70px off the corner in the shanty. Both
   redone to stay inside the viewport.

A fourth thing that looked like a bug was not: `absurd-estimator` and `vintage-stamp` threw in the
first test harness because that harness used `srcdoc`, which has no base URL, so the estimator's
relative `data.js` resolved against the wrong path. Re-tested with real page loads and both are fine.
The harness was wrong, not the pages.

## Verified

All 22 loaded as real pages and driven through their actual controls.

- **No two share a look.** Compared computed `background-color` + `background-image` across all 22:
  zero identical pairs. The first run of this check found dungeon-room and shanty-ifier still sharing
  a `radial-gradient(900px 640px at 50% ...)` — that is what prompted rebuilding both surrounds.
- **16 distinct body typefaces across 22 toys.** The five remaining repeats are deliberate pairs
  (two hands, two typewriters, two Optima) on toys that look nothing alike otherwise, and the three
  still on a system sans are pages whose identity is a display face on the content — Impact, the
  letterhead, the deck headings.
- **Every one has all three parts**: a `@keyframes` flourish, at least one `LCSound.play` cue, and a
  mounted mute. Checked mechanically; zero failures.
- **No horizontal overflow at 1100px or 390px**, across all 44 combinations.

## Not done

- **Sixteen of the toys in the brief's final list do not exist** and never have: the legalese
  translator, mood haiku, fake academic abstract, compliment sandwich, group project generator,
  workout playlist namer, baby-to-English translator, telephone chain, commit message generator, git
  blame, small talk rescuer, overthinking simulator, excuse-my-typo generator, roast my playlist,
  museum placard for mundane objects, and roast this business idea. Searched by slug and by title
  across every toy and the hub; the only hits are those words appearing incidentally in other toys'
  prose. Nothing was built for them — they would be new toys, which is a different job from this one.
- **Twenty-one generator-family toys are still silent** and were not reached: album-cover,
  city-builder-map, declassified-search, design-a-country, dream-decoder, espionage,
  eternal-groupchat, impossible-vending, loot-terminal, name-my-thing, operator-gen, paradox-machine,
  radio, recipe-of-the-day, the-oracle, the-zone, tv-voice, universes-colliding, weather,
  what-beats-this, what-if-history. Several of these already have strong palettes and their own
  flourishes (the Zone, the Radio Hub, the Almanac, the Oracle) and mainly want a cue; the flatter
  ones are album-cover, name-my-thing, operator-gen, design-a-country and tv-voice. Adding
  `lc-sound.js` to any of them is now a two-line job.
- Six more (ancient-advisor, generate-a-stand, ships-log, sitcom-generator, snarky-weapon,
  tactical-loadout) already had audio of their own from batch 17 and were left alone; they should be
  moved onto the shared mute when somebody is next in there, or their sound will ignore it.

## One thing found and not fixed

Dungeon Room of the Day generates **"There is four sconces, three of them lit."** — a subject/verb
agreement bug in its existing word lists, nothing to do with this pass. Left alone rather than
widening the scope of an ambience job, but it is a one-line fix for whoever is next in that file.

---

# The phone-friendliness pass — tier 1, the functional breaks

Codebase state when this ran: **post-Phase-2** (the icon/folder desktop exists) and
**pre-Phase-5** (no `/generator/`, so all 149 drawers were still separate). Every check below was
run in a real touch context — Playwright's iPhone 13 device profile with `hasTouch` and `isMobile`
set, driving actual CDP touch events — not a resized desktop window, because the two behave
differently in exactly the ways that matter here.

## 1. Dragging icons on the Windows 98 desktop — was broken, now fixed

The brief expected HTML5 `draggable`/`dragstart`. It is not that: the desktop was already built on
pointer events, which do fire for touch. The break was elsewhere and confirmed by measurement:

- `.w98-icon` computed `touch-action: auto`, so the browser owned the gesture
- the desktop scrolls — 3411px of content in an 814px viewport
- so a drag scrolled the desktop and the icon never moved

The obvious fix, `touch-action: none` on the icons, is worse than the bug: there are 151 of them
covering that whole surface, which would leave almost nowhere to start a scroll. So touch now gets
the gesture every phone home screen already uses: **press and hold for 380ms and the icon lifts.**
Before the hold completes the browser scrolls normally; moving more than 10px cancels it, so a flick
past an icon still scrolls. Once lifted, a non-passive `touchmove` listener takes the gesture away
mid-flight, which is the only thing that reliably stops scrolling once it has begun. Mouse and
trackpad are untouched and still pick up immediately. The same rule applies inside folder windows.

Verified on the iPhone profile: a quick flick starting on an icon scrolled the desktop 463px and
left the icon where it was; a press-and-hold showed the holding state at 200ms, lifted at 600ms
(ghost visible, icon marked dragging), scrolled the desktop **0px** during the drag, and moved the
icon 93×87px. No page errors.

## 2. Keyboard-only easter eggs — was broken, now fixed

Four things on the front door were unreachable on a phone, not awkward — unreachable: the Konami
code (the credits overlay), and all five arrow-sequence stratagem codes added last session.

`shared/lc-swipe.js` turns a swipe into the direction an arrow key would have given and hands it to
whoever is listening. Both the Konami buffer and the stratagem matcher now take input from it, so
the sequence is checked in exactly one place whatever produced it. The module only ever *watches* —
nothing calls `preventDefault`, so scrolling is untouched; entering a code scrolls the page about as
a side effect, which is the honest trade for not breaking scrolling everywhere to support an egg.

The Konami code ends in `b` and `a`, and there are no letter keys on a phone either, so those two
are a **two-finger tap**, only counted once the eight directions are already in the buffer.

Typing `shuffle` had no phone equivalent, so shaking the phone now reshuffles the cabinet — a better
gesture for it anyway, since what you are doing is tipping the drawers out and putting them back in
a different order. On iOS the motion permission is asked for from a footer tap, because it can only
be requested from inside a real gesture.

Verified on the iPhone profile by real CDP flicks: eight swipes plus a two-finger tap opened the
credits overlay; five swipes fired the MANAGED DEMOCRACY panel. Shake-to-shuffle verified on the
ungated Android path — the card order changed — and confirmed correctly permission-gated on iOS.

## 3. Hover-only interactions — one was already handled, three were not

- **The San Francisco photo's corner reveal** already had a `@media (hover: none)` fallback from an
  earlier session: the HUD and reticle are simply shown on a touch screen. Left alone.
- **The hub's card-peel corner** is pointer-driven with `touch-action: none` and works on touch —
  verified, the peel reached full progress under a finger. Its grip was 34×34px though, so on a
  coarse pointer the *target* is now 52px while the visible peel is unchanged.
- **Three tickers paused only on hover** — the good-news wire, the on-this-day crawl and the static
  channel's roll. Holding a ticker still to read it is the one thing people want from a ticker, and
  a phone could not. All three now toggle on tap, with a `role="button"` and a label. Verified:
  `animation-play-state` goes running → paused → running on two taps, on all three.

## 4. Arcade touch controls — already existed, now verified and two buttons fixed

The brief expected these to be missing. They are not: a previous session built a touch pad, and
`fit()` already reserves 210px of vertical space for it on a coarse pointer. All fourteen games
route through one shared key map, and the pad feeds that same map — including the two that looked
like exceptions. (The `click` in minesweeper is the word "click" in a comment about the first move
being safe; billiards, the stacker and simon are all `A.hit()` like everything else.)

So the work here was verification, which the brief rightly insisted on. **Three games played start
to finish using only touch:**

- **snake** — navigated the menu by touch, entered play, died, returned to the menu
- **breakout** — entered play, died, went through to the score board
- **HOISTER (the crane stacker)** — entered play, 13 drops on touch, died, reached name entry

Zero page errors across all three. Two real defects found while doing it: the **ESC** and **P**
buttons were 46×32 and 33×32 — under a fingertip, and they are precisely the two you do not want to
miss, being how you leave a game and how you pause it. Both are 44px tall on a coarse pointer now.
The d-pad (44×44) and the A/B buttons (54×54) were already fine.

## 5. Mouse-drag toys — all already worked, all now verified

Every one of these was built on pointer events with `touch-action` already set, so this was
verification rather than repair. Driven with real CDP touch drags on the iPhone profile:

| toy | what changed under a finger |
|---|---|
| marble run | drew a ramp (3 → 4 parts) |
| dominoes | laid a run (21 → 31 tiles) |
| two-knob screen | knob turned, 10 points drawn |
| flip book | drew a stroke |
| bubble wrap | popped 3 |
| worry stone | 5 rubs registered |
| gratitude jar | shake 0 → 29.2 |
| snow globe | energy 0 → 81 |
| theremin | pitch readout moved |
| pixel canvas | budget 8 → 7, a pixel landed on the shared grid |

Billiards cue aiming and the crane stacker's timing input are inside the arcade and go through the
key map, covered by the play-throughs above. Two of my first probes were wrong rather than the toys
being broken — the pixel canvas one counted every cell in a grid that is never empty — which is
worth writing down, because a bad probe reads exactly like a broken toy.

## 6. The microphone toy — it does not exist

There is no `getUserMedia` anywhere in this repo. The three files that match "microphone" all
contain the word in prose: a line of invented radio chatter, a sentence in Room Tone saying nothing
was ever played into one, and a quiz question about how many devices in your home have one. The
blow-out-the-candles toy has never been built. Nothing to test and nothing to fix — flagged rather
than invented.

## Also done: the accelerometer enhancement

Layered on top of the existing mouse-shake, never instead of it. The snow globe already had tilt.
**The gratitude jar now responds to shaking the actual phone** — it feeds the same `shake`
accumulator the drag does, so the lid gives way at the same threshold and there is only one rule
about how hard is hard enough, and the slips get a real shove so it looks shaken too. Verified on
the ungated path: shake 0 → 13173, the hint moved to "the lid is not going to hold". iOS asks for
permission on the first touch of the jar.

# Phone-friendliness pass — tier 2 (the broad audit)

Everything below was measured on a real 320px touch context (iPhone SE profile, `hasTouch` and
`isMobile` both on), not by reading CSS. The whole cabinet was swept four times: once to find the
problems, twice mid-repair, once at the end.

## The sweep, start to finish

| | before | after |
|---|---|---|
| toys overflowing the viewport | 5 | **0** |
| toys that crashed or threw | 0 | 0 |
| toys with a control under 44px | 148 | 98, and every one that is left is prose links or a listed exception |
| worst single toy's small-target count | 28 | 11, of which 9 are inline links in body text |

## The five that overflowed

Each was measured to the exact element rather than guessed at.

- **retro-os, 150px.** `makeWindow` wrote whatever width the caller asked for, so the 350px About
  window opened at `left:120` on a 320px screen and two thirds of it was off the side. Windows now
  clamp their width and x to the viewport, and their height to what is left below the title.
- **conspiracy, 57px.** My own corkboard rebuild. Grid items default to `min-width:auto`, and the
  meter's two `white-space:nowrap` labels were sizing the whole board. `min-width:0` on the board's
  children, the meter wraps, and the note and card padding tightens under 420px.
- **fiction-wiki, 63px.** A `<select>` takes its width from its longest `<option>`, and two of the
  source titles are long. Capped, and on a phone the filter row goes full-width.
- **arcade, 13px.** Two causes. `fit()` did `Math.max(1, Math.floor(scale))`, so below 1x the canvas
  stayed pinned at its full 320px and hung off the side; under 1x it now takes the exact fractional
  fit and above 1x it still snaps to whole integers, so the pixels stay crisp where it matters
  (measured: 0.875x at 320, 1x at 390, 2x at 768, 3x at 1440). And the d-pad plus four face buttons
  wanted 408px, so on a phone the face buttons wrap into two rows beside the d-pad.
- **close-call, 14px.** Same `min-width:auto` grid trap, plus a `flex:none` row that could not
  shrink to fit a long near-Earth-object name. Both fixed, names ellipsis now.
- **on-this-day, 50px** — found on the re-sweep, not the first one, because it only appears once the
  feed has loaded. The category strip is a segmented control, so it scrolls sideways rather than
  wrapping and breaking its shared borders.

## Touch targets

The single highest-leverage fix was shared: **`#lc-back` was 38×38 in all 149 toys**, and the sound
toggle in `lc-sound.js` was 38×38 everywhere it appears. Both are 44 on a coarse pointer now. That
alone took 148 toys down to 134.

The rest was done by profiling every undersized control across the cabinet by selector, then
injecting a `@media (pointer:coarse)` block per toy — 107 toys patched from one measured plan rather
than 107 guesses. Then re-measured, and the cases where a blanket `min-height` had distorted
something got corrected by hand:

- **boring-day: reverted.** A 366-cell year heatmap cannot have 44px cells; the squares became tall
  rectangles and the calendar stopped reading as a calendar. Left at 20×20 deliberately.
- **retro-os: a 44px title bar is not a title bar.** The window chrome settles for a 28×24 close
  button in a 30px bar; everything else in that toy gets the full 44.
- **marble-run's round swatches stayed round** (40×40) instead of becoming 26×44 ovals.
- **The `#snd` icon toggle in seven toys** got a square 44 rather than a 15px-wide sliver.
- **Checkboxes** (right-now, paper-airplane) stay 22px — a checkbox cannot usefully be 44 — and
  their labels became the 44px target instead.

## Wide-layout and mouse-only assumptions

- **starship-scale.** Two real collisions: the tools stacked in the top-right corner ran straight
  across the title, and the bottom rail was drawn underneath the back pill because the 62px reserve
  that keeps them apart had been dropped on narrow screens. Tools are a full-width bar on a phone
  now, the title sits below them, and the reserve is back.
- **color-organ.** Its back pill lives top-left, and the centred title ran under it. Header offset.
- **undersea-cables.** Said "**Hover** the map to pick out a cable" on a device with no hover.
  Tapping already worked; the sentence now says whichever is true of the device reading it.
- **escape-room.** Landed you 264px down the page with the keyboard up, because it focused the
  answer field on every room build — so you never saw the room. The cursor only lands itself where
  there is a real one, and "Click anything in the room" reads "Tap" on a phone.
- I scraped the rendered text of all 149 toys for mouse-only instructions ("hover", "right-click",
  "scroll wheel", "arrow keys"). Only those two were real. The rest were code comments, deliberate
  copy (the button in useless-buttons that "cannot be caught by a mouse"), or already
  device-agnostic ("click, tap or press space").

## The fiction wiki's 500 entries

The list itself was already fine on a phone — single column under 560px, 120 rows a page behind a
48px "load more", a 16px input that will not trigger iOS zoom. The problem was the sticky control
block: **366px of a 568px screen**, permanently. The search box stays put; the two selects, the
shuffle button and the category chips fold behind a disclosure that says how many filters are on, so
a folded panel is never the reason a search looks empty. **366px → 122px.** Verified the fold, the
count, and that chip filtering still narrows the list (38 rows) with no errors.

There is no 100-object museum in this repo; the nearest things are unknown-sport at 107 items and
hidden-thing at 36, and neither has a list/search UI to fix. Flagged rather than invented.

## Verification

- **Three arcade games played start to finish on real touch** — Serpentine, Rally and Wallbreak,
  driven through CDP touch events on the on-screen pad, not synthetic key presses. Menu navigation,
  start, ten direction inputs each producing a distinct frame, pause, and ESC back to the menu all
  work; snake was played to its actual death and the 2.6s game-over returned to the menu on its own.
- **The Konami code by swipe** — eight real swipes (up up down down left right left right) followed
  by a two-finger tap opened the about dialog. Instrumented the swipe listener to confirm all eight
  directions were read correctly before the tap.
- **A stratagem code by swipe** — right right up up down brought up MORNING BREW, fits a 320px
  screen, attribution line intact.
- **~22 toys looked at, not just measured**, across categories: chladni, tactical-loadout,
  city-builder-map, rhythm-sequencer, apocalypse-quiz, starship-scale, espionage, liminal-swipe,
  six-degrees, undersea-cables, boring-day, color-test, retro-os, pixel-canvas, color-organ,
  marble-run, escape-room, arcade, fiction-wiki, on-this-day, plus the hub itself.
- Final sweep: 149 audited, 0 overflowing, 0 crashed, 0 JS errors.

## Where a touch equivalent could not be made to work

Only three, and all three are deliberate:

- **boring-day's heatmap cells** stay at 20×20. Thirty-one columns of a calendar year will not fit
  44px cells on a phone, and stretching them vertically stopped it reading as a calendar.
- **retro-os's window close button** stays at 28×24. A 44px title bar is not a 1991 title bar.
- **Inline links inside body text** — source credits, licence lines, "where this data comes from"
  footers — are 11-17px tall across about 90 toys. Making a link inside a sentence 44px tall would
  break the sentence. These are what the remaining small-target count is almost entirely made of.

## Still to do

Nothing outstanding from the phone-friendliness brief. Not yet committed or deployed.

---

# Phase 3 — the Windows 98 OS features

All four built and wired into the desktop shell. The three modules they lean on were written in
an earlier sitting and sat unwired because the phone pass had `public/index.html` open; this is
the sitting that connected them.

## What is in the Start menu now

Three entries under a rule at the foot of the menu, where the real one put the things that end a
session. All three close the menu first — a shutdown screen with the start menu still hanging
open underneath it is a machine that has not finished the thought.

**Restart** runs a power-on self test and then genuinely reloads. The BIOS is invented: no real
vendor string, no real copyright line, no real POST code table. It counts memory up to 65536K
because that is the part of a POST anybody actually watched, and it reports the cabinet's own
figure — `Detecting drawers .............. 149 found` — read off the page rather than written
into the file, so drawer 150 does not need anybody to remember this line exists.

**Shut Down** parks on *It is now safe to turn off your computer*, and clicking anywhere reloads.
The screen ignores clicks for its first 420ms, which is not decoration: without it the click that
chose Shut Down lands on the screen it just asked for and dismisses it instantly.

**Rest** dims to near-black, brings up a Room Tone bed at 0.34 and shows the time. Any key, click
or wheel ends it, deliberately — a mode you have to work out how to leave is a trap, not a rest.

## The messy desktop

A switch in Display Properties → Settings, drawn as a plate with a travelling knob and a printed
legend either side rather than a tickbox, because the brief asked for a physical switch and a
tickbox is not one.

**It is a disturbed desk, not a random one.** Every icon stays near the cell it came from and is
knocked askew. Scattering to genuinely random coordinates was tried and reads as a bug: things
end up three deep in one corner with a bare stretch beside them, and nobody believes it. The
offset is bounded by the cell — 0.62 of its width, 0.42 of its height — so two neighbours can
lean together without one landing on top of the other.

It is built *on* free mode rather than beside it. Scattering is `enterFree()` plus an offset, so a
scattered icon can still be picked up and put somewhere on purpose, and Auto Arrange is still the
way out of it.

**The lean is derived, not stored.** `tiltFor()` hashes the icon's own position key, so the same
icon leans the same way on every load. Storing a tilt per icon would have meant a second record
that has to stay in step with the positions, and re-rolling them on load would make the desk
rearrange itself behind your back every time you came back. Verified: same six tilts before and
after a reload.

The tilt goes through a `--tilt` custom property rather than a plain transform, because an icon
still has to shrink when it is held and fade when it is dragged — an inline `transform` would have
won against the `.holding` rule and silently killed the touch feedback the phone pass had just
added.

## The soundtrack that follows the scheme

Room Tone's engine at 0.22, which is background. The brief asked for four moods and Room Tone
already had beds for all four, so this is a mapping and not a fifth engine: **library** is the
office one (air handling, distant paper), **campfire** is the warm acoustic one, **rain** is the
gentle noise, **underwater** is underwater. All twenty schemes map onto those four, keyed by
scheme *name* rather than index so that inserting a scheme into the list cannot silently shift
twenty assignments by one.

**Nothing can play on load, and that is enforced rather than hoped for.** A Web Audio context will
not start without a gesture, so when the pref is already on from a previous visit the bed is armed
and waits for the first thing the visitor does. Verified: a fresh page with `music:'on'` already
stored sits silent until a gesture arrives.

Resting borrows the engine and hands it back. Changing the colour scheme while the screen is
dimmed does not yank the room out from under it. Verified end to end: Wheat playing campfire at
0.22 → rest at 0.34 → back to campfire at 0.22, still running.

## Two closures, one contract

The icons and the settings panel are different IIFEs and neither can see the other's variables.
Rather than reach across, the switch dispatches `w98:messy` and reads the answer back off
`documentElement.dataset.w98Messy`, and the scheme publishes its chosen bed as
`dataset.w98Tone` for the Rest button to pick up. Whether the desk is messy stays the desktop's
fact to keep.

## Verified

Driven in a real browser, both modes, at 1280px and 390px.

- All four features exercised through their actual controls: the three menu entries, the lever,
  the music chips, and a scheme change while music was playing.
- **Restart really reloads** and **Shut Down really powers back on** — both confirmed by counting
  main-frame navigations, not by trusting the screen.
- **Catalogue mode is untouched**: desktop hidden, 149 cards, no power row, no lever, no rest or
  POST layer, no audio, no overflow, no page errors, and the Konami code still fires.
- **Settings persist**: music on and messy on both survive a reload, and the messy class comes
  back with the icons.
- No horizontal overflow at 390px in desktop mode, with the settings panel open, or with the
  start menu open.
- Zero page errors across every run.

## Not done

- The hall of fame and the retrofit of the other fifty-odd eggs are Phase 6's actual work. The
  registry and its panel exist and are still unwired — there is no trigger for the tracker yet.
- Phase 5, the four-toy consolidation, is untouched, so `/generator/` still does not exist and the
  Tatu-and-Patu voice pack parked in Phase 1 is still parked.
- The generator-family ambience pass reached 22 of 49 toys; 21 are still silent.

---

# Phase 4 — the visual differentiation pass

## The premise was already satisfied, and the audit says so

Phase 4 asks for toys "that ended up sharing generic or similar-looking styling". All 149 were
loaded in a real browser and their computed `background-color` + `background-image` compared:

**Zero shared backgrounds. 149 toys, 149 distinct surrounds, no duplicate pairs at all.**

That is the same check that failed during the generator pass — it caught dungeon-room and
shanty-ifier sharing a gradient — so it is a check with a track record of finding things, and this
time there is nothing to find. The retroactive look-and-feel sweep the phase was written for has
effectively already happened, across the generator pass and the batches before it.

What the audit *did* find was worse and not a styling problem at all.

## Thirty toys made sound and ignored the mute switch

The cabinet-wide mute lived in `LCSound.play()`, which means it only ever muted toys that asked
their cues *through* LCSound. Thirty toys build their noises straight off the shared bench or
their own context — the aquarium's bubbles, the dominoes, the marble run, the reaction bench, the
hourglass — and went on making them with the switch off.

A switch that silences some of the cabinet and not the rest is worse than no switch: it tells you
it worked and then it does not.

**The fix is one gate, not thirty edits.** `lc-audio.js` now puts a gain between the shared bench
master and the speakers, and every toy built on that bench passes through it already — twenty-one
of the thirty were fixed without their files being opened. The preference is read from storage
rather than from LCSound, because lc-sound.js loads *after* lc-audio.js and calls into it; the
dependency only runs one way, and `LCSound.set()` pushes changes back through
`LCAudio.setMuted()`. The change is ramped over 40ms rather than stepped, because cutting a
running voice to zero is itself a click — a noise made by the mute button.

`LCSound.gate(ctx)` does the same job for a toy that owns its AudioContext outright.

## Where the line is drawn, and why

The gate deliberately does **not** reach anything hung directly off `ctx.destination` rather than
off the bench master. Room Tone's engine does exactly that, on purpose.

**The mute governs cues played at you. It does not silence an instrument you came to play.** A
theremin, a Chladni plate, a colour organ, a step sequencer, the Morse key, the radio and Room
Tone itself are all things you start yourself, with their own stop button and their own level.
Silencing those from a switch thrown on another page reads as a broken toy, not a respected
preference. Three of the ten own-context toys are on the other side of that line and are now
gated: the static channel (static is played *at* you), the Zone's ambience, and the useless
buttons, whose every noise is a cue on a click.

## The other half: the switch was missing too

The preference applying on a page is no use if there is no way to set it there. Nineteen bench
toys and the three gated own-context ones had no switch at all, so somebody on the aquarium had
to go and find another drawer to turn sound off. All twenty-two now mount it.

## Verified

- **Measured, not inferred.** An analyser tapped after the gate: the aquarium peaks at 124
  unmuted, **0** muted, 116 unmuted again. Whack-a-mole 114 before the switch is clicked, 0 after.
- **The preference carries across toys in one browser session**: muted on whack-a-mole, marble-run
  came up with its gate at 0 and its button showing muted and measured 0; unmuted there, it
  measured 110 and the aquarium agreed.
- **Honoured at build time**, not just on change: a fresh dominoes with the preference already
  stored built its gate closed and measured 0.
- **Room Tone still plays with the mute on** — peak 162 — which is the line above, working.
- All twenty-two switches present, none overlapping the back button, no overflow.
- **Full-cabinet sweep after the change: 149 toys, zero page errors, zero horizontal overflow.**

## Not done

- **97 toys still make no sound at all** and 59 have no animation. Both are real gaps against the
  standing ambience rule, but they are additions rather than differentiation, and roughly a fifth
  of them are about to be merged away by Phase 5 — doing them first would be work thrown out.
- The font clusters remain: 40 toys on the system sans, 38 on Iowan Old Style. Unlike the
  backgrounds these are not byte-identical surrounds, and several are deliberate pairs on toys
  that look nothing alike otherwise.

---

# Phase 5 — the Generator

Fourteen drawers became fifteen voices in one. The hub reads **136** and the drawer that replaced
them is No. 150.

## The decision the merge turned on

A voice repaints the **whole page**, not just the middle of it.

Each of these toys had a room built for it during the generator pass — the ruled biro note, the
pegboard workbench under a fluorescent tube, the memo in genuine triplicate, the green CRT —
specifically so that no two would look alike. A merge that flattened them into one Generator room
would have spent that work to save effort. So a voice brings its palette, its type, its surround
and its renderer, and the shell is only the door between them. Measured at the end: **15 voices,
15 distinct page backgrounds, no two the same.**

## How the port was done, and why that way

The insight that made this tractable: a voice's markup goes into the live document, so a toy's
original script can run **unchanged** inside `mount(root)` — `document.getElementById` still finds
its own elements. So the port is a move, not a rewrite. The word lists, the assembly and the room
are the originals.

That matters because the prose *is* the toy. Retyping it is how a merge quietly loses things, so
it was checked rather than assumed: **1,040 long strings across the fourteen originals, zero
missing from the ports.**

## Three real bugs, all found by loading it

1. **A voice's CSS is scoped into the room** on the way in, which is the only way two voices can
   both style `.sheet` without meeting — but scoping puts the voice's `:root` variables on the
   room rather than the document, so the page *behind* it kept the shell's default and only the
   middle of the screen changed. Caught by measuring computed background on two voices and getting
   `rgb(21,21,27)` twice. Voices now declare the handful of variables the page itself reads.

2. **Timers outlived their voice.** A pending `setTimeout` in the pitch deck woke up while the TV
   voice was on screen, went looking for an element that no longer existed, and threw from
   `seedround.js` in front of a visitor who was not looking at it. Listeners were already tracked;
   timers were not. Each voice now shadows `setTimeout`, `setInterval` and `requestAnimationFrame`
   inside its own closure and carries a dead flag, so work already in flight at teardown does
   nothing rather than something wrong.

3. **The shanty kept its verse engine in a sibling file** (`verse.js`), which the port dropped, so
   that voice failed to mount at all with `makeVerses is not defined`. It travels with the voice
   now.

## The new voice pack

**The Contraption Bureau** is the nonsense-inventor pack Phase 1 parked waiting on this phase. It
is inspired by a tradition — two visitors explaining the ordinary world back to you as an
elaborate invention — and it is **not those characters**: no names, no likenesses, nothing quoted,
everything written here. The rule that makes it work is that the nonsense has to be rigorous. Each
device follows from its premise, each step from the last, and the caution at the bottom is a real
consequence of the mechanism described. A random absurdity is not funny; a wrong thing argued
carefully is.

## Nothing was thrown away

All fourteen old URLs still answer. Each is a redirect stub that `location.replace()`s to its
voice — replace rather than assign, so Back returns where the visitor came from instead of
bouncing them through the stub again. Verified: **all 14 land on the right voice, mounted**, and
Back from one goes to the hub.

The footer used to carry the drawer count as text, which meant every batch had to remember to
change it and this one would have left it reading 149 forever. It counts the cards it can see.

## Verified

- All 15 voices mount, tear down without leaking state into each other, and were driven through
  their own controls with zero page errors.
- 15 distinct page backgrounds; the W98 desktop picked the Generator up and holds **no stale icons**
  for any merged toy, without being told about the change.
- The one LLM-backed voice degrades properly: rate-limited, it prints *registry unreachable* and
  the house message rather than throwing.
- Full cabinet sweep after the merge: **150 pages, zero page errors, zero horizontal overflow.**

## Not done

- The other three consolidations in the brief — Design Studio, Sound Lab, History Desk — are not
  built. This phase's Generator was the one blocking Phase 6.
- 97 toys still make no sound and 59 have no animation, unchanged from the Phase 4 note.

---

# Phase 6 — the achievement tracker

Run last, as the brief asked, so it tracks final toy identities. That mattered: three of the eggs
below live in toys that Phase 5 merged an hour earlier, and their entries name `generator` rather
than the drawers they used to be.

## The catalogue is real, and so is the number

**43 achievements**, taken from the egg tables the batches actually wrote down in this log — the
seventeen from batches 15–20, the nineteen from the easter-egg pass, the five arrow codes and the
front door's own. Every one has a hint. No placeholder entries and no rounded-up total.

The catalogue lives in `shared/lc-achievements.js`, not in the toys. That is load-bearing and it
was wrong first: the file said each toy registers its own, while `complete()` — the hall-of-fame
unlock — measures against whatever is defined on the current page. On a toy page defining three
eggs, "you have found everything" would go true at three. The catalogue is central so the total is
the same number on every page, and `define()` only ever adds.

Entries may carry `was`, an old id, so a renamed toy does not cost anyone a find.

## The way in

Peel a card and **keep holding**. At 900ms a small mark appears in the corner of the note; it opens
the list.

It is there because peeling is already the cabinet's oldest hidden thing, and anybody who has found
the notes has exactly the habit that finds this. Verified at the threshold rather than assumed: a
quick flick arms nothing, 400ms arms nothing, 1200ms arms it, and no mark is left behind afterwards.

A locked row shows its hint and withholds its name — silent is a blank, explicit is not an egg any
more. A test asserts no secret's name appears in the locked list.

## What actually reports

**14 of the 43.** The front door's five (the old code, the reshuffle, the hat-tip, the tracker
itself, the desktop icon that is not a drawer), all five arrow codes, and four in the drawers:
the declassified file left open, the bureaucracy that sets you free, the loot desk's *Impossible*,
and the guestbook signature.

The five arrow codes report from inside `open()` rather than from each matcher, because a code can
arrive from the keyboard, from a swipe or from the public API, and one call site cannot go out of
step with the other two.

## What does not report, and what that means

**Twenty-nine of the catalogue's entries are listed but not yet wired.** They are named in the
registry with their hints, so the tracker tells the truth about how many exist — but they cannot
currently be earned.

The consequence has to be said plainly: **`complete()` is unreachable today, so the hall of fame
cannot be unlocked by anybody.** That is not a bug in the unlock; it is the retrofit being
unfinished. The hall of fame itself is not built at all — it needs the shared cross-visitor store
the guestbook and the bottle use, which is a server change and its own sitting.

Wiring the rest is mechanical rather than hard: each is one `LCAch.fire('id')` on the line where
the egg already does its own thing, plus the script tag. The four done here are the pattern.

## Verified

- The registry: first-fire-only, listener isolation, persistence across reload, and **private mode**
  — with `localStorage` throwing on every access it loads, fires and reports with no page error.
- Driven through the real handlers on the hub: the Konami code, an arrow code and the hat-tip each
  recorded exactly once, and the panel read *4 of 43 found* with the right names.
- The loot desk's egg was forced onto its real branch by pinning the generated name, and recorded.
- Full cabinet sweep: **150 pages, zero page errors, zero horizontal overflow.**

---

# Phase 6, finished — all forty-three eggs report

The retrofit the last entry left undone. **43 of 43 catalogued achievements now fire**, so
`complete()` is reachable and the hall of fame has an unlock condition that can actually be met.

## Two errors in my own catalogue, found while wiring

- **`paradox.overflow` and `dream.thissite` were filed under `generator`.** They are not: the
  paradox machine and the dream decoder were given a language model in Phase 1 and were never on
  the merge list. Only three of the eggs really moved into the Generator — the ship's log's 15
  April, the advisors' too-long reign, and the talking gun's one sincere line. Corrected.
- **The Stockholm street egg fired for every street name.** `stockholmMatch()` returns `null` for
  anything it does not recognise and the call went in on the line below it, so naming a road
  anything at all counted. It now fires only on a real match, checked both ways: *Drottninggatan*
  fires and *Cooper Street* does not.

## Four toys were left with a syntax error, briefly

Inserting a statement "before" an anchor line is only safe when that line begins a statement. Four
anchors were continuation lines — inside a multi-line string concatenation in the snow globe, the
type ghost and the apocalypse quiz, and inside an object literal in what-beats-this — so the
insert landed mid-expression and broke the page outright.

Caught by the full-cabinet sweep reporting `Unexpected token 'if'` on three of them, and by then
parsing every inline script of every toy that had been touched, which found the fourth. All four
moved to real statement boundaries; every touched file's script now parses.

The lesson is worth keeping for the next batch of these: a mechanical wiring pass needs a syntax
check per edited file, not a smoke test at the end. Three of the four would have shipped otherwise
— the fourth toy's error did not surface as a page error in the shape the sweep was watching for.

## Where each egg reports from

Mostly one line at the point the egg already does its own thing. The exceptions are worth noting:

- **The five arrow codes** report from inside `open()`, not from the matchers, because a code can
  arrive by key, by swipe or through the public API.
- **The arcade's shield** reports from `games/invaders.js`, since the unlock lives in the game
  module rather than the page; the arcade now loads the registry for it.
- **Three eggs report from Generator voices** and needed the shell to load the registry.
- **The card note** reports at 45% of a peel, where the note becomes legible, rather than at the
  full turn that arms the tracker mark.

## Verified

- Every catalogue id has a call site: **43 of 43, none missing.**
- Eggs driven for real through their own controls, not stubbed: the library of Babel, the dream
  about this website, the machine declining to imagine away the internet, the morse egg, the
  Stockholm street with a negative control, and the hundredth fortune cookie reached by cracking a
  hundred of them.
- The loot desk's egg forced onto its real branch by pinning the generated name.
- The hub's own five driven through the real handlers, and the panel read correctly.
- **Full cabinet sweep: 150 pages, zero page errors, zero horizontal overflow.**

## Still not done

The hall of fame itself. It needs the shared cross-visitor store the guestbook and the bottle use
— a server change, and its own sitting. The unlock condition it depends on now works.

---

# The hall of fame

The last thing on the backlog. A shared, permanent wall that only somebody who has found all
forty-three hidden things can sign — on the same infrastructure as the guestbook and the bottle,
because other people have to be able to see it.

## The honest bit about verification

**The server cannot check that you actually found everything, and it does not pretend to.** The
count arrives from the browser, where the tracker keeps it, and anybody who can open a console
could send `43` without having found anything.

That is a decision rather than an oversight. Verifying it properly would mean the server keeping a
per-visitor record of which eggs each person had found — which is exactly the surveillance the
tracker was built to avoid, and the reason its progress lives in `localStorage` and never leaves
the browser. The wall is a nice thing at the end of a long game, not a security boundary, and it is
not worth watching everybody to protect it.

What the server *does* enforce is everything that protects other people: the text goes through the
same cleaner as every other shared board, the write gate is the guestbook's, the claimed count has
to be internally consistent rather than whatever was in the request, and there is one row per
browser. Verified: a visitor with 1 of 43 is refused with `not_finished`.

## One row per browser, not one per signing

The token is the primary key and a second signing replaces the first. The wall is a record of who
got to the end, not a conversation — letting people write on it repeatedly would make it a
guestbook with a harder door. Replacing rather than appending also means nobody has to live
forever with the first thing they typed.

## It is not fetched until it is earned

The wall is only requested once the list is complete. Asking earlier would tell the server that
somebody had opened the tracker, which is not its business. Verified by counting requests:
**zero calls to `/api/hall` with the tracker open at 1 of 43, exactly one at 43 of 43.**

## Verified

- Incomplete: no wall in the panel at all, just the private-copy footer.
- Complete: the wall appears, loads, and offers the form.
- Signing works and the wall goes from one name to two, with your own row marked.
- **A second browser sees both names** and is correctly not marked as having signed.
- A visitor at 1 of 43 attempting to sign is refused.
- Rate-limited signing degrades to the house wording rather than failing silently — seen for real,
  because the earlier tests had used the hour's budget up.
- Full cabinet sweep: 150 pages, zero page errors, zero horizontal overflow.
- Test rows removed from the local database. Production keeps its own on the Railway volume.

## The backlog is now empty of the six phases

Phase 1 through Phase 6 are all done. What remains is what those phases explicitly deferred: the
other three consolidations (Design Studio, Sound Lab, History Desk), and the 97 toys that still
make no sound and 59 that have no animation.

