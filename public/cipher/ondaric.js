/* ================================================================== *
 *  ONDARIC
 *
 *  A small constructed language, built so that a message can go into
 *  it and come back out unharmed. That is the whole design constraint:
 *  a private code is no use if your friend cannot read it back.
 *
 *  Six rules, all reversible:
 *
 *    1. The sentence runs backwards. Ondaric is head-final throughout,
 *       so what English puts first, Ondaric puts last.
 *    2. Every letter has a fixed counterpart. Vowels become vowels and
 *       consonants become consonants, so a word keeps its shape and
 *       stays pronounceable.
 *    3. Articles bind to the front of their noun with a turned comma.
 *    4. Prepositions become postpositions and bind to the back of it.
 *    5. Punctuation becomes a particle word.
 *    6. A capital letter stays a capital.
 *
 *  With a passphrase, rule 2's table is reshuffled from the phrase, so
 *  two people who share a word share a language nobody else can read —
 *  even knowing every rule on this page.
 * ================================================================== */

const VOWELS = 'aeiou'.split('');
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'.split('');

/* The canonical table, chosen by hand so that ordinary English comes
   out looking like something you could say out loud. */
const BASE_V = { a:'i', e:'a', i:'u', o:'e', u:'o' };
const BASE_C = {
  b:'v', c:'k', d:'th', f:'s', g:'d', h:'n', j:'z', k:'g', l:'r', m:'n',
  n:'m', p:'b', q:'k', r:'l', s:'h', t:'d', v:'b', w:'w', x:'x', y:'y', z:'j'
};

/* BASE_C is not a bijection — it was written for looks first. Rather
   than quietly lose messages, the table below is derived from it and
   then repaired into a permutation, so every letter has exactly one
   counterpart and decoding is never a guess. */
function repair(map, alphabet){
  const out = {}, taken = new Set();
  const clashes = [];
  for (const ch of alphabet){
    let want = map[ch];
    if (want && want.length === 1 && alphabet.indexOf(want) >= 0 && !taken.has(want)){
      out[ch] = want; taken.add(want);
    } else {
      clashes.push(ch);
    }
  }
  const free = alphabet.filter((c) => !taken.has(c));
  clashes.forEach((ch, i) => { out[ch] = free[i]; taken.add(free[i]); });
  return out;
}

/* ---- a passphrase turns into a shuffle ---------------------------- *
 * xmur3 for the seed and mulberry32 for the stream: both small, both
 * well known, both entirely deterministic — the same phrase has to
 * give the same language on your friend's machine as on yours.       */
