import type { Participant, Exclusion, Pairing } from './types'

interface PairingResult {
  success: boolean
  pairings: Pairing[]
  error?: string
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Check if a pairing is valid (not excluded)
 */
function isValidPairing(
  giverId: string,
  receiverId: string,
  exclusions: Exclusion[]
): boolean {
  // Can't give to yourself
  if (giverId === receiverId) return false
  
  // Check exclusions (bidirectional)
  return !exclusions.some(
    (ex) =>
      (ex.participant1Id === giverId && ex.participant2Id === receiverId) ||
      (ex.participant1Id === receiverId && ex.participant2Id === giverId)
  )
}

/**
 * Validate if pairing is possible with given constraints
 */
export function validatePairingPossible(
  participants: Participant[],
  exclusions: Exclusion[]
): { possible: boolean; error?: string } {
  if (participants.length < 3) {
    return { 
      possible: false, 
      error: 'You need at least 3 participants for Secret Santa!' 
    }
  }

  // Check if any participant has too many exclusions
  for (const participant of participants) {
    const excludedCount = exclusions.filter(
      (ex) =>
        ex.participant1Id === participant.id ||
        ex.participant2Id === participant.id
    ).length

    // Each participant needs at least one valid person to give to
    // and one valid person to receive from (excluding themselves)
    const maxExclusions = participants.length - 2
    if (excludedCount > maxExclusions) {
      return {
        possible: false,
        error: `"${participant.name}" has too many exclusions. They can only exclude up to ${maxExclusions} people.`
      }
    }
  }

  // Try to find a valid assignment using backtracking
  const result = generatePairingsWithBacktracking(participants, exclusions)
  if (!result.success) {
    return {
      possible: false,
      error: 'The current exclusion rules make it impossible to create valid pairings. Try removing some exclusions.'
    }
  }

  return { possible: true }
}

/**
 * Generate pairings using backtracking algorithm
 */
function generatePairingsWithBacktracking(
  participants: Participant[],
  exclusions: Exclusion[],
  maxAttempts = 1000
): PairingResult {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffledParticipants = shuffle(participants)
    const pairings: Pairing[] = []
    const usedReceivers = new Set<string>()
    let success = true

    for (const giver of shuffledParticipants) {
      // Find valid receivers for this giver
      const validReceivers = shuffledParticipants.filter(
        (receiver) =>
          !usedReceivers.has(receiver.id) &&
          isValidPairing(giver.id, receiver.id, exclusions)
      )

      if (validReceivers.length === 0) {
        success = false
        break
      }

      // Pick a random valid receiver
      const receiver = validReceivers[Math.floor(Math.random() * validReceivers.length)]
      usedReceivers.add(receiver.id)

      pairings.push({
        id: crypto.randomUUID(),
        giverId: giver.id,
        receiverId: receiver.id,
        giverName: giver.name,
        receiverName: receiver.name,
        emailSent: false
      })
    }

    if (success && pairings.length === participants.length) {
      return { success: true, pairings }
    }
  }

  return { 
    success: false, 
    pairings: [],
    error: 'Could not generate valid pairings after multiple attempts'
  }
}

/**
 * Main function to generate Secret Santa pairings
 */
export function generatePairings(
  participants: Participant[],
  exclusions: Exclusion[]
): PairingResult {
  const validation = validatePairingPossible(participants, exclusions)
  if (!validation.possible) {
    return {
      success: false,
      pairings: [],
      error: validation.error
    }
  }

  return generatePairingsWithBacktracking(participants, exclusions)
}
