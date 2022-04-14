import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'
import Error from 'next/error'
import { Icon } from '@iconify/react'
import ArrowRightIcon from '@iconify/icons-heroicons-outline/arrow-right'
import PencilIcon from '@iconify/icons-heroicons-outline/pencil'
import { Bar } from 'react-chartjs-2'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import dayjs from 'dayjs'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const Page: NextPage = () => {
  const { query } = useRouter()

  const pollId = useMemo(() => query.pollId as string, [query])

  const { data, error } = useSWR<APIResponse<Poll>>(
    pollId ? `/api/admin/poll/${pollId}` : null
  )

  if (!data && error) {
    return <Error statusCode={404} />
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>{data.payload.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-2">
        {/* Summary Section */}
        <div className="col-span-1">
          <div className="flex flex-row items-end justify-between pb-1 text-2xl font-bold text-green-500">
            <span>Summary</span>
            <div>
              <Link
                href={{
                  pathname: '/admin/poll/[pollId]/edit',
                  query: {
                    pollId,
                  },
                }}
              >
                <a className="text-sm font-normal text-green-500">
                  Edit Poll
                  <Icon
                    icon={PencilIcon}
                    className="ml-1 inline-block"
                    inline
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-lg py-3 lg:grid-cols-2">
            <div className="flex lg:col-span-2">
              <span className="w-28 shrink-0 font-bold">Duration:</span>
              <p>
                {dayjs(data.payload.start_date).format('DD MMM YYYY HH:mm')} -{' '}
                {dayjs(data.payload.end_date).format('DD MMM YYYY HH:mm')}
              </p>
            </div>

            <div className="flex lg:col-span-2">
              <span className="w-28 shrink-0 font-bold">Question:</span>
              <p>{data.payload.question}</p>
            </div>

            <div className="flex lg:col-span-2">
              <span className="w-28 shrink-0 font-bold">Description:</span>
              <p>{data.payload.description}</p>
            </div>

            <div className="flex lg:col-span-2">
              <span className="w-28 shrink-0 font-bold">Options:</span>
              <ul>
                {data.payload.options.map((option, index) => (
                  <li key={option.id}>{`${index + 1}. ${option.name}`}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-row items-end justify-between pb-1 text-2xl font-bold text-green-500">
            <span>Participants</span>
            <div>
              <Link
                href={{
                  pathname: '/admin/poll/[pollId]/participants/add',
                  query: {
                    pollId,
                  },
                }}
              >
                <a className="inline-block rounded-full bg-green-500 py-1 px-2 text-sm font-normal text-white">
                  Add Participants
                </a>
              </Link>
            </div>
          </div>
          <div className="py-3">
            <div className="relative overflow-auto rounded-xl border bg-gray-100">
              <div className="overflow-hidden shadow-sm">
                <table className="w-full table-fixed border-collapse text-sm">
                  <thead className="border-b border-slate-300">
                    <tr className="divide-x divide-slate-200">
                      <th className="w-16 p-2 text-center font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200">
                        No
                      </th>
                      <th className="p-2 text-center font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200">
                        Email
                      </th>
                    </tr>
                  </thead>
                  {data.payload.participants &&
                    data.payload.participants.length > 0 && (
                      <tbody className="divide-y divide-slate-200 bg-white/90">
                        {data.payload.participants
                          .slice(0, 5)
                          .map((participant, index) => (
                            <tr
                              className="divide-x divide-slate-200 hover:bg-gray-200/50"
                              key={participant}
                            >
                              <td className="p-2 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                {index + 1}
                              </td>
                              <td className="p-2 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                {participant}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    )}
                </table>

                {data.payload.participants &&
                  data.payload.participants.length > 0 && (
                    <div className="space-y-3 border-t border-slate-300 bg-gray-50 p-2 text-center">
                      <Link
                        passHref
                        href={{
                          pathname: '/admin/poll/[pollId]/participants',
                          query: {
                            pollId,
                          },
                        }}
                      >
                        <a className="font-bold text-slate-700">
                          View all
                          <Icon
                            icon={ArrowRightIcon}
                            className="ml-1 inline-block"
                            inline
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                {(data.payload.participants?.length === 0 ||
                  !data.payload.participants) && (
                  <div className="space-y-3 bg-gray-50 p-2 py-5 text-center">
                    <div className="text-xl font-bold">No Participants...</div>
                    <Link
                      href={{
                        pathname: '/admin/poll/[pollId]/participants/add',
                        query: {
                          pollId,
                        },
                      }}
                    >
                      <a className="inline-block rounded-full bg-green-500 py-2 px-3 text-white">
                        Add Participants
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <div className="flex flex-row items-end justify-between pb-1 text-2xl font-bold text-green-500">
            <span>Statistics</span>
            <div>
              <Link
                href={{
                  pathname: '/admin/poll/[pollId]/stats',
                  query: {
                    pollId,
                  },
                }}
              >
                <a className="text-sm font-normal text-green-500">
                  View Details
                  <Icon
                    icon={ArrowRightIcon}
                    className="ml-1 inline-block"
                    inline
                  />
                </a>
              </Link>
            </div>
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
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: ['#000000'],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
