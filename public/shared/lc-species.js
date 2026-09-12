/* ------------------------------------------------------------------ *
 *  The species rotation.
 *
 *  Pulled out of /species-of-the-day/ so that the drawer and the desktop
 *  badge that shows today's species cannot drift apart. There is exactly
 *  one list and one rule for which day picks which entry, and both of
 *  them are here.
 *
 *  WHAT IS IN A ROW, AND WHAT DELIBERATELY IS NOT. A row holds a GBIF
 *  usage key, a scientific name and a common name — identifiers, not
 *  facts. Every actual fact about a species (its Red List category, its
 *  classification, how many records exist, which countries they came
 *  from) is fetched live from GBIF by whoever is displaying it. That is
 *  what stops this file quietly going stale, and what stops it ever
 *  stating a figure nobody published.
 *
 *  Every entry resolved EXACT against GBIF's backbone with a live Red
 *  List category before it was written down.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var LIST = [
    [5219416,"Panthera tigris","Tiger"],
    [5787213,"Panthera uncia","Snow leopard"],
    [5220111,"Diceros bicornis","Black rhinoceros"],
    [5220112,"Rhinoceros sondaicus","Javan rhinoceros"],
    [5219461,"Elephas maximus","Asian elephant"],
    [2435349,"Loxodonta cyclotis","African forest elephant"],
    [7262070,"Gorilla beringei","Eastern gorilla"],
    [5707420,"Pongo abelii","Sumatran orangutan"],
    [9311132,"Pongo tapanuliensis","Tapanuli orangutan"],
    [2433399,"Ailuropoda melanoleuca","Giant panda"],
    [5219317,"Lycaon pictus","African wild dog"],
    [2435270,"Acinonyx jubatus","Cheetah"],
    [2440665,"Phocoena sinus","Vaquita"],
    [2440339,"Eubalaena glacialis","North Atlantic right whale"],
    [2440735,"Balaenoptera musculus","Blue whale"],
    [2434779,"Monachus monachus","Mediterranean monk seal"],
    [9729967,"Dugong dugon","Dugong"],
    [2442225,"Chelonia mydas","Green turtle"],
    [8841716,"Eretmochelys imbricata","Hawksbill turtle"],
    [9789983,"Dermochelys coriacea","Leatherback turtle"],
    [2441814,"Gopherus agassizii","Mojave desert tortoise"],
    [2441348,"Crocodylus siamensis","Siamese crocodile"],
    [2441360,"Gavialis gangeticus","Gharial"],
    [5227650,"Sphenodon punctatus","Tuatara"],
    [2479236,"Strigops habroptila","Kakapo"],
    [2481920,"Gymnogyps californianus","California condor"],
    [2474941,"Grus americana","Whooping crane"],
    [2480810,"Nipponia nippon","Crested ibis"],
    [5229383,"Spheniscus mendiculus","Galapagos penguin"],
    [5229302,"Diomedea exulans","Wandering albatross"],
    [2474354,"Rhynochetos jubatus","Kagu"],
    [2496723,"Pharomachrus mocinno","Resplendent quetzal"],
    [5959227,"Ara macao","Scarlet macaw"],
    [5224602,"Amblyrhynchus cristatus","Marine iguana"],
    [2432037,"Andrias davidianus","Chinese giant salamander"],
    [2431950,"Ambystoma mexicanum","Axolotl"],
    [5216695,"Atelopus zeteki","Panamanian golden frog"],
    [2441273,"Latimeria chalumnae","Coelacanth"],
    [2417522,"Rhincodon typus","Whale shark"],
    [5216276,"Pristis pristis","Largetooth sawfish"],
    [2373980,"Thunnus thynnus","Atlantic bluefin tuna"],
    [5212973,"Anguilla anguilla","European eel"],
    [2402203,"Acipenser sturio","European sturgeon"],
    [5133088,"Danaus plexippus","Monarch butterfly"],
    [1340481,"Bombus affinis","Rusty patched bumble bee"],
    [2684120,"Sequoiadendron giganteum","Giant sequoia"],
    [5304574,"Dracaena cinnabari","Dragon blood tree"],
    [5663154,"Adansonia grandidieri","Grandidier's baobab"],
    [3702163,"Nepenthes rajah","Giant pitcher plant"],
    [2441184,"Bison bonasus","European bison"],
    [2441067,"Saiga tatarica","Saiga antelope"],
    [2441101,"Addax nasomaculatus","Addax"],
    [5220165,"Oryx dammah","Scimitar-horned oryx"],
    [2440894,"Equus grevyi","Grevy's zebra"],
    [2441247,"Hippopotamus amphibius","Hippopotamus"],
    [2441205,"Giraffa camelopardalis","Giraffe"],
    [5219446,"Ailurus fulgens","Red panda"],
    [2436346,"Myrmecophaga tridactyla","Giant anteater"],
    [5220096,"Priodontes maximus","Giant armadillo"],
    [5219638,"Manis pentadactyla","Chinese pangolin"],
    [5786559,"Smutsia gigantea","Giant pangolin"],
    [2433376,"Ornithorhynchus anatinus","Platypus"],
    [2440012,"Phascolarctos cinereus","Koala"],
    [2440301,"Vombatus ursinus","Common wombat"],
    [2435451,"Sarcophilus harrisii","Tasmanian devil"],
  ];

  /* The day, at the visitor's own midnight, so the badge and the drawer
     turn over together and neither is on somebody else's clock. */
  function dayNumber(d) {
    var t = d || new Date();
    var local = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.floor(local.getTime() / 86400000 - local.getTimezoneOffset() / 1440);
  }

  function pick(n) {
    return LIST[((n % LIST.length) + LIST.length) % LIST.length];
  }

  /* [key, scientificName, commonName] for today. */
  function today() { return pick(dayNumber()); }

  window.LCSpecies = {
    LIST: LIST,
    count: LIST.length,
    dayNumber: dayNumber,
    pick: pick,
    today: today
  };
})();
