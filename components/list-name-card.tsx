'use client'

import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ListNameCardProps {
  listName: string
  onListNameChange: (name: string) => void
  onNewList: () => void
}

export function ListNameCard({ listName, onListNameChange, onNewList }: ListNameCardProps) {
  return (
    <div className="frosted-glass rounded-2xl p-6 animate-bounce-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gold/20 rounded-xl">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <h3 className="font-bold text-lg text-foreground">Name Your List</h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="listName" className="sr-only">List Name</Label>
          <Input
            id="listName"
            placeholder="e.g., Family Christmas 2024"
            value={listName}
            onChange={(e) => onListNameChange(e.target.value)}
            className="bg-snow-white/50 border-border/50 focus:border-primary/50 text-lg font-medium"
          />
        </div>
        <Button
          variant="outline"
          onClick={onNewList}
          className="rounded-xl"
        >
          New List
        </Button>
      </div>
    </div>
  )
}
