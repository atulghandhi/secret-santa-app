export const secretSantaGuides = [
  {
    href: '/secret-santa-rules',
    title: 'Secret Santa rules',
    description: 'Agree a budget, draw names and keep the surprise. A practical guide for your first exchange.',
  },
  {
    href: '/secret-santa-for-work',
    title: 'Secret Santa for work',
    description: 'Plan an optional, welcoming office or remote team exchange with a ready-to-use invitation.',
  },
  {
    href: '/secret-santa-gift-ideas',
    title: 'Secret Santa gift ideas',
    description: 'Thoughtful gift themes for £5, £10 and £20 budgets, with a simple way to choose.',
  },
] as const

export const secretSantaFaqs = [
  {
    question: 'What is Secret Santa?',
    answer: 'Secret Santa is a gift exchange in which each person is assigned someone to buy a present for. Everyone gives one gift and receives one gift. The group agrees a budget and an exchange date, and usually keeps the giver’s identity secret until the gifts are opened.',
  },
  {
    question: 'How does this Secret Santa generator work?',
    answer: 'Add at least three participants, set any exclusions and select Generate Pairings. Santa Switch randomly assigns each person one recipient, prevents self-matches and respects your exclusions when it finds a valid draw. You can reveal the results on screen or send individual assignments by email after adding an email address for every participant.',
  },
  {
    question: 'Can I draw Secret Santa names without email addresses or an account?',
    answer: 'Yes. You can generate and reveal pairings in guest mode with names only. Email addresses are optional for drawing names; add one for every participant if you want to use email delivery. Sign in to save participant lists and exclusions for reuse. Guest lists are not saved when you leave or refresh the page.',
  },
  {
    question: 'Can I stop couples or family members drawing each other?',
    answer: 'Yes. Add an exclusion between two participants before generating pairings. Exclusions work both ways: if Alex and Sam are excluded, Alex cannot give to Sam and Sam cannot give to Alex. Too many exclusions can prevent a valid draw, especially in a small group.',
  },
  {
    question: 'Does Secret Santa work with an odd number of people?',
    answer: 'Yes. An odd number works because each person gives to one recipient and receives from one giver; participants do not need to form two-person pairs. Santa Switch needs at least three participants, and your exclusions must leave a valid set of assignments.',
  },
  {
    question: 'Can the organiser see the Secret Santa assignments?',
    answer: 'Yes. The organiser can reveal an individual assignment or all assignments on the results screen. Results are initially hidden on screen, but they are accessible to the organiser. If you are also participating and want a surprise, leave the results hidden and use email delivery.',
  },
  {
    question: 'Can I redraw names if someone joins or drops out?',
    answer: 'You can update the participant list and generate new pairings. A redraw can change everyone’s recipient, so finalise the group before sending assignments. If you have already shared a draw, tell every participant that it is being replaced and confirm the new assignment before anyone shops.',
  },
] as const
