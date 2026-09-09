/* ------------------------------------------------------------------ *
 *  Comparisons that mess with intuition about time.
 *
 *  EVERY DATE IN THIS FILE IS REAL. Nothing is invented, rounded to make
 *  a better line, or asserted without a checkable date behind it. Where
 *  a date is genuinely a range or an estimate — a pyramid, an extinction
 *  — it is written as an estimate and the arithmetic is done on the
 *  estimate rather than on a false precision.
 *
 *  Each entry carries the numbers as well as the sentence, so the page
 *  can show the gaps rather than asking you to take the claim on trust.
 *  `check` is the fact a reader would want to verify.
 * ------------------------------------------------------------------ */
window.CLOSER = [
  {
    t: 'Cleopatra lived closer to the Moon landing than to the building of the Great Pyramid.',
    a: { what: 'The Great Pyramid of Giza completed', year: -2560, est: true },
    b: { what: 'Cleopatra born', year: -69 },
    c: { what: 'Apollo 11 lands on the Moon', year: 1969 },
    check: 'The Great Pyramid is dated to about 2560 BC; Cleopatra was born in 69 BC; Apollo 11 landed in July 1969. That is roughly 2,491 years back and 2,038 years forward.'
  },
  {
    t: 'More time separates Stegosaurus from Tyrannosaurus than separates Tyrannosaurus from you.',
    a: { what: 'Stegosaurus alive', year: -150000000, est: true },
    b: { what: 'Tyrannosaurus alive', year: -67000000, est: true },
    c: { what: 'You, reading this', year: 2026 },
    check: 'Stegosaurus is dated to roughly 155–150 million years ago and Tyrannosaurus to roughly 68–66 million. The gap between them is about 83 million years; the gap between T. rex and now is about 67 million.'
  },
  {
    t: 'Sharks are older than trees.',
    a: { what: 'The first sharks', year: -450000000, est: true },
    b: { what: 'The first trees', year: -385000000, est: true },
    c: { what: 'Now', year: 2026 },
    check: 'Shark-like fish appear in the fossil record around 450 million years ago. The earliest known trees, from the Middle Devonian, are around 385 million.'
  },
  {
    t: 'Oxford University was already teaching when the Aztec Empire was founded.',
    a: { what: 'Teaching begins at Oxford', year: 1096, est: true },
    b: { what: 'The Aztec Triple Alliance formed', year: 1428 },
    c: { what: 'Now', year: 2026 },
    check: 'There is evidence of teaching at Oxford from 1096. The Aztec Triple Alliance was formed in 1428 — over three hundred years later.'
  },
  {
    t: 'Woolly mammoths were still alive while the Great Pyramid was standing.',
    a: { what: 'The Great Pyramid completed', year: -2560, est: true },
    b: { what: 'The last mammoths, on Wrangel Island', year: -1650, est: true },
    c: { what: 'Now', year: 2026 },
    check: 'The isolated mammoth population on Wrangel Island survived until roughly 1650 BC — about nine hundred years after the Great Pyramid was finished.'
  },
  {
    t: 'The fax machine is older than the telephone.',
    a: { what: 'Alexander Bain patents an image-transmitting telegraph', year: 1843 },
    b: { what: 'Bell patents the telephone', year: 1876 },
    c: { what: 'Now', year: 2026 },
    check: 'Bain’s patent for transmitting images over wire was granted in 1843. Bell’s telephone patent is from 1876 — thirty-three years later.'
  },
  {
    t: 'Harvard was founded before calculus was invented.',
    a: { what: 'Harvard founded', year: 1636 },
    b: { what: 'Newton and Leibniz develop calculus', year: 1670, est: true },
    c: { what: 'Now', year: 2026 },
    check: 'Harvard was founded in 1636. Newton’s and Leibniz’s work on calculus dates from the 1660s and 1670s, and Leibniz first published in 1684.'
  },
  {
    t: 'Nintendo is older than the aeroplane.',
    a: { what: 'Nintendo founded, making playing cards', year: 1889 },
    b: { what: 'The Wright brothers fly at Kitty Hawk', year: 1903 },
    c: { what: 'Now', year: 2026 },
    check: 'Nintendo was founded on 23 September 1889. The Wright brothers flew on 17 December 1903 — fourteen years later.'
  },
  {
    t: 'Sixty-six years separate the first aeroplane flight from the Moon landing. That is one lifetime.',
    a: { what: 'First powered flight', year: 1903 },
    b: { what: 'Apollo 11 lands', year: 1969 },
    c: { what: 'Now', year: 2026 },
    check: '17 December 1903 to 20 July 1969 is sixty-five years and seven months. People born before the first flight were alive to watch the landing.'
  },
  {
    t: 'Betty White was older than sliced bread.',
    a: { what: 'Betty White born', year: 1922 },
    b: { what: 'Commercially sliced bread first sold', year: 1928 },
    c: { what: 'Now', year: 2026 },
    check: 'Betty White was born on 17 January 1922. The first commercially sliced loaf went on sale in Chillicothe, Missouri in July 1928.'
  },
  {
    t: 'Anne Frank and Martin Luther King Jr. were born in the same year.',
    a: { what: 'Martin Luther King Jr. born', year: 1929 },
    b: { what: 'Anne Frank born', year: 1929 },
    c: { what: 'Now', year: 2026 },
    check: 'King was born on 15 January 1929 and Frank on 12 June 1929, five months apart.'
  },
  {
    t: 'France was still using the guillotine when the first Star Wars film was in cinemas.',
    a: { what: 'Star Wars released', year: 1977 },
    b: { what: 'The last execution by guillotine in France', year: 1977 },
    c: { what: 'Now', year: 2026 },
    check: 'Star Wars opened on 25 May 1977. The last execution by guillotine in France took place on 10 September 1977 — three and a half months later.'
  },
  {
    t: 'The first Star Wars film is closer to the Moon landing than to today.',
    a: { what: 'Apollo 11 lands', year: 1969 },
    b: { what: 'Star Wars released', year: 1977 },
    c: { what: 'Now', year: 2026 },
    check: 'Eight years separate the Moon landing from Star Wars. Forty-nine separate Star Wars from now.'
  },
  {
    t: 'The Berlin Wall has now been down for longer than it stood.',
    a: { what: 'The Wall goes up', year: 1961 },
    b: { what: 'The Wall comes down', year: 1989 },
    c: { what: 'Now', year: 2026 },
    check: 'The Wall was built on 13 August 1961 and opened on 9 November 1989 — twenty-eight years. It has been down for over thirty-seven.'
  },
  {
    t: 'The first email was sent before the last person walked on the Moon.',
    a: { what: 'Ray Tomlinson sends the first networked email', year: 1971 },
    b: { what: 'Apollo 17, the last crewed Moon landing', year: 1972 },
    c: { what: 'Now', year: 2026 },
    check: 'Tomlinson sent the first email between two computers in 1971. Apollo 17 left the Moon on 14 December 1972.'
  },
  {
    t: 'Pluto had not completed a single orbit between its discovery and its reclassification.',
    a: { what: 'Pluto discovered', year: 1930 },
    b: { what: 'Pluto reclassified as a dwarf planet', year: 2006 },
    c: { what: 'Now', year: 2026 },
    check: 'Pluto was discovered on 18 February 1930 and reclassified on 24 August 2006 — seventy-six years of a two-hundred-and-forty-eight-year orbit. It still has not finished one.'
  },
  {
    t: 'Iceland’s parliament is older than the Norman conquest of England.',
    a: { what: 'The Althing first meets at Þingvellir', year: 930 },
    b: { what: 'The Norman conquest', year: 1066 },
    c: { what: 'Now', year: 2026 },
    check: 'The Althing was established at Þingvellir in 930, one hundred and thirty-six years before 1066.'
  },
  {
    t: 'The Ottoman Empire and the BBC ended and began in the same year.',
    a: { what: 'The BBC founded', year: 1922 },
    b: { what: 'The Ottoman sultanate abolished', year: 1922 },
    c: { what: 'Now', year: 2026 },
    check: 'The British Broadcasting Company was founded on 18 October 1922. The Ottoman sultanate was abolished on 1 November 1922, two weeks later.'
  },
  {
    t: 'Queen Elizabeth II’s reign began while Stalin was still alive.',
    a: { what: 'Elizabeth II accedes', year: 1952 },
    b: { what: 'Stalin dies', year: 1953 },
    c: { what: 'Now', year: 2026 },
    check: 'Elizabeth II acceded on 6 February 1952. Stalin died on 5 March 1953, thirteen months later.'
  },
  {
    t: 'The first video game was demonstrated before the Beatles released a single.',
    a: { what: 'Tennis for Two shown at Brookhaven', year: 1958 },
    b: { what: '“Love Me Do” released', year: 1962 },
    c: { what: 'Now', year: 2026 },
    check: 'Tennis for Two was demonstrated at a laboratory open day on 18 October 1958. “Love Me Do” came out on 5 October 1962.'
  },
  {
    t: 'The last survivor of the Titanic lived to see the twenty-first century.',
    a: { what: 'The Titanic sinks', year: 1912 },
    b: { what: 'Millvina Dean, the last survivor, dies', year: 2009 },
    c: { what: 'Now', year: 2026 },
    check: 'Millvina Dean was nine weeks old when the Titanic sank on 15 April 1912. She died on 31 May 2009, aged 97.'
  },
  {
    t: 'Machu Picchu is younger than Oxford, Cambridge and the Tower of London.',
    a: { what: 'The Tower of London begun', year: 1078 },
    b: { what: 'Machu Picchu built', year: 1450, est: true },
    c: { what: 'Now', year: 2026 },
    check: 'The White Tower was begun around 1078. Machu Picchu is dated to about 1450, nearly four hundred years later.'
  }
];
