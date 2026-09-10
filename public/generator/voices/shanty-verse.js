/* ================================================================== *
 *  Five registers.
 *
 *  Every line here was written for this page. Nothing reproduces a
 *  real shanty, chantey, ballad or song, and none of the five is a
 *  reskin of the others: each has its own shape on the page, its own
 *  metre, and its own idea of what a verse is for.
 *
 *    pirate      four short lines, rhymed in pairs, all bluster
 *    olde        a chronicle stanza — no rhyme, long clauses, dated
 *    shanty      a lead line, a shouted response, a hauling refrain
 *    bard        six lines closing on a couplet, abstractions addressed
 *    noir        four flat sentences and a kicker; no rhyme anywhere
 * ================================================================== */

/* ---- pulling something usable out of a sentence ------------------- */
const STOP = new Set(('a an the my your his her its our their this that these those i me you he ' +
  'she it we they am is are was were be been being do does did have has had will would shall ' +
  'should can could may might must of to in on at with for from by into over under and but or ' +
  'so then than as if when while because just really very quite about got get up down out off ' +
  'again still even also too much many some any all no not').split(' '));

const KNOWN_VERBS = ('walked ran drove rode sat stood waited queued worked wrote read cooked ate ' +
  'drank slept woke cleaned washed fixed broke lost found bought sold paid called missed caught ' +
  'carried climbed swam sang argued laughed cried packed moved planted dug painted built burned ' +
  'spilled dropped forgot remembered watched listened tried failed finished started quit hid ' +
  'searched wandered stumbled arrived left returned').split(' ');

function readInput(raw){
  const text = String(raw || '').trim();
  const words = text.toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).filter(Boolean);
  const content = words.filter((w) => !STOP.has(w) && w.length > 2);

  let verb = content.find((w) => KNOWN_VERBS.indexOf(w) >= 0) || '';
  const nouns = content.filter((w) => w !== verb);

  // The longest surviving word tends to be the one the sentence is
  // actually about — but "-ing" and "-ed" words are usually the verb in
  // disguise, and "the arguing" reads badly where "the printer" reads
  // well. Nouny words get first refusal; the rest are the fallback.
  const nouny = nouns.filter((w) => !/(ing|ed)$/.test(w));
  const byLength = (list) => list.slice().sort((a, b) => b.length - a.length)[0];
  const thing = byLength(nouny) || byLength(nouns) || 'day';
  const other = nouns.find((w) => w !== thing) || '';

  return {
    raw: text,
    plain: text.replace(/[.!?]+\s*$/, ''),
    verb: verb || 'went',
    pastVerb: verb || 'went',
    thing: thing,
    other: other,
    nouns: nouns,
    empty: content.length === 0
  };
}

const pick = (a, r) => a[Math.floor(r() * a.length)];
function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

