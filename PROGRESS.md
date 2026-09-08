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

