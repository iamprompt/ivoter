import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import useSWR from 'swr'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { StatsResponse } from '~/modules/api/@types/response/Stats'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const StatisticsPage: NextPage = () => {
  const { query } = useRouter()
  const pollId = useMemo(() => query.pollId, [query])

  const { data: stats } = useSWR<APIResponse<StatsResponse>>(
    pollId ? `/api/admin/poll/${pollId}/stats` : null
  )

  return (
    <>
      <div className="space-y-3 pb-4">
        <h1 className="text-4xl font-bold">{stats?.payload.title}</h1>
        <h2 className="text-2xl font-bold text-green-500">Statistics</h2>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-5">
        <div className="flex w-full flex-col rounded-lg border border-green-400 bg-green-50 p-5">
          <span className="my-4 text-center text-4xl font-bold">
            {stats?.payload.summary.votedParticipants}
          </span>
          <span className="text-center text-xl font-bold">
            Voted Participants
          </span>
        </div>
        <div className="flex w-full flex-col rounded-lg border border-blue-400 bg-blue-50 p-5">
          <span className="my-4 text-center text-4xl font-bold">
            {stats?.payload.summary.eligibleParticipants}
          </span>
          <span className="text-center text-xl font-bold">
            Eligible Participants
          </span>
        </div>
      </div>

      {stats && stats.payload.summary && (
        <div>
          <div className="flex flex-row items-end justify-between pb-3 text-2xl font-bold text-green-500">
            <span>Graph</span>
          </div>
          <div>
            <Bar
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    displayColors: false,
                  },
                },
              }}
              data={{
                labels: stats.payload.summary.options.map((stat) => stat.name),
                datasets: [
                  {
                    data: stats.payload.summary.options.map(
                      (stat) => stat.count
                    ),
                    backgroundColor: [
                      '#FFAABB',
                      '#FFBBAA',
                      '#FFCCBB',
                      '#FFDDAA',
                      '#FFEEBB',
                      '#FFFFAA',
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="flex flex-row items-end justify-between pb-3 text-2xl font-bold text-green-500">
          <span>List</span>
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
                {stats?.payload.participants.map((participant, index) => (
                  <tr
                    key={participant.uid}
                    className="divide-x divide-slate-200 hover:bg-gray-200/50"
                  >
                    <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {index + 1}
                    </td>
                    <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {participant.email}
                    </td>
                    <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {participant.ballot &&
                        `${participant.ballot.name} (${dayjs(
                          participant.ballot.timestamp
                        ).format('DD/MM/YY HH:mm')})`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatisticsPage
