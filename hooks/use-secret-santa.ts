'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { generatePairings } from '@/lib/pairing-algorithm'
import { validateParticipants } from '@/lib/validation'
import { loadLists, saveList, deleteList } from '@/lib/supabase/lists'
import type { Participant, Exclusion, Pairing, SecretSantaList } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface UseSecretSantaOptions {
  user: User | null
  initialList?: SecretSantaList | null
}

export function useSecretSanta({ user, initialList }: UseSecretSantaOptions) {
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

  // ---------- Data loading ----------

  const loadPastLists = useCallback(async () => {
    if (!user) return

    setIsLoadingLists(true)
    try {
      const lists = await loadLists(supabase, user.id)
      setPastLists(lists)
    } catch (error) {
      console.error('Error loading past lists:', error)
    } finally {
      setIsLoadingLists(false)
    }
  }, [user, supabase])

  useEffect(() => {
    loadPastLists()
  }, [loadPastLists])

  // ---------- Validation ----------

  useEffect(() => {
    const result = validateParticipants(participants, exclusions)
    setValidationError(result.error)
  }, [participants, exclusions])

  // ---------- Participant handlers ----------

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

  // ---------- Exclusion handlers ----------

  const handleAddExclusion = (exclusion: Exclusion) => {
    setExclusions((prev) => [...prev, exclusion])
    setPairings([])
  }

  const handleRemoveExclusion = (id: string) => {
    setExclusions((prev) => prev.filter((e) => e.id !== id))
  }

  // ---------- Generate pairings ----------

  const handleGeneratePairings = async () => {
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
        receiverName: participants.find((p) => p.id === pairing.receiverId)?.name || '',
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

  // ---------- Save list ----------

  const handleSaveList = async () => {
    if (!user) {
      toast.error('Please sign in to save your list')
      router.push('/auth/login')
      return
    }

    setIsSaving(true)

    try {
      const newListId = await saveList(
        supabase,
        user.id,
        listName,
        currentListId,
        participants,
        exclusions,
        pairings
      )
      setCurrentListId(newListId)
      toast.success('List saved successfully!')
      loadPastLists()
    } catch (error) {
      console.error('Error saving list:', error)
      toast.error('Failed to save list. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // ---------- Past list handlers ----------

  const handleSelectPastList = (list: SecretSantaList) => {
    setListName(list.name)
    setParticipants(list.participants)
    setExclusions(list.exclusions)
    setPairings([])
    setCurrentListId(list.id)
    setEmailsSent(false)
    toast.success(`Loaded "${list.name}"`)
  }

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(supabase, listId)
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

  // ---------- Send emails ----------

  const handleSendEmails = async () => {
    setIsSendingEmails(true)
    toast.success('Emails on their way! 🎅')

    try {
      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listName,
          pairings: pairings.map((p) => ({
            giverName: p.giverName,
            giverEmail: participants.find((part) => part.id === p.giverId)?.email,
            receiverName: p.receiverName,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send emails')
      }

      const result = await response.json()
      setEmailsSent(true)

      if (result.failed > 0) {
        toast.warning(`${result.sent} of ${result.total} emails sent. ${result.failed} failed.`)
      }
    } catch (error) {
      console.error('Error sending emails:', error)
      toast.error('Failed to send some emails. Please try again.')
    } finally {
      setIsSendingEmails(false)
    }
  }

  // ---------- Reset ----------

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

  return {
    // State
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
    user,

    // Handlers
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
  }
}
