/* ------------------------------------------------------------------ *
 *  What the flag says about the country.
 *
 *  Nothing here is rolled independently of what you chose. The pattern
 *  decides how the place is governed and how it was founded; the field
 *  colour decides the landscape; the charge decides what they believe;
 *  the second colour decides what they argue about. Change one thing on
 *  the flag and exactly the part of the country it speaks for changes.
 *
 *  Every nation, name, dish and law is invented. None of it describes a
 *  real place, and the map is not a map of anywhere.
 * ------------------------------------------------------------------ */

const PATTERNS = [
  { id: 'bicolour',  name: 'Two bands',        gov: 'a federation of two old rivals',
    hist: 'was two countries until a treaty nobody has read in a century made it one, and the halves still keep separate clocks' },
  { id: 'tricolour', name: 'Three bands',      gov: 'a republic, loudly',
    hist: 'threw out a monarchy, then a council, then the people who threw out the council, and has been careful ever since' },
  { id: 'vertical',  name: 'Three uprights',   gov: 'a republic with a very long constitution',
    hist: 'was assembled from three provinces that agreed on the border first and everything else later' },
  { id: 'cross',     name: 'An off-centre cross', gov: 'a constitutional monarchy that has mislaid the monarch',
    hist: 'grew outward from a single crossroads market, and the road names still radiate from it' },
  { id: 'saltire',   name: 'A saltire',        gov: 'four provinces and a rotating capital',
    hist: 'was divided into quarters by a surveyor who was paid by the line, and has never bothered to undo it' },
  { id: 'hoist',     name: 'A hoist triangle', gov: 'a young republic with an old grudge',
    hist: 'declared itself independent on a Tuesday and spent forty years persuading its neighbours to notice' },
  { id: 'canton',    name: 'A canton',         gov: 'a confederation of harbour towns',
    hist: 'began as a trading company that kept buying land until somebody pointed out it had become a country' },
  { id: 'quarters',  name: 'Quarters',         gov: 'a council of four families, in theory retired',
    hist: 'was split between four heirs and reassembled by their grandchildren, who each kept a corner' }
];

const FIELDS = [
  { id: 'green',  name: 'Green',  hex: '#2E7D4F', land: 'wet upland pasture and more rain than anyone will admit to',
    crop: 'oats, and a hard cheese aged in the wall cavities of houses' },
  { id: 'blue',   name: 'Blue',   hex: '#1F5C9E', land: 'a long coast, a great many islands, and one road that goes round the lot',
    crop: 'shellfish, and a flatbread cooked on stones' },
  { id: 'red',    name: 'Red',    hex: '#B03A32', land: 'iron country — red soil, red dust, red water in the taps',
    crop: 'root vegetables and a sausage nobody exports' },
  { id: 'sand',   name: 'Sand',   hex: '#D6A85B', land: 'a dry interior with the whole population living on its rim',
    crop: 'dates, salt, and a tea served in three progressively smaller cups' },
  { id: 'black',  name: 'Black',  hex: '#232628', land: 'old volcanic ground that grows almost anything and terrifies visitors',
    crop: 'vines, and a bread baked black on purpose' },
  { id: 'white',  name: 'White',  hex: '#EDEDE6', land: 'high plateau, thin air, and a horizon in every direction',
    crop: 'barley, and a fermented milk drink outsiders describe carefully' },
  { id: 'purple', name: 'Purple', hex: '#5B3A78', land: 'heather moor and peat bog, mapped only where it is safe to walk',
    crop: 'honey, and a smoked fish that is an acquired taste even locally' },
  { id: 'teal',   name: 'Teal',   hex: '#1E7C7C', land: 'river delta, half of it underwater half of the year',
    crop: 'rice, eels, and a fruit that is illegal to pick before it falls' }
];

const CHARGES = [
  { id: 'none',     name: 'Nothing',        belief: 'no state religion and a national suspicion of anyone who has one' },
  { id: 'star',     name: 'A single star',  belief: 'a calendar built on one star, and a new year that arrives at a slightly different hour each time' },
  { id: 'sun',      name: 'A sun',          belief: 'a solar reckoning so precise that the country runs eleven minutes ahead of its neighbours' },
  { id: 'crescent', name: 'A crescent',     belief: 'a lunar calendar, and a month that everyone agrees is longer than the others' },
  { id: 'tree',     name: 'A tree',         belief: 'a founding myth involving one tree, which is still there, and is fenced' },
  { id: 'anchor',   name: 'An anchor',      belief: 'no gods to speak of, but an absolute conviction that the sea is owed something' },
  { id: 'key',      name: 'A key',          belief: 'a civic faith in locked things, and a national archive nobody may enter' },
  { id: 'bird',     name: 'A bird',         belief: 'an augury tradition that the government pretends to have abolished' }
];

const ACCENTS = [
  { id: 'gold',   name: 'Gold',   hex: '#E0B252', argue: 'money, and who has quietly kept more of it than they let on' },
  { id: 'white2', name: 'White',  hex: '#F2F2EC', argue: 'the wording of the anthem, which has been amended nine times' },
  { id: 'black2', name: 'Black',  hex: '#1A1C1E', argue: 'a war that ended long ago and is refought every spring in the papers' },
  { id: 'red2',   name: 'Red',    hex: '#C0453C', argue: 'the border with the north, which moves whenever the river does' },
  { id: 'blue2',  name: 'Blue',   hex: '#2A6BB0', argue: 'fishing rights, endlessly, with everyone including themselves' },
  { id: 'green2', name: 'Green',  hex: '#3C8A5A', argue: 'whether the forest belongs to the state, the villages, or the forest' }
];

/* Things that vary but are not claims about the country's character —
   safe to seed from the name alone. */
const HOLIDAYS = [
  'a midsummer night on which no one may sleep indoors',
  'a day in autumn when debts under a certain sum are simply cancelled',
  'a spring morning when the youngest child in a house gives the orders',
  'a winter feast at which the previous year is formally complained about',
  'a harvest day when every door in a village is repainted the same colour',
  'an evening in February when the whole country turns its lights off for one hour and nobody agrees why'
];
const CUSTOMS = [
  'It is rude to arrive on time and ruder to say so.',
  'Bread is broken with the left hand, and the reason has been lost.',
  'Nobody says goodbye. They say "later", even when there is no later.',
  'Gifts are opened in private and thanked for in writing, weeks afterwards.',
  'The oldest person present pours, whatever their standing otherwise.',
  'You do not ask a person what they do. You ask what they are growing.'
];
const LAWS = [
  'It remains illegal to whistle in the parliament building.',
  'Every settlement above a certain size must maintain a public clock, and may not fix it.',
  'A ferryman may refuse any passenger once, and must state no reason.',
  'Church bells and factory whistles may not sound within a minute of each other.',
  'Any road built for a coronation must be maintained in perpetuity, coronation or not.',
  'The national bird may not be depicted in advertising, an offence still occasionally prosecuted.'
];

/* ---- names ------------------------------------------------------- */
const NAME_A = ['Vel', 'Cor', 'Mar', 'Ost', 'Kal', 'Ther', 'Bran', 'Nor', 'Sel', 'Vad', 'Erth', 'Lom', 'Ard', 'Pel'];
const NAME_B = ['an', 'esk', 'ova', 'ish', 'ard', 'oney', 'stra', 'ien', 'alt', 'urn', 'ica', 'olm'];
const NAME_C = ['ia', 'land', 'mark', 'stan', 'any', 'or', '', '', 'gard', 'holm'];
