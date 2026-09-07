'use client'

import { useState } from 'react'
import { Eye, EyeOff, Gift, ArrowRight, Mail, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AmazonGiftLink } from '@/components/amazon-gift-link'
import type { Pairing, Participant } from '@/lib/types'

interface PairingsDisplayProps {
  pairings: Pairing[]
  participants: Participant[]
  onSendEmails: () => Promise<void>
  isSendingEmails?: boolean
  emailsSent?: boolean
}

export function PairingsDisplay({
  pairings,
  participants,
  onSendEmails,
  isSendingEmails = false,
  emailsSent = false
}: PairingsDisplayProps) {
  const [revealedPairings, setRevealedPairings] = useState<Set<string>>(new Set())

  const toggleReveal = (pairingId: string) => {
    setRevealedPairings((prev) => {
      const next = new Set(prev)
      if (next.has(pairingId)) {
        next.delete(pairingId)
      } else {
        next.add(pairingId)
      }
      return next
    })
  }

  const revealAll = () => {
    setRevealedPairings(new Set(pairings.map((p) => p.id)))
  }

  const hideAll = () => {
    setRevealedPairings(new Set())
  }

  const allRevealed = pairings.every((p) => revealedPairings.has(p.id))

  const missingEmails = participants.filter((p) => !p.email?.trim())
  const allHaveEmails = missingEmails.length === 0

  return (
    <div className="frosted-glass rounded-2xl p-6 animate-bounce-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-christmas-green/10 rounded-xl">
            <Gift className="w-5 h-5 text-christmas-green" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Secret Santa Pairings</h3>
            <p className="text-sm text-muted-foreground">Click to reveal each pairing</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={allRevealed ? hideAll : revealAll}
          className="rounded-xl"
        >
          {allRevealed ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide All
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Reveal All
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {pairings.map((pairing, index) => {
          const isRevealed = revealedPairings.has(pairing.id)

          return (
            <div
              key={pairing.id}
              className={`relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300 cursor-pointer spring-press ${
                isRevealed
                  ? 'bg-secondary/50'
                  : 'bg-gradient-to-r from-christmas-red/10 to-christmas-green/10 hover:from-christmas-red/20 hover:to-christmas-green/20'
              }`}
              onClick={() => toggleReveal(pairing.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Giver */}
              <div className="flex-1 text-center">
                <div className="font-bold text-foreground text-lg">{pairing.giverName}</div>
                <div className="text-xs text-muted-foreground">gives a gift to</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center w-12">
                <div className={`p-2 rounded-full transition-all ${
                  isRevealed ? 'bg-christmas-green/20' : 'bg-muted'
                }`}>
                  {isRevealed ? (
                    <ArrowRight className="w-5 h-5 text-christmas-green animate-bounce-in" />
                  ) : (
                    <Gift className="w-5 h-5 text-muted-foreground animate-wiggle" />
                  )}
                </div>
              </div>

              {/* Receiver */}
              <div className="flex-1 text-center">
                {isRevealed ? (
                  <div className="animate-gift-reveal">
                    <div className="font-bold text-foreground text-lg">{pairing.receiverName}</div>
                    <div className="text-xs text-muted-foreground">receives a gift!</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="font-bold text-muted-foreground text-lg">???</div>
                    <div className="text-xs text-muted-foreground">Click to reveal</div>
                  </div>
                )}
              </div>

              {/* Reveal button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleReveal(pairing.id)
                }}
              >
                {isRevealed ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Send emails button */}
      <div className="mt-6 pt-6 border-t border-border/50">
        {emailsSent ? (
          <div className="flex items-center justify-center gap-2 text-christmas-green">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">All emails sent successfully!</span>
          </div>
        ) : (
          <>
            {!allHaveEmails && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Missing emails for: {missingEmails.map((p) => p.name).join(', ')}.
                  Add emails above to send.
                </span>
              </div>
            )}
            <Button
              onClick={onSendEmails}
              disabled={isSendingEmails || !allHaveEmails}
              className="w-full christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12"
            >
              {isSendingEmails ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending magical emails...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Secret Santa Emails
                </>
              )}
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Emails include an Amazon affiliate gift link. Only send to participants who have agreed to receive these emails.
            </p>
          </>
        )}
      </div>
      {pairings.length > 0 && <AmazonGiftLink />}
    </div>
  )
}
