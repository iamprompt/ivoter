import type { NextApiHandler } from 'next'
import type { Poll } from '~/core/@types/firebase/Poll'
import { formatDocument } from '~/modules/api/services/formatDocument'
import { db } from '~/modules/api/services/firebase/getFirestoreInstance'
import { getUserAndVerifyAuth } from '~/modules/api/services/firebase/getUserAndVerifyAuth'
import { auth } from '~/modules/api/services/firebase/getAuthInstance'
import type {
  OptionSummary,
  StatsResponse,
} from '~/modules/api/@types/response/Stats'
import type { Ballot, Ballots } from '~/modules/api/@types/response/Ballot'

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

    // GET – Get a poll
    if (method === 'GET') {
      const pollRef = db.collection('polls').doc(id as string)
      const poll = (await pollRef
        .get()
        .then((snapshot) =>
          snapshot.exists ? formatDocument(snapshot.data() as Poll) : undefined
        )) as Poll | undefined

      if (!poll) {
        return res.status(404).json({ status: 404, payload: 'Not Found' })
      }

      const ballotsRef = pollRef.collection('ballots')
      const ballotsSnapshot = await ballotsRef.get()

      const ballots = ballotsSnapshot.docs.reduce((acc, doc) => {
        return {
          ...acc,
          [doc.id]: formatDocument(
            {
              ...(doc.data() as Ballot),
              name: poll.options.find(
                (option) => option.id === (doc.data() as Ballot).optionId
              )?.name,
            },
            [],
            'timestamp'
          ) as Ballot,
        }
      }, {} as Ballots)

      const pollOptionInit = poll.options.reduce((acc, option) => {
        return {
          ...acc,
          [option.id]: {
            optionId: option.id,
            name: option.name,
            count: 0,
          },
        }
      }, {} as Record<string, OptionSummary>)

      const options = ballotsSnapshot.docs.reduce((acc, ballot) => {
        const ballotData = ballot.data() as Ballot

        if (!poll.participants?.includes(ballot.id)) {
          return acc
        }

        return {
          ...acc,
          [ballotData.optionId]: {
            ...acc[ballotData.optionId],
            optionId: ballotData.optionId,
            name:
              poll.options.find((option) => option.id === ballotData.optionId)
                ?.name || '',
            count: (acc[ballotData.optionId]?.count || 0) + 1,
          },
        }
      }, pollOptionInit as Record<string, OptionSummary>)

      const participantsMeta = await Promise.all(
        (poll.participants || []).map(async (uid) => {
          const u = await auth.getUser(uid)

          return {
            uid,
            email: u.email || '',
            displayName: u.displayName,
            ballot: ballots[uid],
          }
        })
      )

      const payload: StatsResponse = {
        title: poll.title,
        status: 'ACTIVE',
        participants: participantsMeta,
        summary: {
          eligibleParticipants: poll.participants?.length || 0,
          votedParticipants: Object.values(options).reduce(
            (acc, option) => acc + option.count,
            0 as number
          ),
          options: Object.values(options),
        },
      }

      return res.status(200).json({ status: 200, payload })
    }

    return res.status(405).json({ status: 405, payload: 'Method Not Allowed' })
  } catch (error) {
    console.log(error)

    return res.status(401).json({ status: 401, payload: 'Unauthorized' })
  }
}

export default API
