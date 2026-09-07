import Link from 'next/link'
import { Heart } from 'lucide-react'
import { secretSantaGuides } from '@/lib/secret-santa-content'

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-16 border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
      <nav aria-label="Secret Santa guides" className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
        <Link href="/" className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
          Draw names
        </Link>
        {secretSantaGuides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
            {guide.title}
          </Link>
        ))}
      </nav>
      <p className="font-semibold text-foreground">Santa Switch</p>
      <p className="mt-2">Made with <Heart aria-hidden="true" className="inline h-4 w-4 text-christmas-red" /> for the holiday season.</p>
    </footer>
  )
}
