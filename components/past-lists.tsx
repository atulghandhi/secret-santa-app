'use client'

import { format } from 'date-fns'
import { History, Users, Calendar, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SecretSantaList } from '@/lib/types'

interface PastListsProps {
  lists: SecretSantaList[]
  onSelectList: (list: SecretSantaList) => void
  onDeleteList?: (listId: string) => void
  isLoading?: boolean
}

export function PastLists({ lists, onSelectList, onDeleteList, isLoading }: PastListsProps) {
  if (isLoading) {
    return (
      <div className="frosted-glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/30 rounded-xl">
            <History className="w-5 h-5 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Your Past Lists</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (lists.length === 0) {
    return null
  }

  return (
    <div className="frosted-glass rounded-2xl p-6 animate-bounce-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent/30 rounded-xl">
          <History className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Your Past Lists</h3>
          <p className="text-sm text-muted-foreground">
            Click to load a previous Secret Santa list
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {lists.map((list, index) => (
          <div
            key={list.id}
            className="group flex items-center justify-between bg-snow-white/50 hover:bg-snow-white/80 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md animate-bounce-in spring-press"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onSelectList(list)}
          >
            <div className="flex-1">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {list.name}
              </h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {list.participants.length} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(list.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onDeleteList && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteList(list.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
