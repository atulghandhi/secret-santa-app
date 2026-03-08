'use client'

import { useState } from 'react'
import { Plus, Trash2, Gift, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Participant } from '@/lib/types'

interface ParticipantFormProps {
  participants: Participant[]
  onAddParticipant: (participant: Participant) => void
  onRemoveParticipant: (id: string) => void
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void
  requireEmails: boolean
}

export function ParticipantForm({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateParticipant,
  requireEmails
}: ParticipantFormProps) {
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    if (requireEmails && !newEmail.trim()) return

    const participant: Participant = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      email: newEmail.trim(),
      tempId: crypto.randomUUID()
    }

    onAddParticipant(participant)
    setNewName('')
    setNewEmail('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-6">
      {/* Add new participant */}
      <div className="frosted-glass rounded-2xl p-6 animate-bounce-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Add Participants</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="name" className="text-sm font-medium text-muted-foreground mb-1 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Santa's helper name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-snow-white/50 border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground mb-1 block">
              Email {!requireEmails && <span className="text-xs">(optional)</span>}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="helper@northpole.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-snow-white/50 border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || (requireEmails && !newEmail.trim())}
              className="christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Participant list */}
      {participants.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Gift className="w-5 h-5 text-christmas-green" />
            Gift Givers ({participants.length})
          </h3>
          
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="frosted-glass rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <Input
                    value={participant.name}
                    onChange={(e) => onUpdateParticipant(participant.id, { name: e.target.value })}
                    placeholder="Name"
                    className="bg-snow-white/50 border-border/50"
                  />
                  <Input
                    value={participant.email}
                    onChange={(e) => onUpdateParticipant(participant.id, { email: e.target.value })}
                    placeholder="Email"
                    type="email"
                    className="bg-snow-white/50 border-border/50"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {participants.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No participants yet!</p>
          <p className="text-sm">Add at least 3 people to start the magic</p>
        </div>
      )}
    </div>
  )
}
