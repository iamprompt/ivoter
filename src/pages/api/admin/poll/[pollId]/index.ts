import { Timestamp } from 'firebase-admin/firestore'
import type { NextApiHandler } from 'next'
import { generate } from 'shortid'
import type { Option, Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'

/**
 * ROUTE /api/admin/poll/:id
 * GET – Get a poll
 * PATCH – Update a poll
 */
const API: NextApiHandler = async (req, res) => {
  const { query, method } = req
  const { pollId: id } = query

  // Get and Verify User
  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])
    const pollRef = db.collection('polls').doc(id as string)
    const poll = (await pollRef
      .get()
      .then((snapshot) =>
        snapshot.exists ? formatDocument(snapshot.data() as Poll) : undefined
      )) as Poll | undefined

    if (!poll) {
      return res.status(404).json({ status: 404, payload: 'Not Found' })
    }

    // GET – Get a poll
    if (method === 'GET') {
      return res.status(200).json({ status: 200, payload: poll })
    }

    // PATCH – Update a poll
    if (method === 'PATCH') {
      const { title, description, questions, options, start_date, end_date } =
        req.body

      const modifiedPoll: Poll = {
        title,
        description,
        questions,
        options: (options as Array<Option>).map((option) => ({
          ...option,
          id: option.id || generate(),
        })),
        start_date: Timestamp.fromMillis(new Date(start_date).getTime()),
        end_date: Timestamp.fromMillis(new Date(end_date).getTime()),
      }

      try {
        await db
          .collection('polls')
          .doc(id as string)
          .set(modifiedPoll)

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
