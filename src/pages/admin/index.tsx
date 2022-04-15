import { Icon } from '@iconify/react'
import type { NextPage } from 'next'
import Link from 'next/link'

// Icon
import PencilOutlineIcon from '@iconify/icons-heroicons-outline/pencil'
import ChartSquareBarOutlineIcon from '@iconify/icons-heroicons-outline/chart-square-bar'
import PlusOutlineIcon from '@iconify/icons-heroicons-outline/plus'
import ChevronLeftOutlineIcon from '@iconify/icons-heroicons-outline/chevron-left'
import ChevronRightOutlineIcon from '@iconify/icons-heroicons-outline/chevron-right'
import useSWR from 'swr'
import dayjs from 'dayjs'
import type { AxiosError } from 'axios'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'

const Page: NextPage = () => {
  const { data } = useSWR<APIResponse<Poll>, AxiosError>('/api/admin/poll')

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="my-5 flex items-end justify-between">
        <div className="text-2xl font-bold">Poll List</div>
        <Link href={`/admin/poll/create`}>
          <a className="items-center rounded-full bg-green-500 py-2 px-4 text-white">
            <Icon icon={PlusOutlineIcon} className="mr-2 inline" inline />
            <span>Add Poll</span>
          </a>
        </Link>
      </div>
      <div className="relative overflow-auto rounded-xl bg-gray-100">
        <div className="overflow-hidden shadow-sm">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-5/12 border-b border-slate-300 p-4 pl-8 pt-4 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Title
                </th>
                <th className="w-3/12 border-b border-slate-300 p-4 pr-8 pt-4 pb-3 text-right font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {data &&
                Object.entries(data.payload).map(([pollId, poll]) => (
                  <tr key={pollId} className="hover:bg-gray-200/50">
                    <td className="border-b border-slate-300 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      <Link
                        href={{
                          pathname: '/admin/poll/[pollId]',
                          query: {
                            pollId,
                          },
                        }}
                      >
                        <a className="text-lg font-bold hover:text-slate-800">
                          {poll.title}
                        </a>
                      </Link>
                      <div>
                        {dayjs(poll.start_date).format('DD MMM YYYY HH:mm')} -{' '}
                        {dayjs(poll.end_date).format('DD MMM YYYY HH:mm')}
                      </div>
                    </td>
                    <td className="border-b border-slate-300 p-4 pr-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      <div className="flex justify-end gap-5">
                        <Link
                          href={{
                            pathname: '/admin/poll/[pollId]/stats',
                            query: { pollId },
                          }}
                        >
                          <a>
                            <Icon
                              icon={ChartSquareBarOutlineIcon}
                              className="h-7 w-7 cursor-pointer hover:text-slate-800"
                            />
                          </a>
                        </Link>
                        <Link
                          href={{
                            pathname: '/admin/poll/[pollId]/edit',
                            query: { pollId },
                          }}
                        >
                          <a>
                            <Icon
                              icon={PencilOutlineIcon}
                              className="h-7 w-7 cursor-pointer hover:text-slate-800"
                            />
                          </a>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex w-full items-center justify-between border-gray-200 bg-gray-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">10</span> of{' '}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <Icon icon={ChevronLeftOutlineIcon} className="h-5 w-5" />
                </a>
                {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 md:inline-flex"
                >
                  3
                </a>
                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
                <a
                  href="#"
                  className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 md:inline-flex"
                >
                  8
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  9
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  10
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <Icon icon={ChevronRightOutlineIcon} className="h-5 w-5" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
