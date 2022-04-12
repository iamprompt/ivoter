import { getAuth } from 'firebase-admin/auth'
import { initializeFirebase } from './initializeFirebase'

const app = initializeFirebase()
const auth = getAuth(app)

export { auth }
