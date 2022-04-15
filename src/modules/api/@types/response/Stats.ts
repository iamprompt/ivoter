import type { Participant } from './Participant'

export interface StatsResponse {
  title: string
  status: string
  participants: Array<Participant>
  summary: Summary
}

export interface Summary {
  eligibleParticipants: number
  votedParticipants: number
  options: Array<OptionSummary>
}

export interface OptionSummary {
  optionId: string
  name: string
  count: number
}
