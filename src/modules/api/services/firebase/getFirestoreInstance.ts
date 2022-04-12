import { getFirestore } from 'firebase-admin/firestore'
import { initializeFirebase } from './initializeFirebase'

const app = initializeFirebase()
const db = getFirestore(app)

try {
  db.settings({ ignoreUndefinedProperties: true, timestampsInSnapshots: true })
} catch (error) {}

export { db }
