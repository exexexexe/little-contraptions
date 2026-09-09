/* ------------------------------------------------------------------ *
 *  The questions.
 *
 *  The premise of each is daft. The arithmetic is not, and neither are
 *  the numbers it runs on. Every input is tagged:
 *
 *    m — measured. A real published or definitional figure.
 *    a — assumed. A premise this page is choosing, stated openly so you
 *        can disagree with it and redo the sum yourself.
 *
 *  Nothing tagged `m` is invented, and nothing tagged `a` is presented
 *  as though it were known.
 * ------------------------------------------------------------------ */
window.QUESTIONS = [
{
  id:'lollipop', q:'How many licks to the centre of a lollipop?',
  rows:[
    ['Radius of a standard round lollipop', 20, 'mm', 'a', 'A 40 mm lollipop, which is the common size.'],
    ['Sugar removed per lick', 0.01, 'mm', 'a', 'A ten-micrometre layer. This is the number everything hangs on, and it is a guess.']
  ],
  calc:function(v){ return v[0] / v[1]; },
  unit:'licks',
  note:'Real studies have counted this with machines and with volunteers, and they disagree with ' +
       'each other by thousands, largely because "a lick" is not a fixed quantity. This is the ' +
       'arithmetic, not the answer.'
},
{
  id:'cats', q:'How many cats to power a lightbulb?',
  rows:[
    ['Resting energy use of a 4 kg cat', 209, 'kcal/day', 'm', 'From the standard veterinary resting formula, 70 × mass^0.75.'],
    ['Kilocalories in a joule', 4184, 'J', 'm', 'Definitional.'],
    ['Seconds in a day', 86400, 's', 'm', 'Definitional.'],
    ['Power drawn by an LED bulb', 9, 'W', 'm', 'A common 9 W bulb, about as bright as an old 60 W one.'],
    ['Body heat you could actually harvest', 5, '%', 'a', 'Thermoelectric harvesting from a warm body is poor. Five per cent is generous.']
  ],
  calc:function(v){
    var wattsPerCat = (v[0] * v[1]) / v[2];
    return v[3] / (wattsPerCat * (v[4] / 100));
  },
  unit:'cats',
  note:'A cat radiates about ten watts, so one cat is nearly a lightbulb — until you try to turn ' +
       'heat into electricity, which is where almost all of it goes.'
},
{
  id:'balloons', q:'How many party balloons to lift you?',
  rows:[
    ['Your mass', 70, 'kg', 'a', 'Change this one.', true],
    ['Lift from helium at sea level', 1.02, 'g/litre', 'm', 'Air is about 1.22 g/L, helium about 0.18 g/L; the difference is the lift.'],
    ['Volume of a 30 cm party balloon', 14, 'litres', 'm', 'A 30 cm sphere is 14.1 litres.'],
    ['Mass of the balloon and string', 3, 'g', 'm', 'Which it has to lift before it lifts any of you.']
  ],
  calc:function(v){ return (v[0] * 1000) / (v[1] * v[2] - v[3]); },
  unit:'balloons',
  note:'This is the sum that made the 1982 lawn-chair flight work, and it is why it took forty-two ' +
       'weather balloons rather than party ones.'
},
{
  id:'moon', q:'How long to walk to the Moon?',
  rows:[
    ['Mean distance to the Moon', 384400, 'km', 'm', 'Centre to centre, averaged over the orbit.'],
    ['Comfortable walking speed', 5, 'km/h', 'm', 'The usual figure for an adult on the flat.'],
    ['Hours walked per day', 8, 'h', 'a', 'A working day of walking, with no days off.']
  ],
  calc:function(v){ return v[0] / v[1] / v[2] / 365.25; },
  unit:'years',
  note:'There is no road, no air and no ground. Everything else about the calculation is fine.'
},
{
  id:'paper', q:'How many sheets of A4 to reach the Space Station?',
  rows:[
    ['Orbit height of the ISS', 408, 'km', 'm', 'It varies by a few kilometres and is reboosted regularly.'],
    ['Length of a sheet of A4', 297, 'mm', 'm', 'Definitional: A4 is exactly 297 × 210 mm.']
  ],
  calc:function(v){ return (v[0] * 1e6) / v[1]; },
  unit:'sheets',
  note:'End to end, not stacked. Stacked, the same number of sheets is about forty metres tall.'
},
{
  id:'bananas', q:'How many bananas equal one chest X-ray?',
  rows:[
    ['Dose from eating one banana', 0.1, 'µSv', 'm', 'The banana equivalent dose, from its potassium-40.'],
    ['Dose from one chest X-ray', 20, 'µSv', 'm', 'A typical single posteroanterior chest radiograph.']
  ],
  calc:function(v){ return v[1] / v[0]; },
  unit:'bananas',
  note:'Your body regulates its own potassium, so the banana dose does not accumulate the way this ' +
       'sum implies. Radiation scientists dislike this comparison for exactly that reason.'
},
{
  id:'shoulders', q:'How many people standing on each other to reach space?',
  rows:[
    ['The Kármán line', 100, 'km', 'm', 'The conventional boundary of space.'],
    ['Average adult height', 1.7, 'm', 'm', 'Roughly the global adult mean.'],
    ['Height added per person in the stack', 85, '%', 'a', 'You stand on shoulders, not on heads.']
  ],
  calc:function(v){ return (v[0] * 1000) / (v[1] * (v[2] / 100)); },
  unit:'people',
  note:'The person at the bottom would be carrying about four thousand tonnes.'
},
{
  id:'rice', q:'How much rice on the last square of the chessboard?',
  rows:[
    ['Squares on a chessboard', 64, 'squares', 'm', 'Definitional.'],
    ['Mass of one grain of rice', 0.029, 'g', 'm', 'A long-grain average.']
  ],
  // grams -> tonnes is /1e6, and tonnes -> billion tonnes is /1e9.
  calc:function(v){ return Math.pow(2, v[0] - 1) * v[1] / 1e6 / 1e9; },
  unit:'billion tonnes',
  note:'That is the last square alone, and it is about half of the whole board. World rice ' +
       'production is roughly 500 million tonnes a year, so the final square is on the order of ' +
       'five centuries of the entire global harvest — not the five hundred thousand years you get ' +
       'if you slip a factor of a thousand, which is exactly what happened the first time this ' +
       'page was written.'
},
{
  id:'pigeons', q:'How many pigeons to carry a laptop?',
  rows:[
    ['Mass of a laptop', 1400, 'g', 'a', 'A 14-inch machine with its charger left behind.'],
    ['Mass of a feral pigeon', 350, 'g', 'm', 'The usual range is 300–400 g.'],
    ['Share of body weight a bird will carry', 10, '%', 'a', 'Racing pigeons carry small messages, not cargo.']
  ],
  calc:function(v){ return v[0] / (v[1] * (v[2] / 100)); },
  unit:'pigeons',
  note:'RFC 1149 defined how to send internet traffic by pigeon in 1990. It was tested in 2001. It worked.'
},
{
  id:'bath', q:'How long a shower equals one bath?',
  rows:[
    ['Water in a filled bath', 80, 'litres', 'm', 'A typical UK bath, filled to a sensible level.'],
    ['Flow of a standard shower', 9, 'litres/min', 'm', 'Mixer showers are commonly 8–12 litres a minute.']
  ],
  calc:function(v){ return v[0] / v[1]; },
  unit:'minutes',
  note:'A power shower can exceed 15 litres a minute, at which point the bath wins.'
}
];
