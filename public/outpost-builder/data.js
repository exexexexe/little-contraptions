/* ------------------------------------------------------------------ *
 *  Outpost Builder — the eight levels.
 *
 *  `solar` is REAL: sunlight at that planet's mean orbital distance, as
 *  a multiple of what Earth gets. It is simply 1 / r² with r in AU
 *  (Mercury 0.387 AU, Neptune 30.07 AU), which is why a solar collector
 *  is worth twenty times as much on Mercury as at Neptune and why the
 *  back half of the solar system has to be run on reactors. The rest of
 *  the numbers — ore, targets, costs — are game balance and nothing else.
 * ------------------------------------------------------------------ */
window.PLANETS = [
  { key:'mercury', name:'Mercury', au:0.387, solar:6.68,    ore:1.0, target:12, start:45, seed:1101,
    blurb:'Sunlight is brutal and there is nothing else. Collectors are almost free power here.',
    pal:{ sky:'#1A1512', far:'#4A3A2E', ground:'#8A6E52', high:'#A98A66', rock:'#6B5540', shade:'#3A2C21' } },
  { key:'venus',   name:'Venus',   au:0.723, solar:1.91,    ore:1.1, target:18, start:45, seed:2202,
    blurb:'Thick cloud, hot rock. Still bright enough that panels carry the outpost.',
    pal:{ sky:'#2A1B0E', far:'#6B4A1E', ground:'#B3812F', high:'#D2A044', rock:'#8A6222', shade:'#4A3312' } },
  { key:'earth',   name:'Earth',   au:1.000, solar:1.00,    ore:1.2, target:26, start:50, seed:3303,
    blurb:'The reference case. One unit of sun, decent ore, nothing trying to kill you.',
    pal:{ sky:'#101C26', far:'#254036', ground:'#3E6B4A', high:'#568A5C', rock:'#5A5340', shade:'#1C3025' } },
  { key:'mars',    name:'Mars',    au:1.524, solar:0.431,   ore:1.3, target:34, start:55, seed:4404,
    blurb:'Under half of Earth’s light. You will need more panels than feels reasonable.',
    pal:{ sky:'#1E1210', far:'#5A2A1C', ground:'#9B4A2E', high:'#BC6440', rock:'#6E3822', shade:'#3A1C12' } },
  { key:'jupiter', name:'Jupiter', au:5.203, solar:0.0369,  ore:1.6, target:42, start:70, seed:5505,
    blurb:'Sunlight has collapsed to four per cent. Panels are decoration now — build reactors.',
    pal:{ sky:'#161018', far:'#4A3350', ground:'#7A5A78', high:'#9A7898', rock:'#5A4258', shade:'#2E2030' } },
  { key:'saturn',  name:'Saturn',  au:9.537, solar:0.0110,  ore:1.8, target:52, start:80, seed:6606,
    blurb:'One per cent of Earth’s sun. Everything here runs on the reactor or not at all.',
    pal:{ sky:'#141519', far:'#3E4652', ground:'#6E7C8C', high:'#8C9AA8', rock:'#4E5A68', shade:'#242A32' } },
  { key:'uranus',  name:'Uranus',  au:19.19, solar:0.00272, ore:2.1, target:62, start:95, seed:7707,
    blurb:'A quarter of one per cent. The ore is rich, which is the only reason to be here.',
    pal:{ sky:'#0E1A1C', far:'#2A5258', ground:'#4A8A8E', high:'#66A8AA', rock:'#356468', shade:'#183438' } },
  { key:'neptune', name:'Neptune', au:30.07, solar:0.00111, ore:2.4, target:74, start:110, seed:8808,
    blurb:'A thousandth of Earth’s light. The last one, and the darkest.',
    pal:{ sky:'#0C1020', far:'#243258', ground:'#3A529C', high:'#5070BE', rock:'#2C3E72', shade:'#161E3C' } },
];

/* cost in ore, and what it does */
window.BUILDINGS = {
  collector: { name:'Collector', cost:10, power:+3,  ore:0, res:0, needs:'flat',
               desc:'Power from sunlight. Output is multiplied by this planet’s solar figure, so it is worth twenty times more on Mercury than at Neptune.' },
  reactor:   { name:'Reactor',   cost:32, power:+9,  ore:0, res:0, needs:'flat',
               desc:'Nine power regardless of where the sun is. Expensive, and the only thing that works past Mars.' },
  drill:     { name:'Drill',     cost:14, power:-2,  ore:+1, res:0, needs:'any',
               desc:'One ore a tick, three on a rock tile. Costs two power to run.' },
  lab:       { name:'Lab',       cost:26, power:-5,  ore:-2, res:+1, needs:'flat',
               desc:'One research a tick, which is the only thing that finishes a planet. Eats five power and two ore.' },
};