function xmur3(str){
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++){
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function(){
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(list, rnd){
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Articles bind forward, prepositions bind back. Both attach to the
   same noun, which is how "in the house" becomes one Ondaric word. */
const ARTICLES = { a: 'a', an: 'an', the: 'sa' };
const PREPS = {
  of: 'vor', to: 'ken', in: 'thal', on: 'rin', at: 'esh', with: 'nemi',
  for: 'ulan', from: 'dros', by: 'seth', into: 'thalen', over: 'ruk', under: 'nuth'
};
const STOPS = { '.': 'nel', '?': 'keth', '!': 'sarn', ',': 'vei', ';': 'veyen', ':': 'thek' };

/* Two binders, not one. With a single mark, "A’dros" could be the
   article "a" in front of a root, or a root with the postposition
   "dros" behind it — and the root for "I" really does come out as "A"
   under the plain table. Giving each side its own mark makes the
   reading a rule instead of a coin toss. A root can contain neither. */
const BIND_ART = '’';    // turned comma: the article, in front
const BIND_POST = '-';   // hyphen: the postposition, behind

/* Sentence particles wear a mark. Without it they are ordinary-looking
   words, and sooner or later some English word runs through the letter
   table and lands exactly on one — "you" came out as "vei" under one
   passphrase, and the reader had no way to know it was not a comma. A
   root can never contain this character, so a marked word is always a
   particle and never a guess. */
const MARK = '·';

/* Reassign a table's values among its own keys. Used to move the
   particles around under a passphrase: without this the grammar shows
   through a wrong key — "at the" survives intact, because articles and
   postpositions are fixed words rather than letters, and anyone who
   knows Ondaric can read the shape of your sentence even if they
   cannot read a single root of it. */
function repermute(table, rnd){
  const keys = Object.keys(table);
  const vals = shuffled(keys.map((k) => table[k]), rnd);
  const out = {};
  keys.forEach((k, i) => { out[k] = vals[i]; });
  return out;
}

function buildTables(passphrase){
  const baseV = repair(BASE_V, VOWELS);
  const baseC = repair(BASE_C, CONSONANTS);
  if (!passphrase){
    return { v: baseV, c: baseC, art: ARTICLES, prep: PREPS, stop: STOPS };
  }
  // A phrase reshuffles both tables. The letters still map vowel-to-vowel
  // and consonant-to-consonant, so the output stays sayable whatever
  // phrase you choose.
  const seed = xmur3('ondaric:' + passphrase);
  const rnd = mulberry32(seed());
  const v = {}, c = {};
  shuffled(VOWELS, rnd).forEach((to, i) => { v[VOWELS[i]] = to; });
  shuffled(CONSONANTS, rnd).forEach((to, i) => { c[CONSONANTS[i]] = to; });
  return {
    v: v, c: c,
    art: repermute(ARTICLES, rnd),
    prep: repermute(PREPS, rnd),
    stop: repermute(STOPS, rnd)
  };
}

function invert(map){
  const out = {};
  for (const k in map) out[map[k]] = k;
  return out;
}

/* ---- one word through the letter table ---------------------------- */
function subWord(word, tv, tc){
  let out = '';
  for (const ch of word){
    const low = ch.toLowerCase();
    const up = ch !== low;
    const to = tv[low] || tc[low];
    out += to ? (up ? to.toUpperCase() : to) : ch;
  }
  return out;
}

const LETTER = "A-Za-z\\u00C0-\\u024F";
const WORD_RE = new RegExp('[' + LETTER + ']+(?:\'[' + LETTER + ']+)*');
const NUM_RE = /[0-9]+(?:[.,][0-9]+)*/;

/* Split a sentence into three kinds of piece: words, numbers, and the
   punctuation Ondaric has a particle for. A number is a bindable thing
   like any other noun — "at 7" has to survive, and it will not if the
   preposition looks straight past the digits for the next word. */
function tokenise(text){
  const out = [];
  let rest = text;
  while (rest.length){
    const w = rest.match(WORD_RE);
    const n = rest.match(NUM_RE);
    const first = (!w && !n) ? null
                : (!n || (w && w.index <= n.index)) ? { m: w, kind: 'word' }
                : { m: n, kind: 'num' };
    if (!first){ pushGaps(out, rest); break; }
    if (first.m.index > 0) pushGaps(out, rest.slice(0, first.m.index));
    out.push({ kind: first.kind, t: first.m[0] });
    rest = rest.slice(first.m.index + first.m[0].length);
  }
  return out;
}

/* Whatever sits between the words. Only the marks with a particle of
   their own are kept; the rest is spacing and symbols Ondaric has no
   word for, and the page says so rather than pretending otherwise. */
function pushGaps(out, text){
  for (const ch of text) if (STOPS[ch]) out.push({ kind: 'stop', t: ch });
}

/* ================================================================== *
 *  Encode
 * ================================================================== */
function toOndaric(text, passphrase){
  const { v, c, art: ART, prep: PRE, stop: STP } = buildTables(passphrase || '');
  const sentences = String(text).split(/([.!?]+)/);
  const out = [];

  for (let s = 0; s < sentences.length; s += 2){
    const body = sentences[s];
    const stop = sentences[s + 1] || '';
    if (!body || !body.trim()){
      if (stop) out.push(stopWords(stop, STP));
      continue;
    }

    const toks = tokenise(body);
    const words = [];

    /* Particles waiting for a noun to land on. Ondaric only ever binds
       the pair in one order — postposition outside, article inside, as
       in "in the house" — so anything that would produce a different
       order has to be let go and written as a plain word instead. That
       is what keeps decoding a rule rather than a guess. */
    let pending = [];              // [{ kind, particle, src }]

    const flush = () => {
      for (const p of pending) words.push({ text: subWord(p.src, v, c) });
      pending = [];
    };
    const has = (kind) => pending.some((p) => p.kind === kind);

    // "A" is both an article and the name of a letter, and Ondaric has no
    // way to tell them apart once written down. Binding only happens in
    // front of something longer than one letter, which keeps "a lantern"
    // an article and leaves "A B C" as three letters.
    const nextBindable = (from) => {
      for (let i = from + 1; i < toks.length; i++){
        if (toks[i].kind === 'word' || toks[i].kind === 'num') return toks[i].t.length;
      }
      return 0;
    };

    const emit = (text) => {
      let w = text;
      const art = pending.find((p) => p.kind === 'art');
      const prep = pending.find((p) => p.kind === 'prep');
      if (art) w = art.particle + BIND_ART + w;
      if (prep) w = w + BIND_POST + prep.particle;
      pending = [];
      words.push({ text: w });
    };

    for (let ti = 0; ti < toks.length; ti++){
      const t = toks[ti];

      // A comma ends the phrase the particle was reaching across.
      if (t.kind === 'stop'){ flush(); words.push({ particle: MARK + STP[t.t] }); continue; }
      if (t.kind === 'num'){ emit(t.t); continue; }

      const low = t.t.toLowerCase();
      if (ART[low] && !has('art') && nextBindable(ti) > 1){
        pending.push({ kind: 'art', particle: ART[low], src: t.t });
        continue;
      }
      if (PRE[low] && !has('prep') && nextBindable(ti) > 0){
        // An article already waiting would end up on the wrong side of
        // this one. Let it go and write it out plainly.
        if (has('art')) flush();
        pending.push({ kind: 'prep', particle: PRE[low], src: t.t });
        continue;
      }
      emit(subWord(t.t, v, c));
    }
    // Particles that never found a noun go back to being ordinary words
    // and take the letter table like any other. This matters more than it
    // looks: a bare particle never appears in valid Ondaric, so the reader
    // never has to guess whether a lone "a" is the article or the letter E
    // wearing its Ondaric coat.
    flush();

    words.reverse();
    const line = words.map((x) => x.particle || x.text).join(' ');
    out.push(line + (stop ? ' ' + stopWords(stop, STP) : ''));
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

function stopWords(stop, table){
  return [...stop].map((ch) => (table[ch] ? MARK + table[ch] : ch)).join(' ');
}

/* ================================================================== *
 *  Decode
 * ================================================================== */
function fromOndaric(text, passphrase){
  const { v, c, art: ART, prep: PRE, stop: STP } = buildTables(passphrase || '');
  const iv = invert(v), ic = invert(c);
  const iArt = invert(ART), iPrep = invert(PRE), iStop = invert(STP);

  const tokens = String(text).trim().split(/\s+/).filter(Boolean);
  const sentences = [];
  let run = [];

  for (const tok of tokens){
    const bare = tok.replace(MARK, '').toLowerCase();
    if (tok.indexOf(MARK) === 0 && iStop[bare] && '.?!'.indexOf(iStop[bare]) >= 0){
      sentences.push({ words: run, stop: iStop[bare] });
      run = [];
    } else {
      run.push(tok);
    }
  }
  if (run.length) sentences.push({ words: run, stop: '' });

  const out = [];
  for (const sent of sentences){
    const words = sent.words.slice().reverse();
    const pieces = [];
    for (const tok of words){
      if (tok.indexOf(MARK) === 0){
        const mk = iStop[tok.replace(MARK, '').toLowerCase()];
        if (mk){ pieces.push({ punct: mk }); continue; }
      }

      // The marks say which is which, so this never has to guess.
      let core = tok, prefix = '', suffix = '';
      const artSplit = core.split(BIND_ART);
      if (artSplit.length === 2){ prefix = artSplit[0]; core = artSplit[1]; }
      const postSplit = core.split(BIND_POST);
      if (postSplit.length === 2){ core = postSplit[0]; suffix = postSplit[1]; }
      // Ondaric writes "the bridge at"; English wants "at the bridge",
      // so the postposition comes off the back and goes in front of the
      // article rather than between it and the noun.
      if (suffix && iPrep[suffix.toLowerCase()]) pieces.push({ text: iPrep[suffix.toLowerCase()] });
      if (prefix && iArt[prefix.toLowerCase()]) pieces.push({ text: iArt[prefix.toLowerCase()] });
      pieces.push({ text: subWord(core, iv, ic) });
    }
    let line = '';
    for (const p of pieces){
      if (p.punct){ line = line.replace(/\s+$/, '') + p.punct + ' '; }
      else line += p.text + ' ';
    }
    line = line.trim();
    if (line) line = line.charAt(0).toUpperCase() + line.slice(1);
    // "?!" is two particles and one piece of punctuation, not two
    // sentences with a space between them.
    if (!line && out.length){ out[out.length - 1] += sent.stop; continue; }
    out.push(line + sent.stop);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
