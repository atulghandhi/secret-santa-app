import Link from 'next/link'
import { GuideLayout } from '@/components/guide-layout'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Secret Santa Rules: How to Organise a Gift Exchange',
  description: 'Learn how Secret Santa works, set a gift budget, draw names with exclusions and handle odd numbers, late joiners and the gift reveal.',
  path: '/secret-santa-rules',
})

export default function SecretSantaRulesPage() {
  return (
    <GuideLayout
      title="Secret Santa rules"
      intro="In Secret Santa, everyone draws one person to buy a gift for and receives one gift from someone else. Agree a budget and a date, keep your recipient a secret, and bring a labelled present to the exchange."
      path="/secret-santa-rules"
    >
      <section>
        <h2>The six rules to agree before drawing names</h2>
        <ol className="list-decimal space-y-4 pl-6">
          <li><strong>Make a confirmed participant list.</strong> Ask who wants to join before adding names. Santa Switch needs at least three people. Give people with the same first name a distinguishing initial so nobody buys for the wrong person.</li>
          <li><strong>Choose a comfortable spending limit.</strong> Set one maximum for everyone and say whether wrapping and postage are included. The limit is a ceiling, so a thoughtful gift can cost less.</li>
          <li><strong>Set the exchange date and delivery plan.</strong> Decide where gifts should go, when they must arrive and whether you will open them together. For posted gifts, leave time for delivery before the reveal.</li>
          <li><strong>Agree any exclusions.</strong> For example, partners or people in the same household may prefer to buy for someone else. In Santa Switch, an exclusion prevents both people from drawing each other.</li>
          <li><strong>Draw once the details are settled.</strong> Each person should get one recipient, nobody should draw themselves and everyone should receive exactly one gift. Keep the assignment private.</li>
          <li><strong>Label the gift with the recipient’s name.</strong> Leave your own name off if you are keeping the giver secret. Decide together whether to reveal the Santas after opening or leave everyone guessing.</li>
        </ol>
      </section>

      <section>
        <h2>How to draw names online</h2>
        <p>Open the <Link href="/">Secret Santa generator</Link>, name your exchange and add the participants. Add any exclusions, then select Generate Pairings. The results let the organiser reveal one assignment at a time or all of them together.</p>
        <p>You can draw using names only in guest mode. To send individual assignments by email, add an email address for every participant first. The organiser can see the assignments, so anyone organising and participating should leave the results hidden if they want to preserve their own surprise.</p>
        <p>Sign in to save participant lists and exclusions for reuse. A saved participant list is useful for a future exchange; reopening it starts with no displayed pairings. Make sure participants have received their current assignment before closing a guest session.</p>
      </section>

      <section>
        <h2>Does an odd number of people work?</h2>
        <p>Yes. Secret Santa is an assignment of givers to recipients, rather than a set of two-person pairs. For a three-person group, Alex could give to Sam, Sam to Jo, and Jo to Alex. Everyone gives once and receives once.</p>
        <p>The same principle works with five, seven or more people. Exclusions can still make a draw impossible: in a three-person exchange, preventing any two participants from drawing each other leaves no complete valid draw. Keep restrictions modest and review them if the generator cannot produce pairings.</p>
      </section>

      <section>
        <h2>What if someone joins late or drops out?</h2>
        <p>Before assignments go out, update the group and generate a new draw. Once assignments have been shared, a redraw can change everyone’s recipient. Tell the entire group the old draw is cancelled, check whether anyone has already bought a gift, then agree how to proceed before sending replacements.</p>
        <p>For a late joiner, offering a place in the next exchange may be less confusing than replacing a draw after shopping has started. For a dropout, the organiser should privately confirm that nobody is left expecting a gift that will not arrive. Avoid quietly swapping a single name without checking the full set of givers and recipients.</p>
      </section>

      <section>
        <h2>Keep the gift rules simple</h2>
        <ul className="list-disc pl-6">
          <li>Ask each person for a few interests and any gift preferences through your usual group chat or invitation. Santa Switch handles the draw; collect these details separately.</li>
          <li>Check preferences before choosing food, drink, scented products or clothing. An unfamiliar colleague may appreciate a useful, neutral gift.</li>
          <li>Agree whether handmade, second-hand or joke gifts are welcome. Do not assume everyone shares the same sense of humour.</li>
          <li>Keep to the agreed budget. A small personal touch is better than making the exchange feel like a spending competition.</li>
        </ul>
        <p className="mt-4">Use the <Link href="/secret-santa-gift-ideas">gift ideas by budget</Link> for inspiration, or follow the <Link href="/secret-santa-for-work">workplace organiser guide</Link> for an office or remote team.</p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6">
        <h2>A short rules message to share</h2>
        <blockquote className="border-l-2 border-secondary pl-4">
          <p>We’re organising a Secret Santa! Please confirm by [sign-up date] if you’d like to join. Our gift limit is [budget], with [postage included/separate]. Gifts should arrive at [location] by [date]. You’ll receive one person to buy for. Keep their name secret, label the gift for them, and leave your own name off until our reveal. Please send [organiser] a couple of interests and anything you would prefer not to receive.</p>
        </blockquote>
      </section>
    </GuideLayout>
  )
}
