'use client'

import { Shuffle, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

interface GenerateActionsProps {
  canGenerate: boolean
  isGenerating: boolean
  hasPairings: boolean
  user: User | null
  participantCount: number
  isSaving: boolean
  onGenerate: () => void
  onSave: () => void
}

export function GenerateActions({
  canGenerate,
  isGenerating,
  hasPairings,
  user,
  participantCount,
  isSaving,
  onGenerate,
  onSave,
}: GenerateActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className="flex-1 christmas-btn bg-christmas-green hover:bg-christmas-green/90 text-white rounded-xl h-14 text-lg font-bold animate-pulse-glow"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Working the magic...
          </>
        ) : (
          <>
            <Shuffle className="w-6 h-6 mr-3" />
            {hasPairings ? 'Respin the Wheel!' : 'Generate Pairings!'}
          </>
        )}
      </Button>

      {user && participantCount > 0 && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          variant="outline"
          className="rounded-xl h-14"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save List
            </>
          )}
        </Button>
      )}
    </div>
  )
}
