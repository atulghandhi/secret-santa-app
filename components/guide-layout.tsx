import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Gift } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { StructuredData } from '@/components/structured-data'
import { secretSantaGuides } from '@/lib/secret-santa-content'
import { absoluteUrl } from '@/lib/seo'

interface GuideLayoutProps {
  title: string
  intro: string
  path: string
  children: ReactNode
}

export function GuideLayout({ title, intro, path, children }: GuideLayoutProps) {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Secret Santa generator', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: title, item: absoluteUrl(path) },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-blue/30 via-background to-pastel-pink/20">
      <StructuredData data={breadcrumbs} />
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 rounded-sm font-extrabold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
            <Gift aria-hidden="true" className="h-6 w-6 text-primary" />
            Santa Switch
          </Link>
          <Link href="/" className="rounded-xl bg-secondary/50 px-4 py-2 text-sm font-bold text-secondary-foreground hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-4">Draw names</Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="underline underline-offset-4 hover:text-foreground">Secret Santa generator</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <p className="mb-3 text-sm font-semibold text-christmas-green">The Santa Switch guide</p>
            <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>
          </header>
          <div className="space-y-10 text-muted-foreground [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_p]:leading-relaxed [&_p+p]:mt-4 [&_li]:leading-relaxed [&_li+li]:mt-3 [&_strong]:font-bold [&_strong]:text-foreground [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-border [&_a:hover]:decoration-current">
            {children}
          </div>
        </article>

        <section aria-labelledby="ready-to-draw" className="mt-12 rounded-2xl border border-secondary bg-secondary/20 p-6 sm:p-8">
          <h2 id="ready-to-draw" className="text-2xl font-extrabold text-foreground">Ready to draw names?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Add three or more people, set your exclusions and generate your Secret Santa pairings. You can start in guest mode with names only.</p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-christmas-green px-5 py-3 font-bold text-white hover:bg-christmas-green/90 focus-visible:outline-2 focus-visible:outline-offset-4">
            Start your Secret Santa <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>

        <aside aria-labelledby="more-guides" className="mt-10">
          <h2 id="more-guides" className="text-xl font-bold text-foreground">More help for your exchange</h2>
          <ul className="mt-4 space-y-3">
            {secretSantaGuides.filter((guide) => guide.href !== path).map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className="font-semibold text-foreground underline underline-offset-4 hover:text-christmas-green">{guide.title}</Link>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
              </li>
            ))}
          </ul>
        </aside>
        <SiteFooter />
      </main>
    </div>
  )
}
