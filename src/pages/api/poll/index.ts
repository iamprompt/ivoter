import type { NextApiHandler } from 'next'
import type { Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/getUserAndVerifyAuth'

/**
 * ROUTE /api/poll
 * GET – Get all polls
 */
const API: NextApiHandler = async (req, res) => {
  const { method } = req

  // Get and Verify User
  try {
    const u = await getUserAndVerifyAuth(req.headers.authorization as string)

    // GET – Get all polls
    if (method === 'GET') {
      const pollsSnapshot = await db
        .collection('polls')
        .where('participants', 'array-contains', u.uid)
        .get()
        .then((snapshot) => snapshot.docs)

      const polls = await pollsSnapshot.reduce(async (acc, doc) => {
        // Check if user already participated in poll
        const userBallot = await doc.ref.collection('ballots').doc(u.uid).get()

        if (userBallot.exists) {
          return acc
        }

        return {
          ...acc,
          [doc.id]: formatDocument(
            doc.data() as Poll,
            ['participants', 'options'],
            true
          ),
        }
      }, Promise.resolve({}) as Promise<Record<string, Poll>>)

      return res.status(200).json({ status: 200, payload: polls })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
