export interface Ballot {
  name: string
  optionId: string
  timestamp: number
}

export type Ballots = Record<string, Ballot>
