/* ------------------------------------------------------------------ *
 *  Eighteen dilemmas.
 *
 *  Each has two defensible answers, and each answer is tagged with the
 *  tradition it leans on — so the page can tell you at the end not who
 *  was right, which it does not know, but what you kept choosing.
 *
 *  Tags:
 *    con  consequentialist — judge by outcomes, add up the results
 *    deo  deontological    — some acts are off the table whatever follows
 *    vir  virtue           — what would a decent person do, and become
 *    soc  contractualist   — what rule could everyone here agree to
 *
 *  Nothing here is drawn from a real case, and none of the people in
 *  them exist. Several are the classical thought experiments in their
 *  standard form, which is the point of including them.
 * ------------------------------------------------------------------ */
const SCHOOLS = {
  con: { name: 'Consequences',  blurb: 'You judge an act by what it brings about. The sums matter, and a rule that produces a worse world is a worse rule.' },
  deo: { name: 'Duties',        blurb: 'Some acts are ruled out whatever follows from them. A person is not a quantity to be traded against other quantities.' },
  vir: { name: 'Character',     blurb: 'You ask what a decent person would do here, and what doing it repeatedly would make of you.' },
  soc: { name: 'Agreement',     blurb: 'You look for the rule that everyone affected could accept in advance, not knowing which of them they would turn out to be.' }
};

