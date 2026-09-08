# Overnight batch — progress log

*(Summary section is written at the end of the run and lives at the top.)*

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

