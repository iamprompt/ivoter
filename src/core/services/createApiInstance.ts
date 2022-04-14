import axios from 'axios'

import type { User } from 'firebase/auth'

export const createApiInstance = async (user: User) => {
  const token = await user.getIdToken()

  return axios.create({
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}
