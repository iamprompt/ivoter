type DateKey = `${'start' | 'end'}_date`
type PollDate = { [date in DateKey]: number }

export interface Option {
  id: string
  name: string
}

export interface Poll extends PollDate {
  title: string
  description: string
  questions: string
  options: Array<Option>
  participants?: Array<string>
}
