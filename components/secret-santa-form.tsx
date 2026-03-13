'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ParticipantForm } from '@/components/participant-form'
import { ExclusionsManager } from '@/components/exclusions-manager'
import { PairingsDisplay } from '@/components/pairings-display'
import { PastLists } from '@/components/past-lists'
import { ListNameCard } from '@/components/list-name-card'
import { GenerateActions } from '@/components/generate-actions'
import { useSecretSanta } from '@/hooks/use-secret-santa'
import type { SecretSantaList } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface SecretSantaFormProps {
  user: User | null
  initialList?: SecretSantaList | null
}

export function SecretSantaForm({ user, initialList }: SecretSantaFormProps) {
  const {
    listName,
    setListName,
    participants,
    exclusions,
    pairings,
    isGenerating,
    isSaving,
    isSendingEmails,
    emailsSent,
    validationError,
    pastLists,
    isLoadingLists,
    canGenerate,
    handleAddParticipant,
    handleRemoveParticipant,
    handleUpdateParticipant,
    handleAddExclusion,
    handleRemoveExclusion,
    handleGeneratePairings,
    handleSaveList,
    handleSelectPastList,
    handleDeleteList,
    handleSendEmails,
    handleNewList,
  } = useSecretSanta({ user, initialList })

  return (
    <div className="space-y-8">
      {/* Past lists (only for logged in users) */}
      {user && (
        <PastLists
          lists={pastLists}
          onSelectList={handleSelectPastList}
          onDeleteList={handleDeleteList}
          isLoading={isLoadingLists}
        />
      )}

      {/* List name */}
      <ListNameCard
        listName={listName}
        onListNameChange={setListName}
        onNewList={handleNewList}
      />

      {/* Participants */}
      <ParticipantForm
        participants={participants}
        onAddParticipant={handleAddParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        onUpdateParticipant={handleUpdateParticipant}
        requireEmails={false}
      />

      {/* Exclusions */}
      <ExclusionsManager
        participants={participants}
        exclusions={exclusions}
        onAddExclusion={handleAddExclusion}
        onRemoveExclusion={handleRemoveExclusion}
      />

      {/* Validation error */}
      {validationError && (
        <Alert variant="destructive" className="animate-bounce-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Generate & Save buttons */}
      <GenerateActions
        canGenerate={canGenerate}
        isGenerating={isGenerating}
        hasPairings={pairings.length > 0}
        user={user}
        participantCount={participants.length}
        isSaving={isSaving}
        onGenerate={handleGeneratePairings}
        onSave={handleSaveList}
      />

      {/* Help text */}
      {participants.length < 3 && (
        <p className="text-center text-muted-foreground">
          Add at least 3 participants to generate pairings
        </p>
      )}

      {/* Pairings display */}
      {pairings.length > 0 && (
        <PairingsDisplay
          pairings={pairings}
          participants={participants}
          onSendEmails={handleSendEmails}
          isSendingEmails={isSendingEmails}
          emailsSent={emailsSent}
        />
      )}
    </div>
  )
}
