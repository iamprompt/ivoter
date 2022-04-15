import type { NextApiHandler } from 'next'
import dayjs from 'dayjs'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { auth } from '~/modules/api/services/firebase/getAuthInstance'

const API: NextApiHandler = async (req, res) => {
  const { method } = req

  // Get and Verify User
  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    // GET – Get all users
    if (method === 'GET') {
      const { users } = await auth.listUsers()

      const usersFormatted = users.map(
        ({ uid, email, customClaims, metadata }) => {
          return {
            uid,
            email,
            role: customClaims?.role as string | undefined,
            lastSignInTime: dayjs(metadata.lastSignInTime).valueOf(),
          }
        }
      )

      return res.status(200).json({ status: 200, payload: usersFormatted })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