const DILEMMAS = [
  {
    t: 'The lever',
    s: 'A runaway tram is heading for five track workers who cannot hear it. You are standing at a junction lever. Pull it and the tram goes down a side track, where one worker is standing. Nobody has time to warn anyone.',
    a: { label: 'Pull the lever', tag: 'con', why: 'Four people who would have died do not. If the numbers are all that separate the two tracks, the choice makes itself.' },
    b: { label: 'Leave it alone', tag: 'deo', why: 'Five deaths would be a catastrophe you witnessed. One death would be a thing you did. The distinction survives the arithmetic.' },
    note: 'Philippa Foot set this out in 1967, and most people say pull. The next one is the same arithmetic and almost nobody agrees to it, which is the interesting part.'
  },
  {
    t: 'The bridge',
    s: 'Same tram, same five workers. This time you are on a footbridge over the track beside a very large stranger. The only way to stop the tram in time is to push him off in front of it. He would certainly die. It would certainly work.',
    a: { label: 'Push him', tag: 'con', why: 'The arithmetic has not changed since the lever. If you would pull there, refusing here needs a reason that is about more than how it feels.' },
    b: { label: 'Keep your hands to yourself', tag: 'deo', why: 'Here the man is not in the way of your rescue; he is the mechanism of it. Using a person as equipment is a different act from redirecting a danger.' },
    note: 'Judith Jarvis Thomson added the footbridge in 1985 precisely because the answers diverge. Whatever separates the two cases is doing real moral work.'
  },
  {
    t: 'The transplant',
    s: 'Five patients will die tonight without transplants — different organs each. A healthy traveller is in the waiting room having a check-up. Nobody knows he is here. His organs would save all five.',
    a: { label: 'Operate', tag: 'con', why: 'Five lives against one, and the same sum you accepted at the lever.' },
    b: { label: 'Let him leave', tag: 'soc', why: 'No one would agree in advance to a medical system that harvests whoever walks in. The rule destroys the thing that makes hospitals work.' },
    note: 'Almost nobody says operate. If you pulled the lever and refuse here, the difference you are pointing at is worth naming.'
  },
  {
    t: 'The lifeboat',
    s: 'A boat holding nine can take one more. Twelve people are in the water. You are at the tiller and you can see all of them.',
    a: { label: 'Take whoever reaches you first', tag: 'soc', why: 'A rule anyone could have agreed to before they knew where they would be swimming. It does not pretend to be fair; it refuses to be arbitrary.' },
    b: { label: 'Choose who is likeliest to survive the night', tag: 'con', why: 'The seat should go where it does most good. Filling it with someone who will not last until morning wastes it.' },
    note: 'Both answers are rules. The failure mode here is not picking wrong; it is refusing to pick and losing the seat.'
  },
  {
    t: 'The promise',
    s: 'You promised a dying friend you would give his savings to his estranged brother. Nobody else knows. The brother is comfortable. A shelter you pass every day is closing for want of exactly that sum.',
    a: { label: 'Keep the promise', tag: 'deo', why: 'A promise made to someone who can no longer hold you to it is the only kind that tests whether you meant it.' },
    b: { label: 'Give it to the shelter', tag: 'con', why: 'The promise binds nobody now. The good it could do is real and countable, and the harm of breaking it falls on no one.' },
    note: 'W. D. Ross used cases like this to argue that duties can be real and still be outweighed — that a broken promise leaves a mark even when breaking it was right.'
  },
  {
    t: 'The lie at the door',
    s: 'A man you know to be violent knocks and asks whether your neighbour is hiding in your house. She is. He has never once been talked out of anything.',
    a: { label: 'Lie', tag: 'vir', why: 'Honesty is a habit worth having because of what it protects. Handing a hiding woman to the man hunting her is not what the habit is for.' },
    b: { label: 'Refuse to answer', tag: 'deo', why: 'You are not obliged to help him and not entitled to deceive him. Saying nothing keeps both.' },
    note: 'Kant said in 1797 you may not lie even here, which is the most famous hard case in his ethics and one most of his readers decline to follow him into.'
  },
  {
    t: 'The drowning child',
    s: 'You are walking to work in new shoes and pass a shallow pond where a small child is face-down. Wading in saves her and ruins the shoes. Nobody else is around.',
    a: { label: 'Wade in', tag: 'vir', why: 'Obviously. There is no version of a decent person who checks the price of the shoes first.' },
    b: { label: 'Wade in — and notice what follows', tag: 'con', why: 'If distance and the cost of shoes do not excuse you here, it is worth asking what makes them excuse you when the child is further away.' },
    note: 'Peter Singer set this out in 1972. Nobody finds the pond hard. The argument is about whether anything morally real separates it from a donation you did not make.'
  },
  {
    t: 'The experience machine',
    s: 'A machine can give you a lifetime of whatever experiences you would most want, indistinguishable from the real thing from the inside. You will not know you are in it. Nobody is harmed by your going in.',
    a: { label: 'Plug in', tag: 'con', why: 'If experience is what you actually value, refusing it is sentimentality about a distinction you would never be able to detect.' },
    b: { label: 'Stay out', tag: 'vir', why: 'You want to do things, not to have the sensation of having done them. A life spent in the tank is a life nobody lived.' },
    note: 'Robert Nozick proposed this in 1974 against the idea that pleasure is the only thing good in itself. Most people decline, and struggle to say exactly why.'
  },
  {
    t: 'The last dose',
    s: 'One dose of a drug is left. It will fully cure one patient, or hold four others at their current condition — uncomfortable but stable — for another year, by which time more may exist.',
    a: { label: 'Cure the one', tag: 'deo', why: 'A certain complete good now, for a person who is here, beats a hedged benefit for four that depends on a supply that may not come.' },
    b: { label: 'Hold the four', tag: 'con', why: 'Four person-years of stability against one cure, plus the real chance that waiting means everyone is treated. The odds favour it.' },
    note: 'Everything turns on how confident you are about next year. Notice whether you picked the answer first and the confidence afterwards.'
  },
  {
    t: 'The inheritance',
    s: 'A relative leaves you a sum that would change your life. You learn it came from something you find indefensible, done long ago, to people who cannot now be found or compensated.',
    a: { label: 'Take it and give it away', tag: 'con', why: 'The wrong already happened. Refusing the money undoes nothing and helps nobody; directing it somewhere useful at least does that.' },
    b: { label: 'Refuse it', tag: 'vir', why: 'Some things you decline in order to remain the sort of person who declines them, whether or not the declining helps anyone.' },
    note: 'There is a third answer — take it and keep it — that almost nobody defends out loud and a great many people choose.'
  },
  {
    t: 'The vaccine queue',
    s: 'You run a clinic with limited doses. You can work strictly by age, strictly by risk, or by lottery. Each rule leaves someone worse off, and each is defensible in a sentence.',
    a: { label: 'By risk', tag: 'con', why: 'The point of the doses is to prevent harm. Any rule that ignores who is likeliest to be harmed is prioritising something else.' },
    b: { label: 'By lottery', tag: 'soc', why: 'A lottery is the only rule nobody can game, resent as favouritism, or claim was written with them in mind.' },
    note: 'Real allocation schemes usually blend the two, which is not a fudge — it is an admission that both considerations are genuine.'
  },
  {
    t: 'The whistle',
    s: 'You find proof your employer is quietly doing something harmful but legal. Reporting it will end your career, and the harm is diffuse — many people slightly worse off, no identifiable victim.',
    a: { label: 'Blow the whistle', tag: 'vir', why: 'A diffuse harm is still a harm, and someone knowing about it and staying quiet is how it continues.' },
    b: { label: 'Stay and push from inside', tag: 'con', why: 'Gone, you change nothing. Still there, you have some chance of changing it. Martyrdom is not a plan.' },
    note: 'The second answer is honest and is also exactly what someone would tell themselves. Both things are true at once.'
  },
  {
    t: 'The veil',
    s: 'You are asked to design the rules of a society — how it distributes work, money, care and risk. You will then live in it, but you do not get to know as whom.',
    a: { label: 'Protect the worst-off position', tag: 'soc', why: 'You might be anyone. The rational move is to make the worst seat you could be handed as good as it can be.' },
    b: { label: 'Maximise the total', tag: 'con', why: 'Make the society as rich and capable as possible. A larger pile helps most people, including most of the unlucky.' },
    note: 'John Rawls argued for the first in 1971; the second is the standing objection to him. Which you pick may say more about your appetite for risk than your ethics.'
  },
  {
    t: 'The confession',
    s: 'A friend tells you in confidence that they did something serious years ago. Nobody was convicted. Someone else was suspected and still lives under it.',
    a: { label: 'Tell', tag: 'deo', why: 'A person is carrying a suspicion that belongs to someone else. Your friend chose to hand you that; the innocent one chose nothing.' },
    b: { label: 'Keep the confidence', tag: 'vir', why: 'What was said to you was said because it was safe to say. Being someone things can be said to is not nothing.' },
    note: 'Notice whether your answer would change if the person under suspicion were someone you knew.'
  },
  {
    t: 'The commons',
    s: 'Everyone in the valley can graze as many animals as they like. Each extra animal profits its owner and costs the pasture a little. Everyone can see where this ends. Nobody wants to be the only one who stops.',
    a: { label: 'Agree a limit and enforce it', tag: 'soc', why: 'The only stable answer is one everyone signs and everyone is held to. Unenforced restraint punishes exactly the people who show it.' },
    b: { label: 'Show restraint anyway', tag: 'vir', why: 'Someone has to be first, and a rule nobody is willing to keep before it is enforced will not be kept after.' },
    note: 'Elinor Ostrom spent a career showing real communities solve this more often than the standard telling allows — usually by the first answer, built from the second.'
  },
  {
    t: 'The ship',
    s: 'Over years, every plank of a ship is replaced. The old planks are gathered and assembled into a second ship. A dispute arises over which one is owed a debt the original ship incurred.',
    a: { label: 'The continuous one', tag: 'soc', why: 'Identity is what everyone treated as continuous throughout. The crew never once believed they had changed ships.' },
    b: { label: 'The reassembled one', tag: 'deo', why: 'It is the same matter in the same arrangement. The other is a copy that arrived one plank at a time.' },
    note: 'Not strictly an ethical puzzle, but it becomes one the moment something is owed — which is when questions of identity usually turn up.'
  },
  {
    t: 'The button',
    s: 'Pressing a button gives you a large sum and causes one death, somewhere, of someone you will never hear about, who would not otherwise have died. Nobody will ever connect it to you.',
    a: { label: 'Never', tag: 'deo', why: 'Distance and ignorance change what you can be caught for. They do not change what you did.' },
    b: { label: 'Ask what the money is for', tag: 'con', why: 'If the sum saves more lives than the one it costs, refusing on principle has a body count of its own.' },
    note: 'The second answer is where a great many funding and policy decisions actually live, minus the button.'
  },
  {
    t: 'The forecast',
    s: 'You can save a hundred people now, or fund work that will very likely save many thousands in forty years. The distant benefit is real but uncertain, and none of those people exist yet.',
    a: { label: 'The hundred in front of you', tag: 'vir', why: 'They are here and identifiable and you can actually do it. A future you have modelled is not the same kind of fact.' },
    b: { label: 'The thousands later', tag: 'con', why: 'A person in forty years counts the same as a person now. Preferring the near ones is a bias about time, not a moral principle.' },
    note: 'How steeply you discount the future is one of the few places where a moral disagreement can be written down as a number.'
  }
];
