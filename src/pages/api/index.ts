import type { NextApiHandler } from 'next'

const API: NextApiHandler = async (req, res) => {
  return res.json({ status: 200, payload: 'Hello World' })
}

export default API
