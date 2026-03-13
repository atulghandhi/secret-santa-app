'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Shuffle, Loader2, AlertTriangle, Save, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ParticipantForm } from '@/components/participant-form'
import { ExclusionsManager } from '@/components/exclusions-manager'
import { PairingsDisplay } from '@/components/pairings-display'
import { PastLists } from '@/components/past-lists'
import { generatePairings, validatePairingPossible } from '@/lib/pairing-algorithm'
import { createClient } from '@/lib/supabase/client'
import type { Participant, Exclusion, Pairing, SecretSantaList } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface SecretSantaFormProps {
  user: User | null
  initialList?: SecretSantaList | null
}

export function SecretSantaForm({ user, initialList }: SecretSantaFormProps) {
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [listName, setListName] = useState(initialList?.name || `Secret Santa ${new Date().getFullYear()}`)
  const [participants, setParticipants] = useState<Participant[]>(initialList?.participants || [])
  const [exclusions, setExclusions] = useState<Exclusion[]>(initialList?.exclusions || [])
  const [pairings, setPairings] = useState<Pairing[]>(initialList?.pairings || [])

  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingEmails, setIsSendingEmails] = useState(false)
  const [emailsSent, setEmailsSent] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [pastLists, setPastLists] = useState<SecretSantaList[]>([])
  const [isLoadingLists, setIsLoadingLists] = useState(false)
  const [currentListId, setCurrentListId] = useState<string | null>(initialList?.id || null)

  // Load past lists
  const loadPastLists = useCallback(async () => {
    if (!user) return

    setIsLoadingLists(true)
    try {
      const { data: lists, error } = await supabase
        .from('secret_santa_lists')
        .select(`
          id,
          name,
          user_id,
          is_guest,
          created_at,
          updated_at,
          participants (id, name, email),
          exclusions (id, participant_1_id, participant_2_id),
          pairings (id, giver_id, receiver_id, email_sent)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedLists: SecretSantaList[] = (lists || []).map((list) => ({
        id: list.id,
        name: list.name,
        userId: list.user_id,
        isGuest: list.is_guest,
        createdAt: list.created_at,
        updatedAt: list.updated_at,
        participants: (list.participants || []).map((p: { id: string; name: string; email: string }) => ({
          id: p.id,
          name: p.name,
          email: p.email || ''
        })),
        exclusions: (list.exclusions || []).map((e: { id: string; participant_1_id: string; participant_2_id: string }) => ({
          id: e.id,
          participant1Id: e.participant_1_id,
          participant2Id: e.participant_2_id
        })),
        pairings: []
      }))

      setPastLists(formattedLists)
    } catch (error) {
      console.error('Error loading past lists:', error)
    } finally {
      setIsLoadingLists(false)
    }
  }, [user, supabase])

  useEffect(() => {
    loadPastLists()
  }, [loadPastLists])

  // Validation
  useEffect(() => {
    if (participants.length >= 3) {
      // Check for duplicate names
      const names = participants.map((p) => p.name.trim().toLowerCase()).filter(Boolean)
      const duplicateNames = names.filter((n, i) => names.indexOf(n) !== i)
      if (duplicateNames.length > 0) {
        setValidationError('Some participants have the same name. Each name must be unique.')
        return
      }

      const validation = validatePairingPossible(participants, exclusions)
      if (!validation.possible) {
        setValidationError(validation.error || null)
      } else {
        setValidationError(null)
      }
    } else {
      setValidationError(null)
    }
  }, [participants, exclusions])

  // Participant handlers
  const handleAddParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant])
    setPairings([])
  }

  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
    setExclusions((prev) =>
      prev.filter((e) => e.participant1Id !== id && e.participant2Id !== id)
    )
    setPairings([])
  }

  const handleUpdateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  // Exclusion handlers
  const handleAddExclusion = (exclusion: Exclusion) => {
    setExclusions((prev) => [...prev, exclusion])
    setPairings([])
  }

  const handleRemoveExclusion = (id: string) => {
    setExclusions((prev) => prev.filter((e) => e.id !== id))
  }

  // Generate pairings
  const handleGeneratePairings = async () => {
    // Warn about missing or invalid emails before generating
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const missingEmails = participants.filter((p) => !p.email.trim())
    const invalidEmails = participants.filter((p) => p.email.trim() && !emailRegex.test(p.email.trim()))

    if (invalidEmails.length > 0) {
      toast.error(
        `Invalid email${invalidEmails.length > 1 ? 's' : ''} for: ${invalidEmails.map((p) => p.name).join(', ')}. Please fix before generating.`
      )
      return
    }

    if (missingEmails.length > 0) {
      toast.warning(
        `${missingEmails.length} participant${missingEmails.length > 1 ? 's' : ''} missing email addresses. You can still generate pairings, but won't be able to email everyone.`,
        { duration: 5000 }
      )
    }

    setIsGenerating(true)
    setEmailsSent(false)

    try {
      // Simulate a small delay for the "magic" effect
      await new Promise((r) => setTimeout(r, 800))

      const result = generatePairings(participants, exclusions)

      if (!result.success) {
        toast.error(result.error || 'Could not generate pairings')
        return
      }

      // Update pairings with participant names
      const pairingsWithNames = result.pairings.map((pairing) => ({
        ...pairing,
        giverName: participants.find((p) => p.id === pairing.giverId)?.name || '',
        receiverName: participants.find((p) => p.id === pairing.receiverId)?.name || ''
      }))

      setPairings(pairingsWithNames)
      toast.success('Secret Santa pairings generated!')
    } catch (error) {
      console.error('Error generating pairings:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Save list to database
  const handleSaveList = async () => {
    if (!user) {
      toast.error('Please sign in to save your list')
      router.push('/auth/login')
      return
    }

    setIsSaving(true)

    try {
      // Create or update the list
      if (currentListId) {
        // Update existing list
        const { error: listError } = await supabase
          .from('secret_santa_lists')
          .update({
            name: listName,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentListId)

        if (listError) throw listError

        // Delete existing participants, exclusions, and pairings
        await supabase.from('pairings').delete().eq('list_id', currentListId)
        await supabase.from('exclusions').delete().eq('list_id', currentListId)
        await supabase.from('participants').delete().eq('list_id', currentListId)
      } else {
        // Create new list
        const { data: newList, error: listError } = await supabase
          .from('secret_santa_lists')
          .insert({
            name: listName,
            user_id: user.id,
            is_guest: false
          })
          .select()
          .single()

        if (listError) throw listError
        setCurrentListId(newList.id)
      }

      const listId = currentListId || (await supabase
        .from('secret_santa_lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', listName)
        .single()
        .then(r => r.data?.id))

      // Insert participants
      const participantMap = new Map<string, string>()

      for (const participant of participants) {
        const { data: newParticipant, error } = await supabase
          .from('participants')
          .insert({
            list_id: listId,
            name: participant.name,
            email: participant.email
          })
          .select()
          .single()

        if (error) throw error
        participantMap.set(participant.id, newParticipant.id)
      }

      // Insert exclusions with new participant IDs
      for (const exclusion of exclusions) {
        const { error } = await supabase.from('exclusions').insert({
          list_id: listId,
          participant_1_id: participantMap.get(exclusion.participant1Id),
          participant_2_id: participantMap.get(exclusion.participant2Id)
        })
        if (error) throw error
      }

      // Insert pairings with new participant IDs
      for (const pairing of pairings) {
        const { error } = await supabase.from('pairings').insert({
          list_id: listId,
          giver_id: participantMap.get(pairing.giverId),
          receiver_id: participantMap.get(pairing.receiverId),
          email_sent: pairing.emailSent
        })
        if (error) throw error
      }

      toast.success('List saved successfully!')
      loadPastLists()
    } catch (error) {
      console.error('Error saving list:', error)
      toast.error('Failed to save list. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Load past list
  const handleSelectPastList = (list: SecretSantaList) => {
    setListName(list.name)
    setParticipants(list.participants)
    setExclusions(list.exclusions)
    setPairings([])
    setCurrentListId(list.id)
    setEmailsSent(false)
    toast.success(`Loaded "${list.name}"`)
  }

  // Delete past list
  const handleDeleteList = async (listId: string) => {
    try {
      const { error } = await supabase
        .from('secret_santa_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error

      setPastLists((prev) => prev.filter((l) => l.id !== listId))

      if (currentListId === listId) {
        setCurrentListId(null)
        setListName(`Secret Santa ${new Date().getFullYear()}`)
        setParticipants([])
        setExclusions([])
        setPairings([])
      }

      toast.success('List deleted')
    } catch (error) {
      console.error('Error deleting list:', error)
      toast.error('Failed to delete list')
    }
  }

  // Send emails
  const handleSendEmails = async () => {
    setIsSendingEmails(true)

    const totalEmails = pairings.length
    const batchesNeeded = Math.ceil(totalEmails / 2)
    const estimatedSeconds = batchesNeeded > 1 ? (batchesNeeded - 1) : 0

    toast.info(
      `Sending ${totalEmails} email${totalEmails !== 1 ? 's' : ''}… ` +
      (estimatedSeconds > 0
        ? `This may take ~${estimatedSeconds} second${estimatedSeconds !== 1 ? 's' : ''} to respect rate limits.`
        : 'This will just take a moment.'),
      { duration: 5000 }
    )

    try {
      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listName,
          pairings: pairings.map((p) => ({
            giverName: p.giverName,
            giverEmail: participants.find((part) => part.id === p.giverId)?.email,
            receiverName: p.receiverName
          }))
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send emails')
      }

      const result = await response.json()

      setEmailsSent(true)

      if (result.failed > 0) {
        toast.warning(`${result.sent} of ${result.total} emails sent. ${result.failed} failed.`)
      } else {
        toast.success('All Secret Santa emails sent! 🎅')
      }
    } catch (error) {
      console.error('Error sending emails:', error)
      toast.error('Failed to send some emails. Please try again.')
    } finally {
      setIsSendingEmails(false)
    }
  }

  // Reset form
  const handleNewList = () => {
    setListName(`Secret Santa ${new Date().getFullYear()}`)
    setParticipants([])
    setExclusions([])
    setPairings([])
    setCurrentListId(null)
    setEmailsSent(false)
    toast.success('Started a new list!')
  }

  const canGenerate = participants.length >= 3 && !validationError

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
              onChange={(e) => setListName(e.target.value)}
              className="bg-snow-white/50 border-border/50 focus:border-primary/50 text-lg font-medium"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleNewList}
            className="rounded-xl"
          >
            New List
          </Button>
        </div>
      </div>

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

      {/* Generate button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleGeneratePairings}
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
              {pairings.length > 0 ? 'Respin the Wheel!' : 'Generate Pairings!'}
            </>
          )}
        </Button>

        {user && participants.length > 0 && (
          <Button
            onClick={handleSaveList}
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
