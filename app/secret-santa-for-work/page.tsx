import Link from 'next/link'
import { GuideLayout } from '@/components/guide-layout'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Secret Santa for Work: Office & Remote Team Guide',
  description: 'Organise an office Secret Santa with an opt-in invitation, clear budget, name draw, remote delivery plan and practical advice for workplace gifts.',
  path: '/secret-santa-for-work',
})

export default function SecretSantaForWorkPage() {
  return (
    <GuideLayout
      title="How to organise Secret Santa for work"
      intro="A good office Secret Santa starts with a voluntary sign-up, a budget everyone is comfortable with and a clear plan for exchanging gifts. Confirm the group before drawing names, then send each person their own assignment."
      path="/secret-santa-for-work"
    >
      <section>
        <h2>Start with an invitation people can decline</h2>
        <p>Invite the team to opt in and give them a deadline. A friendly invitation should explain the budget, exchange date and whether remote colleagues can take part. Make it easy to decline privately, without asking people to explain their finances or holiday preferences.</p>
        <p>A smaller confirmed group is easier to organise than a full team list with uncertain participants. Santa Switch needs at least three people. Ask one organiser to maintain the final names so late replies do not accidentally create two versions of the draw.</p>
      </section>

      <section>
        <h2>Agree these details before you draw</h2>
        <dl className="space-y-5">
          <div><dt className="font-bold text-foreground">Budget</dt><dd className="mt-1 leading-relaxed">Choose a modest maximum with the group, such as £10 if that suits everyone. Say whether postage counts towards it and make clear that spending less is fine.</dd></div>
          <div><dt className="font-bold text-foreground">Gift preferences</dt><dd className="mt-1 leading-relaxed">Collect two or three interests and anything the person would rather not receive. Use an existing team form or message thread; these preferences are separate from the Santa Switch draw.</dd></div>
          <div><dt className="font-bold text-foreground">Exchange and delivery</dt><dd className="mt-1 leading-relaxed">Choose the office drop-off point or agree a postal plan. Give remote participants the same opportunity to receive and open a gift, even if they cannot join the office gathering.</dd></div>
          <div><dt className="font-bold text-foreground">Exclusions</dt><dd className="mt-1 leading-relaxed">Decide whether any pairs should not draw each other, such as partners or a manager and direct report. Add those exclusions before generating names and keep them limited enough for the draw to work.</dd></div>
          <div><dt className="font-bold text-foreground">Reveal</dt><dd className="mt-1 leading-relaxed">Tell people whether the giver will be revealed, guessed or kept anonymous. Ask everyone to label their wrapped gift with the recipient’s name.</dd></div>
        </dl>
      </section>

      <section>
        <h2>A simple planning schedule</h2>
        <p>Work backwards from your chosen celebration. This example gives people room to respond and shop; allow longer if you are coordinating deliveries across countries.</p>
        <ol className="mt-4 list-decimal pl-6">
          <li><strong>Four weeks before:</strong> invite participants, agree the budget and ask for preferences. Confirm a delivery or office collection plan.</li>
          <li><strong>Three weeks before:</strong> close sign-ups, check names and email addresses, add exclusions and draw once. Send the budget and deadlines separately alongside the draw announcement.</li>
          <li><strong>One week before:</strong> send a general reminder and ask anyone with a delivery problem to contact the organiser privately.</li>
          <li><strong>On the exchange day:</strong> check that every participant has a gift, include colleagues joining remotely and follow the reveal plan you agreed.</li>
        </ol>
      </section>

      <section>
        <h2>Draw your office Secret Santa names</h2>
        <p>Use the <Link href="/">Secret Santa name generator</Link> to add the final group and set exclusions. It assigns one recipient to each giver and prevents people from drawing themselves. An exclusion works in both directions, so neither person in an excluded pair can be assigned the other.</p>
        <p>Names alone are enough to generate a draw. Add an email address for every participant to use individual assignment emails. The organiser can reveal the results, so leave them hidden if you are taking part and want the other assignments to stay a surprise.</p>
        <p>Check details carefully before distributing assignments. If you regenerate the draw after a change, tell everyone that their previous assignment has been replaced. For the wider rules, including odd group sizes, see <Link href="/secret-santa-rules">how Secret Santa works</Link>.</p>
      </section>

      <section>
        <h2>Make remote participation straightforward</h2>
        <p>Ask participants which delivery arrangement works for them. An office collection point may suit hybrid teams; remote teams may need individual posting. Collect any necessary delivery details separately and share them only with the person who needs to send the gift.</p>
        <p>Agree who pays postage and check delivery estimates before choosing a reveal date. Across countries, a locally purchased gift or an agreed digital alternative may be easier to arrange. Let people report delays privately, and do not make someone’s participation depend on being on camera when gifts are opened.</p>
      </section>

      <section>
        <h2>Choose gifts that feel comfortable at work</h2>
        <p>Start with a hobby or preference the recipient has shared. Useful stationery, a small puzzle or a contribution to a favourite everyday ritual can be easier to get right than clothing or a personal joke. Check before buying food, alcohol or strongly scented products.</p>
        <p>Avoid gifts about someone’s body, personal life, performance or workplace status. If you do not know the person well, a thoughtful note with a practical gift is enough. The <Link href="/secret-santa-gift-ideas">Secret Santa gift ideas guide</Link> offers starting points for different budgets.</p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6">
        <h2>Copy and adapt this team invitation</h2>
        <blockquote className="border-l-2 border-secondary pl-4">
          <p>Would you like to join our team Secret Santa? It’s entirely optional. Please reply privately to [organiser] by [date] to join. The gift limit is [budget], with [postage arrangement]. We’ll exchange gifts on [date] at [location or remote plan]. Please include a few interests and any gifts you would prefer not to receive. Once the list is confirmed, we’ll draw names and send your assignment. Keep it secret until [reveal plan]!</p>
        </blockquote>
      </section>
    </GuideLayout>
  )
}
