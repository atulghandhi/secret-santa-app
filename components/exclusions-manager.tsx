'use client'

import { useState } from 'react'
import { Ban, Plus, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Participant, Exclusion } from '@/lib/types'

interface ExclusionsManagerProps {
  participants: Participant[]
  exclusions: Exclusion[]
  onAddExclusion: (exclusion: Exclusion) => void
  onRemoveExclusion: (id: string) => void
}

export function ExclusionsManager({
  participants,
  exclusions,
  onAddExclusion,
  onRemoveExclusion
}: ExclusionsManagerProps) {
  const [participant1, setParticipant1] = useState<string>('')
  const [participant2, setParticipant2] = useState<string>('')

  const handleAddExclusion = () => {
    if (!participant1 || !participant2 || participant1 === participant2) return

    // Check if exclusion already exists
    const exists = exclusions.some(
      (ex) =>
        (ex.participant1Id === participant1 && ex.participant2Id === participant2) ||
        (ex.participant1Id === participant2 && ex.participant2Id === participant1)
    )

    if (exists) return

    onAddExclusion({
      id: crypto.randomUUID(),
      participant1Id: participant1,
      participant2Id: participant2
    })

    setParticipant1('')
    setParticipant2('')
  }

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || 'Unknown'
  }

  if (participants.length < 2) {
    return null
  }

  return (
    <div className="frosted-glass rounded-2xl p-6 animate-bounce-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-destructive/10 rounded-xl">
          <Ban className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Exclusions</h3>
          <p className="text-sm text-muted-foreground">
            Prevent certain people from being paired together
          </p>
        </div>
      </div>

      {/* Add exclusion form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select value={participant1} onValueChange={setParticipant1}>
          <SelectTrigger className="flex-1 bg-snow-white/50 border-border/50">
            <SelectValue placeholder="Select person..." />
          </SelectTrigger>
          <SelectContent>
            {participants.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center text-muted-foreground font-medium">
          cannot be paired with
        </div>

        <Select value={participant2} onValueChange={setParticipant2}>
          <SelectTrigger className="flex-1 bg-snow-white/50 border-border/50">
            <SelectValue placeholder="Select person..." />
          </SelectTrigger>
          <SelectContent>
            {participants
              .filter((p) => p.id !== participant1)
              .map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAddExclusion}
          disabled={!participant1 || !participant2 || participant1 === participant2}
          className="christmas-btn bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Exclusion list */}
      {exclusions.length > 0 && (
        <div className="space-y-2">
          {exclusions.map((exclusion, index) => (
            <div
              key={exclusion.id}
              className="flex items-center justify-between bg-destructive/5 rounded-xl px-4 py-3 animate-bounce-in spring-press"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">
                  {getParticipantName(exclusion.participant1Id)}
                </span>
                <Ban className="w-4 h-4 text-destructive" />
                <span className="font-medium text-foreground">
                  {getParticipantName(exclusion.participant2Id)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveExclusion(exclusion.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {exclusions.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No exclusions set. Anyone can be paired with anyone!</p>
        </div>
      )}
    </div>
  )
}
