/* ------------------------------------------------------------------ *
 *  Decades and the questions that point at them.
 *
 *  The matching is on genre, production and arrangement — the things
 *  that actually date a record — and never on particular songs. Every
 *  decade description is a factual account of what was going on
 *  musically, not a claim about what you personally like.
 *
 *  Scores are weights toward decades, keyed by decade id.
 * ------------------------------------------------------------------ */
window.DECADES = {
  '60s': { n:'The 1960s', tag:'Live rooms and four-track tape',
    d:'Recorded fast, largely live, onto very few tracks — so what you hear is mostly a room with ' +
      'people in it. Beat groups and Motown on one side, soul and blues underneath, and by the end ' +
      'of the decade psychedelia pulling the studio itself into the arrangement.',
    genres:['beat groups','Motown soul','folk revival','psychedelia','early funk'] },
  '70s': { n:'The 1970s', tag:'Everything got longer',
    d:'The album became the unit. Prog stretched songs past the ten-minute mark, funk tightened the ' +
      'rhythm section until it was the whole point, disco put four beats to the bar and a string ' +
      'section on top, and punk arrived to argue with all of it.',
    genres:['funk','disco','prog','punk','roots reggae','singer-songwriter'] },
  '80s': { n:'The 1980s', tag:'Gated reverb and the first machines',
    d:'Drum machines, the first affordable samplers and polysynths, and a gated snare you can date ' +
      'a record by to within about two years. Pop went widescreen, hip-hop arrived, and synth-pop ' +
      'and post-punk pulled in opposite directions.',
    genres:['synth-pop','post-punk','new wave','early hip-hop','stadium rock','house'] },
  '90s': { n:'The 1990s', tag:'Loud guitars and cheap samplers',
    d:'Sampling matured into a craft, and rock got deliberately scruffy in response to the previous ' +
      'decade’s polish. Dance music split into a dozen named subgenres inside five years, and ' +
      'the CD made the sixty-minute album normal.',
    genres:['grunge','boom-bap hip-hop','Britpop','jungle and drum and bass','trip-hop','Eurodance'] },
  '00s': { n:'The 2000s', tag:'Compressed to within an inch of its life',
    d:'The loudness war peaked, Auto-Tune moved from correction to instrument, and the internet ' +
      'started deciding what got heard. Garage rock revived, R&B got sharper and stranger, and ' +
      'pop production went digital everywhere at once.',
    genres:['garage-rock revival','crunk and snap','indie sleaze','emo','UK garage','electroclash'] },
  '10s': { n:'The 2010s', tag:'The drop, and then the retreat from it',
    d:'Streaming rewrote the incentives: intros got shorter, choruses arrived sooner. EDM went ' +
      'stadium-sized and then receded, trap hi-hats became the default rhythm of pop, and a lot of ' +
      'the decade’s biggest records were deliberately quiet and sparse.',
    genres:['trap','EDM','bedroom pop','K-pop','tropical house','alt-R&B'] },
  '20s': { n:'The 2020s', tag:'Everything at once, on purpose',
    d:'No single dominant sound. Hyperpop and drill and country and disco revival all charting in ' +
      'the same month, records made entirely in bedrooms sitting next to ones with forty writers, ' +
      'and older catalogue outselling new releases for the first time.',
    genres:['drill','hyperpop','disco revival','Afrobeats','sped-up edits','amapiano'] }
};

window.QUESTIONS = [
{ q:'How should it be recorded?', a:[
  ['A room, a band, few takes', {'60s':3,'70s':2}],
  ['Layered in the studio until it gleams', {'70s':2,'80s':3}],
  ['Built from samples of other records', {'90s':2,'00s':3}],
  ['Programmed, entirely in the box', {'10s':3,'20s':2}],
  ['On a laptop, in a bedroom, alone', {'20s':3,'10s':2}]
]},
{ q:'What is the low end doing?', a:[
  ['An upright or a warm electric bass', {'60s':3,'70s':2}],
  ['A slap-and-pop line that is the whole song', {'70s':3}],
  ['A synth bass with a rubbery envelope', {'80s':3}],
  ['A sampled break with the bass folded in', {'90s':3}],
  ['An 808 that you feel rather than hear', {'10s':3,'20s':2}]
]},
{ q:'And the drums?', a:[
  ['A person, slightly behind the beat', {'60s':3,'70s':2}],
  ['Enormous gated snare', {'80s':3}],
  ['A chopped breakbeat', {'90s':3}],
  ['Four to the floor, all night', {'70s':2,'80s':1,'00s':3}],
  ['Rolling hi-hats in triplets', {'10s':3,'20s':2}]
]},
{ q:'Where does the voice sit?', a:[
  ['Front and centre, unprocessed', {'60s':3,'70s':1}],
  ['Belted, with a huge reverb behind it', {'80s':3}],
  ['Half-shouted, half-buried in guitars', {'90s':3}],
  ['Tuned until it is an instrument', {'00s':3,'10s':2}],
  ['Whispered, close, barely there', {'10s':2,'20s':3}]
]},
{ q:'How long is it?', a:[
  ['Under three minutes, no waste', {'60s':3,'20s':1}],
  ['Long enough to have movements', {'70s':3}],
  ['Whatever the twelve-inch allows', {'80s':2,'90s':2,'00s':1}],
  ['Four minutes with a proper bridge', {'00s':3}],
  ['Chorus by the fifteen-second mark', {'10s':2,'20s':3}]
]},
{ q:'What is it for?', a:[
  ['Dancing, in a room full of strangers', {'70s':3,'80s':1,'10s':1}],
  ['Being played very loudly in a car', {'80s':2,'00s':3}],
  ['A festival field at dusk', {'90s':2,'10s':3}],
  ['Headphones, on public transport', {'90s':2,'20s':3}],
  ['A record player and an armchair', {'60s':3,'70s':2}]
]},
{ q:'Pick a mood.', a:[
  ['Earnest, and not embarrassed about it', {'60s':2,'80s':2}],
  ['Hedonistic', {'70s':2,'00s':2}],
  ['Sardonic, arms folded', {'90s':3,'00s':2}],
  ['Melancholy, but danceable', {'80s':2,'10s':3}],
  ['Deliberately unplaceable', {'20s':3}]
]},
{ q:'One instrument gets the spotlight.', a:[
  ['A guitar solo', {'70s':2,'80s':2,'90s':1}],
  ['A string section', {'60s':3,'70s':2}],
  ['An analogue synth', {'80s':3}],
  ['A sampler', {'90s':3,'00s':1}],
  ['A voice, pitched and stacked', {'10s':2,'20s':3}]
]}
];
