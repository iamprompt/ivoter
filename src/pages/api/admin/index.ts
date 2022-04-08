import type { NextApiHandler } from 'next'

const API: NextApiHandler = (req, res) => {
  return res.status(200).json({ status: 200, payload: 'Admin API is working' })
}

export default API
