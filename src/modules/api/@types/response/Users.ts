export interface User {
  uid: string
  lastSignInTime: number
  email: string
  role: string | undefined
}

export type Users = User[]
