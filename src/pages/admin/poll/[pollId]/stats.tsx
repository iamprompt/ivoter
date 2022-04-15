import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'
import type { Poll } from '~/core/@types/firebase/Poll'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Participants } from '~/modules/api/@types/response/Participant'

const StatisticsPage: NextPage = () => {
  const { query } = useRouter()
  const pollId = useMemo(() => query.pollId, [query])

  const { data: pollResponse } = useSWR<APIResponse<Poll>>(
    pollId ? `/api/admin/poll/${pollId}` : null
  )

  const { data } = useSWR<APIResponse<Participants>>(
    pollId ? `/api/admin/poll/${pollId}/participants` : null
  )

  return (
    <>
      <div className="space-y-3 pb-4">
        <h1 className="text-4xl font-bold">{pollResponse?.payload.title}</h1>
        <h2 className="text-2xl font-bold text-green-500">Statistics</h2>
      </div>

      <div className="relative overflow-auto rounded-xl border bg-gray-100">
        <div className="overflow-hidden shadow-sm">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="border-b border-slate-300">
              <tr className="divide-x divide-slate-200">
                <th className="w-16 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  No
                </th>
                <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Email
                </th>
                <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Vote
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/90">
              {data?.payload.map((participant, index) => (
                <tr
                  key={participant.uid}
                  className="divide-x divide-slate-200 hover:bg-gray-200/50"
                >
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {index + 1}
                  </td>
                  <td className="p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {participant.email}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {participant.ballot &&
                      `${participant.ballot.option} (${dayjs(
                        participant.ballot.timestamp
                      ).format('DD/MM/YY HH:mm')})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default StatisticsPage
