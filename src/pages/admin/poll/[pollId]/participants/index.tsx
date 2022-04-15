import type { NextPage } from 'next'
import TrashIcon from '@iconify/icons-heroicons-outline/trash'
import { Icon } from '@iconify/react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { Participants } from '~/modules/api/@types/response/Participant'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'

const Page: NextPage = () => {
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
        <h2 className="text-2xl font-bold text-green-500">Participants</h2>
      </div>

      <div className="relative overflow-auto rounded-xl border bg-gray-100">
        <div className="overflow-hidden shadow-sm">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="border-b border-slate-300">
              <tr className="divide-x divide-slate-200">
                <th className="w-16 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  No
                </th>
                <th className="w-auto p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Email
                </th>
                <th className="w-20 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  <span className="sr-only">Delete</span>
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
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {participant.email}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <Icon
                      icon={TrashIcon}
                      className="mx-auto cursor-pointer hover:text-red-500"
                    />
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

export default Page
