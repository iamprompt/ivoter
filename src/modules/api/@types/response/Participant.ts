import type { Ballot } from './Ballot'

export interface Participant {
  uid: string
  email: string
  displayName?: string
  ballot?: Ballot
}

export type Participants = Array<Participant>
