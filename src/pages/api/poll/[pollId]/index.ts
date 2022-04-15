import { FieldValue } from 'firebase-admin/firestore'
import type { NextApiHandler } from 'next'
import type { Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { dateInRange } from '~/modules/api/services/dateInRange'

/**
 * ROUTE /api/poll/:id
 * GET – Get a poll
 * POST – Post a ballot
 */
const API: NextApiHandler = async (req, res) => {
  const { query, method } = req
  const { pollId: id } = query

  // Get and Verify User
  try {
    const u = await getUserAndVerifyAuth(req.headers.authorization as string)

    const pollRef = db.collection('polls').doc(id as string)
    const poll = (await pollRef
      .get()
      .then((snapshot) => formatDocument(snapshot.data() as Poll))) as Poll

    // Check if user can participate in poll
    if (!poll.participants!.includes(u.uid)) {
      return res.status(403).json({
        status: 403,
        payload: 'The user do not have permission to access a poll',
      })
    }

    const isDateInRange = dateInRange(
      poll.start_date as number,
      poll.end_date as number
    )

    if (!isDateInRange) {
      return res.status(403).json({
        status: 403,
        payload: 'The poll is unavailable at this time',
      })
    }

    const ballotRef = pollRef.collection('ballots').doc(u.uid)

    // Check if user has already voted
    const isUserBallotExist = await ballotRef
      .get()
      .then((snapshot) => snapshot.exists)

    if (isUserBallotExist) {
      return res
        .status(403)
        .json({ status: 403, payload: 'The user has already voted' })
    }

    // GET – Get a poll
    if (method === 'GET') {
      return res.status(200).json({ status: 200, payload: poll })
    }

    // POST – Post a ballot
    if (method === 'POST') {
      const { optionId } = req.body

      try {
        // Check if optionId is valid
        const option = poll.options.find((o) => o.id === optionId)

        if (!option) {
          return res
            .status(400)
            .json({ status: 400, payload: 'Invalid Option' })
        }

        await ballotRef.set({
          optionId,
          timestamp: FieldValue.serverTimestamp(),
        })

        return res.status(200).json({ status: 200, payload: 'Success' })
      } catch (e) {
        return res.status(500).json({ status: 500, payload: 'Error' })
      }
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
