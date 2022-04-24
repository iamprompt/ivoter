import type { NextApiHandler } from 'next'
import type { EmailIdentifier } from 'firebase-admin/auth'
import generatePassword from 'omgopass'
import { AES, mode, pad } from 'crypto-js'
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

  const pollRef = db.collection('polls').doc(id as string)

  // Get and Verify User
  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    // GET – Get all participants of a poll
    if (method === 'GET') {
      const poll = (await pollRef
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
        users: Array<{ email: string }>
      }

      try {
        const { users, notFound } = await auth.getUsers(_participants)

        const users_import: any[] = []

        // Existing users
        for (const user of users) {
          const { uid, email } = user
          users_import.push({ uid, email })
        }

        // New users
        for (const user of notFound as EmailIdentifier[]) {
          const { email } = user
          const password = generatePassword()

          const { uid } = await auth.createUser({
            email,
            password,
          })

          users_import.push({ uid, email, password })
        }

        // Add imported users to poll
        await db.runTransaction(async (t) => {
          const doc = await t.get(pollRef)

          if (doc.exists) {
            const { participants } = doc.data() as Poll

            const newParticipants = new Set([
              ...(participants || []),
              ...users_import.map((u) => u.uid),
            ])

            t.update(pollRef, {
              participants: Array.from(newParticipants),
            })
          }
        })

        console.log(users_import)

        const encryptedUsersImport = users_import.map((u) => {
          console.log(process.env.PASSWORD_ENCRYPTION_KEY)

          return {
            ...u,
            password: u.password
              ? AES.encrypt(u.password, process.env.PASSWORD_ENCRYPTION_KEY!, {
                  mode: mode.ECB,
                  padding: pad.Pkcs7,
                }).toString()
              : undefined,
          }
        })

        return res
          .status(200)
          .json({ status: 200, payload: encryptedUsersImport })
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
