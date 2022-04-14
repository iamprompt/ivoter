interface Option {
  id?: string
  name: string
}

export interface PollForm {
  title: string
  question: string
  description: string
  options: Array<Option>
  start_date: string
  end_date: string
}
