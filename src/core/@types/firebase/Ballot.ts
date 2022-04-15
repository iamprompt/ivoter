import type { Timestamp } from 'firebase-admin/firestore'

export interface Ballot {
  optionId: string
  timestamp: Timestamp
}

export type Ballots = Record<string, Ballot>
