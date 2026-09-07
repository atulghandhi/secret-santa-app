import Link from 'next/link'
import { GuideLayout } from '@/components/guide-layout'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Secret Santa Gift Ideas for £5, £10 & £20 Budgets',
  description: 'Find thoughtful Secret Santa gift themes for small budgets, colleagues, friends and family, plus a checklist for choosing a personal present.',
  path: '/secret-santa-gift-ideas',
})

export default function SecretSantaGiftIdeasPage() {
  return (
    <GuideLayout
      title="Secret Santa gift ideas by budget"
      intro="Choose a Secret Santa gift by combining one thing your recipient enjoys with the group’s spending limit. A useful small gift or a thoughtful homemade present can feel more personal than an expensive surprise."
      path="/secret-santa-gift-ideas"
    >
      <section>
        <h2>Start with the person, then the budget</h2>
        <p>Look for a clue in something they have shared: a favourite hobby, a daily routine or an interest they are exploring. Choose something they can use without needing a particular size, device or account. If you are uncertain, ask the organiser to collect a few ideas from everyone so the question does not reveal who drew whom.</p>
        <p>The budgets below are planning guides, not current product prices or promises that an item will fit the limit. Check the total cost, including any wrapping and delivery your group has agreed to include. You do not need to spend the full amount.</p>
      </section>

      <section>
        <h2>Ideas for a £5 Secret Santa budget</h2>
        <p>At a small budget, one well-chosen detail can do most of the work. Keep packaging simple and choose something connected to the recipient’s interests.</p>
        <ul className="mt-4 list-disc pl-6">
          <li><strong>For a reader:</strong> a handmade bookmark with a short note about a book you think they would enjoy. If your group welcomes second-hand gifts, a carefully chosen used book is another possibility.</li>
          <li><strong>For someone who likes to cook:</strong> a handwritten favourite recipe paired with a small ingredient they can use, after checking their food preferences.</li>
          <li><strong>For a gardener:</strong> a small packet of seeds suited to the space they have, with a homemade plant label.</li>
          <li><strong>For a stationery fan:</strong> one useful pen or a pocket notebook, chosen around the way they work or sketch.</li>
          <li><strong>For a friend:</strong> a printed photo or a handwritten collection of shared memories, if that fits your group’s gift rules.</li>
        </ul>
      </section>

      <section>
        <h2>Ideas for a £10 Secret Santa budget</h2>
        <p>Think about upgrading a small part of someone’s day. One coherent gift usually feels more considered than several unrelated filler items.</p>
        <ul className="mt-4 list-disc pl-6">
          <li><strong>A tea or coffee moment:</strong> a small selection in a style they already drink. Check whether they need whole beans, ground coffee, loose leaves or bags before buying.</li>
          <li><strong>A screen-free break:</strong> a compact puzzle, a puzzle book or a simple card game matched to their interests and who they might play with.</li>
          <li><strong>A desk companion:</strong> a small notebook, a practical cable organiser or a coaster in a design that suits them.</li>
          <li><strong>A creative prompt:</strong> a small sketchbook, an entry-level craft material or a pattern connected to a hobby they have mentioned.</li>
          <li><strong>A cooking theme:</strong> a useful utensil or a small ingredient selection that fits their kitchen habits and dietary preferences.</li>
        </ul>
      </section>

      <section>
        <h2>Ideas for a £20 Secret Santa budget</h2>
        <p>A larger limit gives you room for a more complete version of a familiar interest. Avoid creating an obligation to take up a hobby or buy extra equipment.</p>
        <ul className="mt-4 list-disc pl-6">
          <li><strong>For an enthusiastic reader:</strong> a book from an interest they have mentioned, or an agreed bookshop voucher if the group welcomes vouchers.</li>
          <li><strong>For someone who brings lunch:</strong> a practical lunch container or reusable cup, after checking size, cleaning requirements and what they already own.</li>
          <li><strong>For a games fan:</strong> a compact tabletop game with a player count and playing time that fit their household.</li>
          <li><strong>For a maker:</strong> a small kit with the materials included, suited to their experience level and the space they have.</li>
          <li><strong>For a home cook:</strong> one useful kitchen item or a themed ingredient gift, guided by something they actually like preparing.</li>
        </ul>
      </section>

      <section>
        <h2>What should you buy a colleague you do not know well?</h2>
        <p>Use preferences collected for the exchange rather than guessing from age, gender or job title. A practical notebook, a compact puzzle or a gift related to a hobby they have volunteered can be a comfortable starting point. Include a short, friendly note to make a simple present feel intentional.</p>
        <p>Check before buying food, drink, fragrances or clothing. Keep joke gifts away from someone’s body, identity or private life. For a team exchange, the <Link href="/secret-santa-for-work">office Secret Santa guide</Link> includes a way to gather interests without spoiling the draw.</p>
      </section>

      <section>
        <h2>Homemade and low-waste options</h2>
        <p>If your group agrees, a handmade card, a mended or upcycled item, a second-hand book or a small plant cutting can make a personal gift. Match the effort to something the recipient wants: homemade should still be useful or enjoyable for them.</p>
        <p>For homemade food, check whether the recipient wants it and share the ingredients. Reuse a gift bag or wrap in paper you already have, then label it clearly for the right person. Avoid elaborate packaging that uses most of the gift budget.</p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6">
        <h2>A final check before you choose</h2>
        <ul className="list-disc pl-6">
          <li>Does it connect to something this person actually enjoys?</li>
          <li>Does the total fit the agreed budget and postage rules?</li>
          <li>Can they use it without buying something else?</li>
          <li>Have you checked relevant food preferences, sizes or compatibility?</li>
          <li>Will it arrive before the exchange, with the recipient’s name on it?</li>
        </ul>
        <p className="mt-4">Still organising the exchange? Agree the <Link href="/secret-santa-rules">Secret Santa rules</Link> first, then <Link href="/">draw your names</Link> before anyone starts shopping.</p>
      </section>
    </GuideLayout>
  )
}
