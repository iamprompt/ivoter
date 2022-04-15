import type { NextApiHandler } from 'next'
import dayjs from 'dayjs'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { auth } from '~/modules/api/services/firebase/getAuthInstance'

const API: NextApiHandler = async (req, res) => {
  const { method, query } = req

  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    if (method === 'GET') {
      const u = await auth.getUser(query.userId as string)

      const payload = {
        uid: u.uid,
        email: u.email,
        role: u.customClaims?.role as string | undefined,
        lastSignInTime: dayjs(u.metadata.lastSignInTime).valueOf(),
      }

      return res.status(200).json({ status: 200, payload })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error: unknown) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
