import type { NextApiHandler } from 'next'
import type { Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { dateInRange } from '~/modules/api/services/dateInRange'

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

      // console.log(
      //   pollsSnapshot.map((doc) => formatDocument(doc.data() as Poll))
      // )

      const polls = await pollsSnapshot.reduce(async (acc, doc) => {
        // Check if user already participated in poll
        const userBallot = await doc.ref.collection('ballots').doc(u.uid).get()

        const formattedPoll = formatDocument(doc.data() as Poll, [
          'participants',
          'options',
        ]) as Poll

        const isDateInRange = dateInRange(
          formattedPoll.start_date as number,
          formattedPoll.end_date as number
        )

        if (!isDateInRange || userBallot.exists) {
          return await acc
        }

        return {
          ...(await acc),
          [doc.id]: formattedPoll,
        } as Record<string, Poll>
      }, Promise.resolve({}) as Promise<Record<string, Poll>>)

      return res.status(200).json({ status: 200, payload: polls })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
