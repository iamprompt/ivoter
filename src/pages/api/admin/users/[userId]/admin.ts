import type { NextApiHandler } from 'next'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { auth } from '~/modules/api/services/firebase/getAuthInstance'

const API: NextApiHandler = async (req, res) => {
  const { method, body, query } = req
  const { action } = body as { action: string }

  try {
    await getUserAndVerifyAuth(req.headers.authorization as string, ['admin'])

    if (method === 'POST') {
      if (action === 'SET_ROLE') {
        await auth.setCustomUserClaims(query.userId as string, {
          role: 'admin',
        })
      } else if (action === 'UNSET_ROLE') {
        await auth.setCustomUserClaims(query.userId as string, {
          role: undefined,
        })
      }

      return res.status(200).json({ status: 200, payload: 'Success' })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error: unknown) {
    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
