import type { SupabaseClient } from '@supabase/supabase-js'
import type { Participant, Exclusion, Pairing, SecretSantaList } from '../types'

const LIST_SELECT_QUERY = `
  id,
  name,
  user_id,
  is_guest,
  created_at,
  updated_at,
  participants (id, name, email),
  exclusions (id, participant_1_id, participant_2_id),
  pairings (id, giver_id, receiver_id, email_sent)
`

interface RawParticipant {
  id: string
  name: string
  email: string
}

interface RawExclusion {
  id: string
  participant_1_id: string
  participant_2_id: string
}

interface RawList {
  id: string
  name: string
  user_id: string
  is_guest: boolean
  created_at: string
  updated_at: string
  participants: RawParticipant[]
  exclusions: RawExclusion[]
  pairings: { id: string; giver_id: string; receiver_id: string; email_sent: boolean }[]
}

export function formatListFromDb(raw: RawList): SecretSantaList {
  return {
    id: raw.id,
    name: raw.name,
    userId: raw.user_id,
    isGuest: raw.is_guest,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    participants: (raw.participants || []).map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email || '',
    })),
    exclusions: (raw.exclusions || []).map((e) => ({
      id: e.id,
      participant1Id: e.participant_1_id,
      participant2Id: e.participant_2_id,
    })),
    pairings: [],
  }
}

export async function loadLists(
  supabase: SupabaseClient,
  userId: string
): Promise<SecretSantaList[]> {
  const { data: lists, error } = await supabase
    .from('secret_santa_lists')
    .select(LIST_SELECT_QUERY)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (lists || []).map((list: RawList) => formatListFromDb(list))
}

export async function loadListById(
  supabase: SupabaseClient,
  listId: string
): Promise<SecretSantaList | null> {
  const { data } = await supabase
    .from('secret_santa_lists')
    .select(LIST_SELECT_QUERY)
    .eq('id', listId)
    .single()

  if (!data) return null
  return formatListFromDb(data as RawList)
}

export async function saveList(
  supabase: SupabaseClient,
  userId: string,
  listName: string,
  currentListId: string | null,
  participants: Participant[],
  exclusions: Exclusion[],
  pairings: Pairing[]
): Promise<string> {
  let listId = currentListId

  if (listId) {
    // Update existing list
    const { error: listError } = await supabase
      .from('secret_santa_lists')
      .update({ name: listName, updated_at: new Date().toISOString() })
      .eq('id', listId)

    if (listError) throw listError

    // Delete existing children
    await supabase.from('pairings').delete().eq('list_id', listId)
    await supabase.from('exclusions').delete().eq('list_id', listId)
    await supabase.from('participants').delete().eq('list_id', listId)
  } else {
    // Create new list
    const { data: newList, error: listError } = await supabase
      .from('secret_santa_lists')
      .insert({ name: listName, user_id: userId, is_guest: false })
      .select()
      .single()

    if (listError) throw listError
    listId = newList.id
  }

  // Insert participants and build ID map (local → DB)
  const participantMap = new Map<string, string>()

  for (const participant of participants) {
    const { data: newParticipant, error } = await supabase
      .from('participants')
      .insert({ list_id: listId, name: participant.name, email: participant.email })
      .select()
      .single()

    if (error) throw error
    participantMap.set(participant.id, newParticipant.id)
  }

  // Insert exclusions with mapped IDs
  for (const exclusion of exclusions) {
    const { error } = await supabase.from('exclusions').insert({
      list_id: listId,
      participant_1_id: participantMap.get(exclusion.participant1Id),
      participant_2_id: participantMap.get(exclusion.participant2Id),
    })
    if (error) throw error
  }

  // Insert pairings with mapped IDs
  for (const pairing of pairings) {
    const { error } = await supabase.from('pairings').insert({
      list_id: listId,
      giver_id: participantMap.get(pairing.giverId),
      receiver_id: participantMap.get(pairing.receiverId),
      email_sent: pairing.emailSent,
    })
    if (error) throw error
  }

  return listId!
}

export async function deleteList(
  supabase: SupabaseClient,
  listId: string
): Promise<void> {
  const { error } = await supabase
    .from('secret_santa_lists')
    .delete()
    .eq('id', listId)

  if (error) throw error
}
