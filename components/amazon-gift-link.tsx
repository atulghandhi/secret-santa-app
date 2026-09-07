import { ArrowUpRight, Gift } from 'lucide-react'
import { AMAZON_AFFILIATE_DISCLOSURE, AMAZON_GIFT_URL } from '@/lib/affiliate'

export function AmazonGiftLink() {
  return (
    <aside aria-label="Gift inspiration" className="mt-6 rounded-xl border border-christmas-green/15 bg-christmas-green/5 p-4">
      <div className="flex items-start gap-3">
        <Gift aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-christmas-green" />
        <div className="min-w-0 space-y-1.5">
          <p className="text-sm text-foreground">Names drawn. Time for a thoughtful gift.</p>
          <a
            href={AMAZON_GIFT_URL}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-christmas-green underline decoration-christmas-green/40 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Browse Secret Santa gifts on Amazon
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Affiliate link. {AMAZON_AFFILIATE_DISCLOSURE}
          </p>
        </div>
      </div>
    </aside>
  )
}
