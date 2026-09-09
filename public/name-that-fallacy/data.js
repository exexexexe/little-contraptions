/* ------------------------------------------------------------------ *
 *  Twenty-four fallacies, each with a real definition, two worked
 *  examples written for this page, and — the part that makes it worth
 *  more than trivia — what the argument would have to do instead.
 *
 *  Every example is invented. Nothing here is a real quotation and
 *  nobody in them is a real person: the speakers are a neighbour, a
 *  colleague, a man at a bus stop. An argument is easier to look at
 *  when there is no one to defend or attack.
 * ------------------------------------------------------------------ */
const FALLACIES = [
  {
    id: 'adhom',
    name: 'Ad hominem',
    gloss: 'attacking the arguer instead of the argument',
    def: 'The claim is answered by saying something about the person who made it. Even when the ' +
         'insult is accurate, it leaves the claim untouched.',
    fix: 'Answer the claim. A person can be insufferable and still be right about the drainage.',
    eg: [
      '"He says the bridge needs resurfacing, but he has been divorced twice and cannot keep a houseplant alive. I would not take his word for anything."',
      '"Of course the accountant wants us to keep better records. Have you seen her desk? Chaos."'
    ]
  },
  {
    id: 'straw',
    name: 'Straw man',
    gloss: 'answering a weaker argument than the one made',
    def: 'The opposing position is restated as something flimsier, and the flimsier thing is ' +
         'knocked down instead.',
    fix: 'State their argument in a form they would accept, then take issue with that.',
    eg: [
      '"You want a speed limit outside the school. So you think nobody should ever be allowed to drive anywhere."',
      '"She suggested we test the new process on one team first. Apparently she wants us to do nothing for a year."'
    ]
  },
  {
    id: 'dilemma',
    name: 'False dilemma',
    gloss: 'offering two options when there are more',
    def: 'A range of possibilities is presented as a pair, usually with one of the pair made ' +
         'obviously unacceptable.',
    fix: 'Ask what the third option is. There is almost always a third option.',
    eg: [
      '"Either we cut the whole programme, or we accept that the building will fall down. Choose."',
      '"You are either at every practice or you are not really on the team."'
    ]
  },
  {
    id: 'slippery',
    name: 'Slippery slope',
    gloss: 'a chain of consequences asserted, not shown',
    def: 'One step is said to lead inevitably to a distant and terrible one, with nothing offered ' +
         'for any of the links in between.',
    fix: 'Show the links. A slope is only slippery if you can say what makes it so.',
    eg: [
      '"If we let them put a bench in the square, next it is a kiosk, then a car park, and in ten years there is no square."',
      '"Start letting people work from home one day a week and eventually the office is an empty shell."'
    ]
  },
  {
    id: 'authority',
    name: 'Appeal to authority',
    gloss: 'citing a source with no standing in the matter',
    def: 'A claim is backed by who said it rather than by evidence — often someone eminent in an ' +
         'unrelated field. Citing a genuine expert in their own field is not this fallacy; it is ' +
         'ordinary good practice.',
    fix: 'Ask what the expert knows that you do not, and whether it is about this.',
    eg: [
      '"A Nobel laureate in chemistry says the housing market will recover by spring, so it will."',
      '"My dentist thinks the new traffic scheme is unworkable, and he is a very well-regarded dentist."'
    ]
  },
  {
    id: 'bandwagon',
    name: 'Appeal to popularity',
    gloss: 'many people believe it, so it is true',
    def: 'The number of people holding a view is offered as evidence for the view. Popularity ' +
         'tracks a lot of things; accuracy is only sometimes one of them.',
    fix: 'Ask what those people know. If they all heard it from the same place, that is one source.',
    eg: [
      '"Everyone on this street thinks the water tastes different since the works. That many people cannot be wrong."',
      '"It is the most downloaded app in the country, so it must be the best one."'
    ]
  },
  {
    id: 'posthoc',
    name: 'Post hoc',
    gloss: 'it happened after, so it happened because',
    def: 'Sequence is taken for cause. Written out in full it is *post hoc ergo propter hoc* — ' +
         'after this, therefore because of this.',
    fix: 'Look for the mechanism, and for the times the first thing happened and the second did not.',
    eg: [
      '"I started leaving the porch light on and the break-ins stopped. The light did it."',
      '"Sales went up the month after we changed the logo. The logo is working."'
    ]
  },
  {
    id: 'hasty',
    name: 'Hasty generalisation',
    gloss: 'a rule drawn from too few cases',
    def: 'A general conclusion is drawn from a sample too small or too odd to carry it.',
    fix: 'Ask how many, and how they were chosen.',
    eg: [
      '"Both of the plumbers I have used were late. Plumbers are unreliable."',
      '"I met two people from that town and neither could take a joke."'
    ]
  },
  {
    id: 'circular',
    name: 'Begging the question',
    gloss: 'the conclusion is already inside the premise',
    def: 'The thing being argued for is quietly assumed by the argument for it. The reasoning is ' +
         'valid and completely useless.',
    fix: 'Find a premise the other person already accepts and start from there instead.',
    eg: [
      '"The manual is authoritative because it says on the first page that it is the authority."',
      '"He is trustworthy. I know that because he told me so, and he would not lie."'
    ]
  },
  {
    id: 'herring',
    name: 'Red herring',
    gloss: 'changing the subject to something easier',
    def: 'An irrelevant point is introduced that draws attention away from the question actually ' +
         'on the table.',
    fix: 'Notice the swap, then ask the original question again.',
    eg: [
      '"You are asking why the accounts are late, but has anyone noticed how much the car park has improved?"',
      '"Never mind whether the roof leaks — do you know how hard it is to find a good builder these days?"'
    ]
  },
  {
    id: 'tuquoque',
    name: 'Tu quoque',
    gloss: 'you do it too, so the criticism does not count',
    def: 'Hypocrisy in the critic is offered as an answer to the criticism. It may be worth ' +
         'pointing out; it is not a reply.',
    fix: 'The critic being a hypocrite and the criticism being correct are entirely compatible.',
    eg: [
      '"You are telling me to stop leaving the gate open? You left it open all last summer."',
      '"He says the report is sloppy. His own reports are famously sloppy, so that is that."'
    ]
  },
  {
    id: 'ignorance',
    name: 'Appeal to ignorance',
    gloss: 'unproven false, therefore true',
    def: 'Absence of disproof is treated as proof — or absence of proof as disproof. The burden ' +
         'sits with whoever makes the claim.',
    fix: 'Ask who has to show what. Not knowing is a third state, and usually the honest one.',
    eg: [
      '"No one has ever shown the old mill is not haunted, so something is clearly going on in there."',
      '"They have not proved the additive is harmful, which means it is safe."'
    ]
  },
  {
    id: 'scotsman',
    name: 'No true Scotsman',
    gloss: 'redefining the group to exclude the counterexample',
    def: 'A universal claim meets a counterexample, and the claim is rescued by narrowing the ' +
         'definition until the counterexample no longer counts.',
    fix: 'Fix the definition before you look at the cases, not after.',
    eg: [
      '"No real gardener uses slug pellets." "My neighbour does, and her garden is magnificent." "Then she is not a real gardener."',
      '"Everyone in this club is dedicated." "Two people missed the whole season." "Well, they were never really members."'
    ]
  },
  {
    id: 'equiv',
    name: 'Equivocation',
    gloss: 'one word doing two jobs',
    def: 'A word shifts meaning between the start of the argument and the end, and the shift is ' +
         'what makes the conclusion seem to follow.',
    fix: 'Write the argument out with the two senses given different names and see if it survives.',
    eg: [
      '"The sign says fine for parking here, so it is fine to park here."',
      '"Nothing is better than a good night’s sleep, and a cold sandwich is better than nothing, so a cold sandwich is better than a good night’s sleep."'
    ]
  },
  {
    id: 'sunkcost',
    name: 'Sunk cost',
    gloss: 'continuing because of what is already spent',
    def: 'Money, time or effort already gone is used as a reason to carry on. It is gone either ' +
         'way; only what happens next is still a choice.',
    fix: 'Ask what you would do if you were arriving at this today with nothing already invested.',
    eg: [
      '"We are four years and a great deal of money into this. We cannot stop now."',
      '"I have sat through two hours of it. I may as well see how it ends."'
    ]
  },
  {
    id: 'falseeq',
    name: 'False equivalence',
    gloss: 'two unlike things treated as the same size',
    def: 'A shared feature is used to flatten a real difference in scale, evidence or severity.',
    fix: 'Name the dimension being compared, then compare on it honestly.',
    eg: [
      '"One report says the bridge is sound and one says it is not, so the science is split down the middle."',
      '"They both broke a rule — she parked on a yellow line and he drove into a wall."'
    ]
  },
  {
    id: 'nature',
    name: 'Appeal to nature',
    gloss: 'natural, therefore good',
    def: 'Being natural, traditional or unprocessed is treated as evidence of being safe, right ' +
         'or better.',
    fix: 'Ask what it does. Plenty of natural things are dreadful and plenty of artificial ones are not.',
    eg: [
      '"It is a completely natural remedy, so there is no harm in trying it."',
      '"We have always done the rota this way. That is how you know it works."'
    ]
  },
  {
    id: 'sharpshooter',
    name: 'Texas sharpshooter',
    gloss: 'drawing the target around the hits',
    def: 'A pattern is picked out of the data after the fact and then presented as though it had ' +
         'been predicted. Named for shooting at a barn and painting the bullseye afterwards.',
    fix: 'Say what you expect before you look, then look.',
    eg: [
      '"Three of the six people who got ill that week had eaten at the same place. Clearly it was the restaurant."',
      '"Look — every one of our best quarters came after a management offsite."'
    ]
  },
  {
    id: 'gambler',
    name: "Gambler's fallacy",
    gloss: 'a run has to even itself out',
    def: 'Independent events are expected to correct for their own history. The coin does not ' +
         'remember, and nothing is owed.',
    fix: 'Ask whether this event can possibly know about the last one.',
    eg: [
      '"Red has come up six times. Black is well overdue."',
      '"We have had four wet summers, so this one is bound to be dry."'
    ]
  },
  {
    id: 'goalposts',
    name: 'Moving the goalposts',
    gloss: 'the standard rises whenever it is met',
    def: 'Evidence is asked for, supplied, and then declared insufficient by a standard that was ' +
         'not the one originally set.',
    fix: 'Agree in advance what would settle it, and hold both sides to that.',
    eg: [
      '"Show me one study." "Here." "One is nothing. Show me ten." "Here are ten." "From this decade, though."',
      '"If it passes the trial I will believe it." "It passed." "A longer trial, obviously."'
    ]
  },
  {
    id: 'emotion',
    name: 'Appeal to emotion',
    gloss: 'feeling offered in place of a reason',
    def: 'Pity, fear, pride or outrage stands in for the argument. The feeling may be entirely ' +
         'appropriate and still not be evidence.',
    fix: 'Take the feeling seriously, then ask separately whether the claim is true.',
    eg: [
      '"You cannot cancel the fete. Think how disappointed the children will be."',
      '"Anyone who has ever waited up for a phone call knows this policy is wrong."'
    ]
  },
  {
    id: 'composition',
    name: 'Composition',
    gloss: 'true of the parts, so true of the whole',
    def: 'A property of the components is assumed to carry up to the thing they make. Its mirror ' +
         'image, division, runs the same mistake downward.',
    fix: 'Check whether the property is one that survives assembly. Many are not.',
    eg: [
      '"Every player in the squad is outstanding, so it must be an outstanding team."',
      '"Each part of the machine is light, so the machine is light."'
    ]
  },
  {
    id: 'survivor',
    name: 'Survivorship bias',
    gloss: 'only counting what made it through',
    def: 'A conclusion is drawn from the cases still visible, while the ones that failed and left ' +
         'the sample are not counted — and often cannot be.',
    fix: 'Ask what the missing cases would look like, and whether you would ever have seen them.',
    eg: [
      '"Every founder in this book dropped out of university, so dropping out must help."',
      '"Old buildings were better made — look how many are still standing."'
    ]
  },
  {
    id: 'motte',
    name: 'Motte and bailey',
    gloss: 'retreating to a milder claim when challenged',
    def: 'A strong, interesting claim is argued for; when it is attacked, the speaker falls back ' +
         'to a modest one nobody disputes, then returns to the strong one once the attack passes.',
    fix: 'Ask which claim is being defended, and hold the conversation to that one.',
    eg: [
      '"The whole scheme is corrupt." "That is a serious charge." "I only meant that no institution is perfect." "Fine." "So as I was saying, the whole scheme is corrupt."',
      '"Nobody should ever be interrupted." "In an emergency?" "Obviously I did not mean emergencies." "Right." "So interrupting is never acceptable."'
    ]
  }
];
