/* ------------------------------------------------------------------ *
 *  Higher or Lower — the whole game is this file.
 *
 *  Adding a fourth category means adding a fourth object here and
 *  nothing else: the switcher, the rounds and the scoring all read
 *  from whatever is in this array.
 *
 *  Every figure is a published one. Where a measurement is genuinely
 *  contested — sailfish and marlin speeds, for instance — the entry was
 *  left out rather than a number picked. Where a thing is measured in
 *  more than one way, `e` says which way this is.
 * ------------------------------------------------------------------ */
window.CATEGORIES = [
{
  id: 'height', name: 'How tall', unit: 'm', dp: 0,
  ask: 'Taller or shorter?', more: 'Taller', less: 'Shorter',
  note: 'Heights in metres. Buildings are to architectural top including spires, ' +
        'mountains to summit elevation above sea level.',
  items: [
    { n: 'Mount Everest', v: 8849, e: 'summit above sea level' },
    { n: 'K2', v: 8611, e: 'summit above sea level' },
    { n: 'Denali', v: 6190, e: 'summit above sea level' },
    { n: 'Kilimanjaro', v: 5895, e: 'summit above sea level' },
    { n: 'Mont Blanc', v: 4808, e: 'summit above sea level' },
    { n: 'The Matterhorn', v: 4478, e: 'summit above sea level' },
    { n: 'Mount Fuji', v: 3776, e: 'summit above sea level' },
    { n: 'Half Dome', v: 2694, e: 'summit above sea level' },
    { n: 'Mount Kosciuszko', v: 2228, e: 'the highest point in Australia' },
    { n: 'Mount Vesuvius', v: 1281, e: 'summit above sea level' },
    { n: 'Ben Nevis', v: 1345, e: 'the highest point in the British Isles' },
    { n: 'Snowdon', v: 1085, e: 'summit above sea level' },
    { n: 'Angel Falls', v: 979, e: 'total drop, the tallest waterfall on Earth' },
    { n: 'The Burj Khalifa', v: 828, e: 'to the tip' },
    { n: 'Tokyo Skytree', v: 634, e: 'to the tip' },
    { n: 'Shanghai Tower', v: 632, e: 'to the tip' },
    { n: 'The CN Tower', v: 553, e: 'to the tip' },
    { n: 'One World Trade Center', v: 541, e: 'to the tip, spire included' },
    { n: 'The Petronas Towers', v: 452, e: 'to the tip' },
    { n: 'The Empire State Building', v: 443, e: 'to the tip, antenna included' },
    { n: 'Uluru', v: 348, e: 'above the surrounding plain' },
    { n: 'The Eiffel Tower', v: 330, e: 'to the tip, antennas included' },
    { n: 'The Golden Gate Bridge towers', v: 227, e: 'above the water' },
    { n: 'The Gateway Arch', v: 192, e: 'at its highest point' },
    { n: 'The Space Needle', v: 184, e: 'to the tip' },
    { n: 'The Washington Monument', v: 169, e: 'to the tip' },
    { n: 'The Great Pyramid of Giza', v: 139, e: 'as it stands now; it was taller when built' },
    { n: 'The Statue of Liberty', v: 93, e: 'pedestal included' },
    { n: 'Big Ben', v: 96, e: 'the tower, to the tip' },
    { n: 'Sydney Opera House', v: 65, e: 'at its highest shell' },
    { n: 'The Leaning Tower of Pisa', v: 57, e: 'on its taller side' },
    { n: 'Niagara Falls', v: 51, e: 'the drop at Horseshoe Falls' },
    { n: 'The Colosseum', v: 48, e: 'the surviving outer wall' },
    { n: 'Christ the Redeemer', v: 30, e: 'the statue alone, without its pedestal' },
    { n: 'El Castillo at Chichen Itza', v: 30, e: 'to the top of the temple' }
  ]
},
{
  id: 'speed', name: 'How fast', unit: 'km/h', dp: 2,
  ask: 'Faster or slower?', more: 'Faster', less: 'Slower',
  note: 'Top recorded speeds in kilometres per hour. Methods differ — a diving bird and a ' +
        'sprinting cat are not measured the same way — and several famously fast animals ' +
        'are missing because their record is disputed rather than established.',
  items: [
    { n: 'A peregrine falcon', v: 389, e: 'in a dive, the fastest animal there is' },
    { n: 'A golden eagle', v: 320, e: 'in a dive' },
    { n: 'A cheetah', v: 120, e: 'over a short sprint' },
    { n: 'A common swift', v: 111, e: 'in level flight, not a dive' },
    { n: 'A pronghorn', v: 88, e: 'and it can hold it for miles' },
    { n: 'A quarter horse', v: 88, e: 'over a quarter mile' },
    { n: 'A wildebeest', v: 80, e: '' },
    { n: 'A lion', v: 80, e: 'in a short charge' },
    { n: 'A greyhound', v: 74, e: '' },
    { n: 'A kangaroo', v: 71, e: '' },
    { n: 'An ostrich', v: 70, e: 'the fastest thing on two legs' },
    { n: 'A zebra', v: 65, e: '' },
    { n: 'A giraffe', v: 60, e: '' },
    { n: 'A grizzly bear', v: 56, e: '' },
    { n: 'A killer whale', v: 56, e: '' },
    { n: 'A brown hare', v: 56, e: '' },
    { n: 'A rhinoceros', v: 55, e: 'which is the alarming part' },
    { n: 'A dragonfly', v: 55, e: '' },
    { n: 'A domestic cat', v: 48, e: '' },
    { n: 'Usain Bolt', v: 44.72, e: 'his fastest measured instant, in 2009' },
    { n: 'An elephant', v: 40, e: '' },
    { n: 'A bottlenose dolphin', v: 35, e: '' },
    { n: 'A roadrunner', v: 32, e: 'on foot, as it happens' },
    { n: 'A hippopotamus', v: 30, e: 'on land' },
    { n: 'A honeybee', v: 29, e: '' },
    { n: 'A komodo dragon', v: 20, e: '' },
    { n: 'A grey squirrel', v: 20, e: '' },
    { n: 'A saltwater crocodile', v: 17, e: 'on land, in a lunge' },
    { n: 'A domestic pig', v: 17, e: '' },
    { n: 'A chicken', v: 14, e: '' },
    { n: 'A housefly', v: 8, e: '' },
    { n: 'A giant tortoise', v: 0.3, e: '' },
    { n: 'A three-toed sloth', v: 0.24, e: 'on the ground, where it is worst' },
    { n: 'A garden snail', v: 0.05, e: '' }
  ]
},
{
  id: 'gravity', name: 'How heavy the ground', unit: 'm/s²', dp: 2,
  ask: 'Stronger or weaker?', more: 'Stronger', less: 'Weaker',
  note: 'Surface gravity in metres per second squared. For the gas and ice giants this is ' +
        'the value at the top of the cloud deck, since there is no surface to stand on.',
  items: [
    { n: 'The Sun', v: 274, e: 'at the photosphere' },
    { n: 'Jupiter', v: 24.79, e: 'at the cloud tops' },
    { n: 'Neptune', v: 11.15, e: 'at the cloud tops' },
    { n: 'Saturn', v: 10.44, e: 'at the cloud tops' },
    { n: 'Earth', v: 9.81, e: 'the one you are standing on' },
    { n: 'Venus', v: 8.87, e: '' },
    { n: 'Uranus', v: 8.69, e: 'at the cloud tops' },
    { n: 'Mars', v: 3.72, e: '' },
    { n: 'Io', v: 1.8, e: 'a moon of Jupiter' },
    { n: 'The Moon', v: 1.62, e: '' },
    { n: 'Ganymede', v: 1.43, e: 'a moon of Jupiter, and larger than Mercury' },
    { n: 'Titan', v: 1.35, e: 'a moon of Saturn' },
    { n: 'Europa', v: 1.31, e: 'a moon of Jupiter' },
    { n: 'Callisto', v: 1.24, e: 'a moon of Jupiter' },
    { n: 'Eris', v: 0.82, e: 'a dwarf planet out past Neptune' },
    { n: 'Triton', v: 0.78, e: 'a moon of Neptune, going the wrong way round' },
    { n: 'Pluto', v: 0.62, e: '' },
    { n: 'Charon', v: 0.29, e: "Pluto's largest moon" },
    { n: 'Ceres', v: 0.27, e: 'the largest thing in the asteroid belt' },
    { n: 'Rhea', v: 0.26, e: 'a moon of Saturn' },
    { n: 'Vesta', v: 0.25, e: 'in the asteroid belt' },
    { n: 'Iapetus', v: 0.22, e: 'a moon of Saturn, dark on one side' },
    { n: 'Enceladus', v: 0.11, e: 'a moon of Saturn that sprays water into space' },
    { n: 'Mimas', v: 0.064, e: 'a moon of Saturn with one enormous crater' },
    { n: 'Phobos', v: 0.0057, e: 'a moon of Mars; you could jump off it' },
    { n: 'Deimos', v: 0.003, e: 'the other moon of Mars, and even less' }
  ]
}
];
