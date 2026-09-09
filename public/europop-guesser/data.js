/* ------------------------------------------------------------------ *
 *  The pool.
 *
 *  Real tracks, real artists, real release years — factual reference,
 *  the same footing as the movie-night metadata. Nothing here is
 *  invented and nothing is hosted: the audio is fetched at play time
 *  from Deezer's own preview endpoint and played from their CDN.
 *
 *  Years are the year the single came out. Where a track's release year
 *  and its year of international success genuinely differ, and I could
 *  not be confident which to use, it was left out rather than guessed.
 *  That is why a few very famous ones from 1998-1999 are missing.
 *
 *  [title, artist, year]
 * ------------------------------------------------------------------ */
window.TRACKS = [
  ['Lady (Hear Me Tonight)', 'Modjo', 2000],
  ['Toca’s Miracle', 'Fragma', 2000],
  ['Played-A-Live (The Bongo Song)', 'Safri Duo', 2000],
  ['Castles in the Sky', 'Ian Van Dahl', 2000],
  ['Turn the Tide', 'Sylver', 2000],
  ['Something', 'Lasgo', 2001],
  ['Heaven', 'DJ Sammy', 2002],
  ['All the Things She Said', 't.A.T.u.', 2002],
  ['Moonlight Shadow', 'Groove Coverage', 2002],
  ['Take Me Away', '4 Strings', 2002],
  ['Désenchantée', 'Kate Ryan', 2002],
  ['Satisfaction', 'Benny Benassi', 2002],
  ['Come with Me', 'Special D.', 2003],
  ['Weekend!', 'Scooter', 2003],
  ['Pump It Up', 'Danzel', 2004],
  ['Call on Me', 'Eric Prydz', 2004],

  ['From Paris to Berlin', 'Infernal', 2005],
  ['Listen to Your Heart', 'DHT', 2005],
  ['The Sound of San Francisco', 'Global Deejays', 2005],
  ['I Like the Way', 'Bodyrockers', 2005],
  ['Boten Anna', 'Basshunter', 2006],
  ['Cry for You', 'September', 2006],
  ['Everytime We Touch', 'Cascada', 2006],
  ['Destination Calabria', 'Alex Gaudino', 2007],
  ['Let Me Think About It', 'Ida Corr', 2007],
  ['Now You’re Gone', 'Basshunter', 2008],
  ['Hot', 'Inna', 2009],
  ['Stereo Love', 'Edward Maya', 2009],

  ['Mr. Saxobeat', 'Alexandra Stan', 2010],
  ['Sun Is Up', 'Inna', 2010],
  ['Levels', 'Avicii', 2011],
  ['Don’t You Worry Child', 'Swedish House Mafia', 2012],
  ['Million Voices', 'Otto Knows', 2012],
  ['I Love It', 'Icona Pop', 2012],
  ['Euphoria', 'Loreen', 2012],
  ['Animals', 'Martin Garrix', 2013],
  ['Jubel', 'Klingande', 2013],
  ['Heroes (We Could Be)', 'Alesso', 2014],
  ['Waves', 'Mr. Probz', 2014],

  ['Faded', 'Alan Walker', 2015],
  ['Easy Love', 'Sigala', 2015],
  ['Sugar', 'Robin Schulz', 2015],
  ['Stole the Show', 'Kygo', 2015],
  ['Lush Life', 'Zara Larsson', 2015],
  ['Alone', 'Alan Walker', 2016],
  ['Rockabye', 'Clean Bandit', 2016],
  ['Symphony', 'Clean Bandit', 2017],
  ['Sweet but Psycho', 'Ava Max', 2018],
  ['Piece of Your Heart', 'Meduza', 2019],
  ['Ride It', 'Regard', 2019],
  ['Breaking Me', 'Topic', 2020],
  ['Head & Heart', 'Joel Corry', 2020],
  ['Hypnotized', 'Purple Disco Machine', 2020]
];

window.ERAS = [
  { id:'all',  n:'All',       lo:2000, hi:2020 },
  { id:'e00',  n:'2000–2004', lo:2000, hi:2004 },
  { id:'e05',  n:'2005–2009', lo:2005, hi:2009 },
  { id:'e10',  n:'2010–2014', lo:2010, hi:2014 },
  { id:'e15',  n:'2015–2020', lo:2015, hi:2020 }
];
