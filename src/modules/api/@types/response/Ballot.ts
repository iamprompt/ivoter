export interface Ballot {
  option: string
  optionId: string
  timestamp: number
}

export type Ballots = Record<string, Ballot>
