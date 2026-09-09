# Overnight batch — progress log

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

5. **Another session was committing to `main` while I worked.** Its last commit was 11:55 and the
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