/* Seeded so the same sentence gives the same verse until you ask again. */
function rng(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ================================================================== *
 *  1. PIRATE — four short lines, rhymed in pairs
 * ================================================================== */
/* Rhymes have to be chosen as pairs. Picking each line on its own is
   how you end up with a couplet that rhymes "smile" with "tall". */
const PIRATE_OPEN = [
  ['Now listen here, ye scurvy lot,', 'I had me a day and it weren&rsquo;t no yacht &mdash;'],
  ['Gather round, ye salted crew,', 'there&rsquo;s trouble brewin&rsquo; and here&rsquo;s the stew &mdash;'],
  ['Belay yer moanin&rsquo;, hear me true,', 'I&rsquo;ve a tale to turn yer bilges blue &mdash;'],
  ['Avast! and hold yer grog a while,', 'I&rsquo;ve seen a thing to curl a smile &mdash;'],
  ['Ye think ye&rsquo;ve suffered? Hear me now,', 'I&rsquo;ve wrestled worse than any sow &mdash;']
];
const PIRATE_CLOSE = ['and that be all I&rsquo;ll say on that.', 'so pass the bottle, that&rsquo;ll do.',
  'and if ye doubt me, walk the plank.', 'and I&rsquo;ll not speak of it again.'];
const PIRATE_TAG = ['Arr.', 'So there.', 'Aye.', 'And so it were.', 'Mark it in the book.'];

function pirate(c, r){
  const t = c.thing;
  const open = pick(PIRATE_OPEN, r);
  const body = pick([
    ['I ' + c.pastVerb + ' at the ' + t + ' till me arms was lead,',
     'and by eight bells I wished that I were dead.'],
    ['the ' + t + ' rose against me like a squall,',
     'and I gave it nothing, nothing at all.'],
    ['I ' + c.pastVerb + ' where no honest man should tread,',
     'and what I found there, I&rsquo;ll take to me bed.'],
    ['&rsquo;twas ' + t + ' to port and ' + t + ' to lee,',
     'and not one blessed soul came helpin&rsquo; me.']
  ], r);
  return [open[0], open[1], body[0], body[1], pick(PIRATE_CLOSE, r), pick(PIRATE_TAG, r)];
}

/* ================================================================== *
 *  2. YE OLDE — a chronicle entry. No rhyme; long clauses; a date.
 * ================================================================== */
function olde(c, r){
  const t = c.thing;
  const day = pick(['the feast of Saint Alwin', 'the third day after Lammas', 'the eve of the Ember Fast',
                    'the morrow of Candlemas', 'the ninth day of the waxing moon'], r);
  return [
    'And it came to passe upon ' + day + ',',
    pick(['that thy servant did rise in poore humour,', 'that the writer of this did stirre from his straw,',
          'that one of this parish did wake before the bell,'], r),
    'and did betake himself unto the matter of the ' + t + ',',
    pick(['the which is a labour fitte for no Christian soule.',
          'wherein he prospered not, neither did he greatly faile.',
          'and found it much as it was left, which is to say ill.',
          'and there abode longer than any man ought.'], r),
    pick(['Verily he ' + c.pastVerb + ', and it availed him nothing.',
          'He ' + c.pastVerb + ' full sore, and no man marked it.',
          'And he ' + c.pastVerb + ', as is the custom of the wretched.'], r),
    pick(['Deo gratias. It is ended.', 'Here endeth the daye.', 'So sayeth the recorde, and it lieth not.',
          'And the beastes were fed, and that is all the good of it.'], r)
  ];
}

/* ================================================================== *
 *  3. SHANTY — lead, response, lead, response, then the haul
 * ================================================================== */
function shanty(c, r){
  const t = c.thing;
  const resp = pick(['Haul away, haul away,', 'Heave, me boys, and heave again,', 'Roll and go, roll and go,',
                     'Pull for the shore, boys,'], r);
  const ref = pick([
    'and we&rsquo;ll all go home when the work is done.',
    'and the tide won&rsquo;t wait for the likes of us.',
    'and the morning finds us where it left us.',
    'and the rope goes on though the hands give out.'
  ], r);
  return [
    'Oh, I ' + c.pastVerb + ' at the ' + t + ' at the break of day,',
    resp,
    'and the ' + t + ' didn&rsquo;t care what I had to say,',
    resp,
    pick(['So it&rsquo;s one for the trouble and two for the pay,',
          'So it&rsquo;s heave for the morning and heave for the night,',
          'So it&rsquo;s hand over hand and we&rsquo;ll not complain,'], r),
    ref
  ];
}

/* ================================================================== *
 *  4. BARD — six lines, the last two a couplet, an abstraction addressed
 * ================================================================== */
function bard(c, r){
  const t = c.thing;
  const abstract = pick(['Fortune', 'Patience', 'Labour', 'Morning', 'Custom', 'Weariness'], r);
  // Line four ends on "share", so line five has to answer it, and the
  // last two lines are chosen together or they are not a couplet.
  const fifth = pick([
    'of nothing, weighed and measured out with care.',
    'of what the world calls plenty. I was there.',
    'of dust, and of the promise of more air.'
  ], r);
  const couplet = pick([
    ['Yet here I stand. The candle has not died,',
     'and I will meet tomorrow, having lied.'],
    ['And still the morning comes, as mornings must,',
     'and I will rise, and grumble, and be just.'],
    ['But mark me: I have borne it, and I bear',
     'the same again, and call the burden fair.']
  ], r);
  return [
    'O ' + abstract + ', that keeps no ledger and forgives no debt,',
    pick(['what quarrel hast thou with a quiet man?', 'why set thy hand against so small a thing?',
          'why dost thou visit me and not my neighbour?'], r),
    'This day I ' + c.pastVerb + ', and had for all my pains',
    'the ' + t + ' &mdash; which is to say, I had my share',
    fifth,
    couplet[0],
    couplet[1]
  ];
}

/* ================================================================== *
 *  5. NOIR — flat past tense, no rhyme, one simile, a short kicker
 * ================================================================== */
function noir(c, r){
  const t = c.thing;
  return [
    pick(['The ' + t + ' came at me like a bill I&rsquo;d forgotten.',
          'It started with the ' + t + '. It usually does.',
          'The ' + t + ' was waiting when I got there, and it had all day.'], r),
    pick(['I ' + c.pastVerb + '. Nobody stopped me. Nobody ever does.',
          'So I ' + c.pastVerb + ', because that&rsquo;s the job.',
          'I ' + c.pastVerb + ' the way you do when the alternative is thinking.'], r),
    pick(['The rain had opinions about it.', 'Somewhere a kettle was boiling for somebody else.',
          'The clock on the wall had given up years ago and nobody had told it.',
          'Outside, the afternoon was doing its impression of evening.'], r),
    pick(['It went the way these things go: slowly, and then all at once.',
          'By the end of it I knew two things, and neither one was useful.',
          'I got what I came for. I just didn&rsquo;t want it any more.'], r),
    pick(['That&rsquo;s the trouble with a day like that.', 'Some days you win. This was the other kind.',
          'I went home. The ' + t + ' stayed where it was.', 'Tomorrow it&rsquo;ll be there again. So will I.'], r)
  ];
}

const REGISTERS = [
  { id: 'shanty', name: 'Sea shanty',   note: 'lead, response, and a line to haul on',  fn: shanty },
  { id: 'pirate', name: 'Pirate',       note: 'four short lines and a great deal of noise', fn: pirate },
  { id: 'olde',   name: 'Ye olde',      note: 'a chronicle entry, dated and unrhymed',  fn: olde },
  { id: 'bard',   name: 'Shakespearean', note: 'six lines closing on a couplet',        fn: bard },
  { id: 'noir',   name: 'Noir',         note: 'flat sentences, one simile, a kicker',   fn: noir }
];

function makeVerses(text, salt){
  const c = readInput(text);
  const base = hash((c.plain || 'nothing') + '|' + (salt || 0));
  return REGISTERS.map(function(reg, i){
    const r = rng(base + i * 7919);
    return { id: reg.id, name: reg.name, note: reg.note, lines: reg.fn(c, r) };
  });
}
