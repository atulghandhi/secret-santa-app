import type { Participant, Exclusion } from './types'
import { validatePairingPossible } from './pairing-algorithm'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  if (!email.trim()) return true // empty is ok (optional field)
  return EMAIL_REGEX.test(email.trim())
}

export function isDuplicateName(
  name: string,
  participants: Participant[],
  excludeId?: string
): boolean {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return false
  return participants.some(
    (p) => p.id !== excludeId && p.name.trim().toLowerCase() === normalized
  )
}

export function isDuplicateEmail(
  email: string,
  participants: Participant[],
  excludeId?: string
): boolean {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return false
  return participants.some(
    (p) => p.id !== excludeId && p.email.trim().toLowerCase() === normalized
  )
}

export interface ValidationResult {
  error: string | null
}

export function validateParticipants(
  participants: Participant[],
  exclusions: Exclusion[]
): ValidationResult {
  if (participants.length < 3) {
    return { error: null }
  }

  // Check for duplicate names
  const names = participants.map((p) => p.name.trim().toLowerCase()).filter(Boolean)
  const duplicateNames = names.filter((n, i) => names.indexOf(n) !== i)
  if (duplicateNames.length > 0) {
    return { error: 'Some participants have the same name. Each name must be unique.' }
  }

  // Check for invalid emails
  const invalidEmails = participants.filter((p) => p.email.trim() && !EMAIL_REGEX.test(p.email.trim()))
  if (invalidEmails.length > 0) {
    return { error: 'Some participants have invalid email addresses.' }
  }

  // Check for duplicate emails (only among non-empty emails)
  const emails = participants.map((p) => p.email.trim().toLowerCase()).filter(Boolean)
  const duplicateEmails = emails.filter((e, i) => emails.indexOf(e) !== i)
  if (duplicateEmails.length > 0) {
    return { error: 'Some participants have the same email. Each email must be unique.' }
  }

  // Check pairing feasibility
  const validation = validatePairingPossible(participants, exclusions)
  if (!validation.possible) {
    return { error: validation.error || null }
  }

  return { error: null }
}
