import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getAuthInstance = () => {
  const instance = createFirebaseInstance()
  const auth = getAuth(instance)

  if (process.env.NODE_ENV === 'development') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
    } catch (e) {}
  }

  return auth
}
