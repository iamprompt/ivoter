import type { NextApiHandler } from 'next'
import type { EmailIdentifier } from 'firebase-admin/auth'
import type { Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { auth } from '~/modules/api/services/firebase/getAuthInstance'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'

/**
 * ROUTE /api/admin/participants
 * GET – Get all participants of a poll
 * POST – Upload new participants to a poll
 */
const API: NextApiHandler = async (req, res) => {
  const { query, method } = req
  const { pollId: id } = query

  // Get and Verify User
  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    // GET – Get all participants of a poll
    if (method === 'GET') {
      const poll = (await db
        .collection('polls')
        .doc(id as string)
        .get()
        .then((snapshot) => formatDocument(snapshot.data() as Poll))) as Poll

      if (poll.participants) {
        const participantsMeta = await Promise.all(
          poll.participants.map(async (uid) => {
            const u = await auth.getUser(uid)

            return {
              uid,
              email: u.email,
              displayName: u.displayName,
            }
          })
        )

        return res.status(200).json({ status: 200, payload: participantsMeta })
      }

      return res.status(404).json({ status: 404, payload: {} })
    }

    // POST – Upload new participants to a poll
    if (method === 'POST') {
      const { users: _participants } = req.body as {
        users: Array<{ email: string; password: string }>
      }

      const participantsMap = _participants.reduce(
        (acc, { email, password }) => ({ ...acc, [email]: password }),
        {} as Record<string, string>
      )

      try {
        const { users, notFound } = await auth.getUsers(
          _participants.map(({ email }) => ({ email }))
        )

        const importedUID = [] as Array<string>
        const responseType = {
          new: [],
          existed: [],
        } as Record<'new' | 'existed', Array<string>>

        // Existing users
        for (const user of users) {
          const { uid, email } = user
          importedUID.push(uid)
          responseType.existed.push(email as string)
        }

        // New users
        for (const user of notFound as EmailIdentifier[]) {
          const { email } = user
          const password = participantsMap[email]

          const { uid } = await auth.createUser({
            email,
            password,
          })

          importedUID.push(uid)
          responseType.new.push(email as string)
        }

        // console.log(importedUID)

        const pollRef = db.collection('polls').doc(id as string)

        // Add imported users to poll
        await db.runTransaction(async (t) => {
          const doc = await t.get(pollRef)

          if (doc.exists) {
            const { participants } = doc.data() as Poll

            const newParticipants = new Set([
              ...(participants || []),
              ...importedUID,
            ])

            t.update(pollRef, {
              participants: Array.from(newParticipants),
            })
          }
        })

        return res.status(200).json({ status: 200, payload: responseType })
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
