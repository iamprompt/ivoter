import { Timestamp } from 'firebase-admin/firestore'
import type { NextApiHandler } from 'next'
import { generate } from 'shortid'
import type { Option, Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'

/**
 * ROUTE /api/admin/poll
 * GET – Get all polls
 * POST – Create a new poll
 */
const API: NextApiHandler = async (req, res) => {
  const { method } = req

  // Get and Verify User
  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    // GET – Get all polls
    if (method === 'GET') {
      const pollsSnapshot = await db
        .collection('polls')
        .get()
        .then((snapshot) => snapshot.docs)

      const polls = pollsSnapshot.reduce((acc, doc) => {
        return {
          ...acc,
          [doc.id]: formatDocument(doc.data() as Poll, [
            'participants',
            'options',
          ]),
        }
      }, Promise.resolve({}) as Promise<Record<string, Poll>>)

      return res.status(200).json({ status: 200, payload: polls })
    }

    // POST – Create a new poll
    if (req.method === 'POST') {
      const { title, description, question, options, start_date, end_date } =
        req.body

      const newPoll: Poll = {
        title,
        description,
        question,
        options: (options as Array<Option>).map((option) => ({
          ...option,
          id: option.id || generate(),
        })),
        start_date: Timestamp.fromMillis(new Date(start_date).getTime()),
        end_date: Timestamp.fromMillis(new Date(end_date).getTime()),
      }

      const pollRef = await db.collection('polls').add(newPoll)

      return res.status(200).json({ status: 200, payload: pollRef.id })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
