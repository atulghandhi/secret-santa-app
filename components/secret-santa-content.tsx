import Link from 'next/link'
import { ArrowRight, Gift, ListChecks, Shuffle } from 'lucide-react'
import { secretSantaFaqs, secretSantaGuides } from '@/lib/secret-santa-content'

const steps = [
  {
    title: 'Add your group',
    description: 'Enter at least three names. Email addresses are optional for drawing names; add them for everyone if you want to send assignments by email.',
    icon: ListChecks,
  },
  {
    title: 'Set exclusions and draw',
    description: 'Choose any people who should not draw each other, then generate your pairings. Nobody draws themselves, and each person gives and receives one gift.',
    icon: Shuffle,
  },
  {
    title: 'Share the assignments',
    description: 'Reveal results individually or send the assignments by email. Agree your budget and exchange date with the group separately, then enjoy choosing a gift.',
    icon: Gift,
  },
]

export function SecretSantaContent() {
  return (
    <div className="mt-20 space-y-16">
      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-2xl font-extrabold text-foreground sm:text-3xl">How to draw Secret Santa names online</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Secret Santa lets everyone in a group give one present and receive one in return.
          Santa Switch handles the name draw for friends, families and colleagues, including
          exclusions for people who should not be matched.
        </p>
        <ol className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-border/70 bg-card p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-secondary-foreground" aria-hidden="true">
                <step.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-foreground">{index + 1}. {step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Organising for the first time? Read the{' '}
          <Link href="/secret-santa-rules" className="font-semibold text-foreground underline underline-offset-4">Secret Santa rules</Link>
          {' '}before you send the draw. Finalise the group first: redrawing can change everyone’s assignment.
        </p>
      </section>

      <section aria-labelledby="secret-santa-faq">
        <h2 id="secret-santa-faq" className="text-2xl font-extrabold text-foreground sm:text-3xl">Secret Santa questions, answered</h2>
        <div className="mt-6 divide-y divide-border/70">
          {secretSantaFaqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer rounded-sm font-bold leading-relaxed text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
                {faq.question}
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="exchange-guides">
        <h2 id="exchange-guides" className="text-2xl font-extrabold text-foreground sm:text-3xl">Make your gift exchange a little easier</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {secretSantaGuides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:bg-secondary/20 focus-visible:outline-2 focus-visible:outline-offset-4">
              <h3 className="font-bold text-foreground">{guide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">Read the guide <ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
