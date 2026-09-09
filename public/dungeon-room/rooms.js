/* ------------------------------------------------------------------ *
 *  The tables. Everything the room is made of.
 *
 *  The room of the day is seeded from the date, so everyone who visits
 *  on the same day stands in the same room. Going deeper re-seeds from
 *  the depth, so the descent is yours alone.
 * ------------------------------------------------------------------ */

const SHAPE = [
  { n: 'a long hall', w: 15, h: 8 },
  { n: 'a square chamber', w: 11, h: 11 },
  { n: 'a round vault', w: 12, h: 12, round: true },
  { n: 'a narrow gallery', w: 17, h: 6 },
  { n: 'an antechamber', w: 9, h: 8 },
  { n: 'a cistern room', w: 13, h: 10 },
  { n: 'a collapsed crossing', w: 12, h: 9 },
  { n: 'a stair landing', w: 10, h: 10 }
];

const FLOOR = ['flagstones worn smooth in two parallel tracks', 'packed earth, swept recently',
  'mosaic tiles, most of them gone', 'bare rock, still bearing chisel marks',
  'timber over something hollow', 'sand that has been carried here on purpose',
  'iron plate, cold enough to sting', 'grave-slabs laid flat and face down'];

const AIR = ['cold and completely still', 'warm, and moving from somewhere behind the far wall',
  'thick with dust that has not settled in years', 'wet, and tasting faintly of copper',
  'so dry the torch gutters', 'moving in slow breaths, in and out',
  'sharp with something recently extinguished', 'unremarkable, which is itself unusual down here'];

const LIGHT = ['no light but yours', 'a green glow from the floor seams', 'four sconces, three of them lit',
  'daylight, impossibly, from a shaft above', 'a pale line under the far door',
  'lichen giving off just enough to be worse than nothing', 'the coals of a fire nobody is tending',
  'light that arrives about a second after it should'];

const FEATURE = [
  'A dry fountain stands in the middle, its basin full of teeth.',
  'Six pillars, and one of them is not stone.',
  'A ledger is chained to a lectern. Every page is the same page.',
  'The far wall is covered floor to ceiling in tally marks.',
  'A pit, roughly circular, with a rope ladder pulled up on the far side.',
  'Somebody has swept this room. The broom is still here.',
  'Water runs along a channel cut into the floor and disappears under the wall.',
  'A door stands in the middle of the room, framed and hinged, attached to nothing.',
  'Three beds, made. The dust on them is undisturbed.',
  'A mural shows this room, with you in it, from behind.',
  'An iron cage hangs from the ceiling, open, and swinging very slightly.',
  'The remains of a camp. The fire is warm. There is no one here.'
];

const MONSTER = [
  { n: 'a rust-cloaked ghoul', d: 'thin as a coat rack, with a jaw that unhinges further than it should',
    w: 'It wants the iron on you, not the meat.' },
  { n: 'a moss knight', d: 'plate armour holding a shape long after the shape stopped needing it',
    w: 'It wants you to state your business, and it will wait all night.' },
  { n: 'a chapel spider', d: 'the size of a dog, and it has hung its web with small stolen bells',
    w: 'It wants the room quiet, and it is prepared to arrange that.' },
  { n: 'a drowned chorister', d: 'kneeling, soaked, singing at a pitch that makes the water shiver',
    w: 'It wants someone to take the second part.' },
  { n: 'the lamplighter', d: 'a stooped figure going sconce to sconce, putting flames out',
    w: 'It wants the dark restored, and considers you a delay.' },
  { n: 'a tallow hound', d: 'built of rendered fat around a frame of somebody&rsquo;s ribs',
    w: 'It wants to be let out, and it has been very patient.' },
  { n: 'a cellar wyrm', d: 'four feet of pale coil in the drainage channel, entirely uninterested in you',
    w: 'It wants the water to keep running. So, probably, do you.' },
  { n: 'the accountant', d: 'robed, seated, and adding a column that runs off the bottom of the page',
    w: 'It wants to know what you took from the last room.' },
  { n: 'a swarm of pages', d: 'loose vellum moving as one thing, with a sound like polite applause',
    w: 'It wants to be read, and it does not take no for an answer.' },
  { n: 'a stone wife', d: 'a statue with a fresh chip in it and grit on the floor beneath',
    w: 'It wants you to not be looking when it moves. It is happy to wait.' },
  { n: 'the last apprentice', d: 'young, armed with a broom handle, and absolutely terrified of you',
    w: 'It wants to leave, and thinks you are what is stopping it.' },
  { n: 'a cairn of hands', d: 'a heap that reassembles itself into whatever shape it needs',
    w: 'It wants what everything down here wants: one more.' }
];

const LOOT = [
  { n: 'the Quiet Bell', d: 'brass, hand-sized, with the clapper wired firmly in place',
    e: 'Ringing it silences everything within thirty feet for a count of ten. Including you.' },
  { n: 'a Ledger of Debts Owed', d: 'bound in something that has a grain',
    e: 'Names appear in it. Some of them are people you have not met yet.' },
  { n: 'the Second-Best Sword', d: 'well made, well kept, and modestly proportioned',
    e: 'It has never lost a fight. It has also never been in one it could lose.' },
  { n: 'a jar of Standing Water', d: 'sealed with wax and a strip of lead',
    e: 'The water inside is always level, whatever angle you hold it at. Nobody knows what it is for.' },
  { n: 'the Cartographer&rsquo;s Thumb', d: 'preserved, ringed, and pointing',
    e: 'It points at the nearest way out. It does not distinguish between good ones and bad ones.' },
  { n: 'a Coat of Ordinary Cloth', d: 'brown, patched at one elbow, and entirely unmagical',
    e: 'Nobody looks twice at anyone wearing it. This is not enchantment. It is just a very good coat.' },
  { n: 'the Argument Stone', d: 'river-smooth, warm, and heavier than it looks',
    e: 'Hold it and you win the argument. You will not remember what it was about.' },
  { n: 'a Set of Borrowed Keys', d: 'eleven keys on a ring, none of them yours',
    e: 'Each opens exactly one door, once, and then stops being a key.' },
  { n: 'the Inventory', d: 'a slate with a list already written on it',
    e: 'It lists what you are carrying. It is one item ahead of you, and always has been.' },
  { n: 'a Candle That Burns Downward', d: 'ordinary tallow, mounted upside down in an iron cradle',
    e: 'It gives no light but shows where light has been. Useful exactly once, spectacularly.' },
  { n: 'the Understudy&rsquo;s Mask', d: 'plain, unpainted, sized for nobody in particular',
    e: 'Wear it and people remember meeting someone. They will not agree on who.' },
  { n: 'a Coin of the Wrong Reign', d: 'gold, heavy, stamped with a profile no historian recognises',
    e: 'It spends. Everywhere. That is the problem with it.' }
];

const CONDITION = ['in good condition', 'chipped but sound', 'filthy, and worth cleaning',
  'wrapped in oilcloth', 'still warm', 'nailed down', 'buried, with the handle showing',
  'sitting in plain view, which should worry you'];

const DEPTH_NOTE = [
  'Ground level. The stairs behind you are still visible.',
  'One floor down. The air has changed.',
  'Two floors down. Nothing here was built for people.',
  'Three floors down. The stonework is older than the dungeon.',
  'Four floors down. You have stopped counting doors.',
  'Five floors down. Something above you has closed.',
  'Deeper. The map has run out and so has the convention of floors.'
];
