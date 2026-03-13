export interface Participant {
  id: string
  name: string
  email: string
  tempId?: string // For local state before saving
}

export interface Exclusion {
  id: string
  participant1Id: string
  participant2Id: string
}

export interface Pairing {
  id: string
  giverId: string
  receiverId: string
  giverName: string
  receiverName: string
  emailSent: boolean
}

export interface SecretSantaList {
  id: string
  name: string
  userId?: string | null
  isGuest: boolean
  createdAt: string
  updatedAt: string
  participants: Participant[]
  exclusions: Exclusion[]
  pairings: Pairing[]
}

