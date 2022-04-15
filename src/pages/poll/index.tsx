import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import useSWR from 'swr'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'

const Page: NextPage = () => {
  const { data } = useSWR<APIResponse<Record<string, Poll>>>('/api/poll')

  return (
    <Fragment>
      <div className="pb-4 text-4xl font-bold">
        <h1>Poll List</h1>
      </div>
      <div className="my-5 flex items-end justify-between">
        <div className="text-2xl font-bold">Select Poll to vote</div>
      </div>
      <div className="w-full space-y-5 bg-gray-50 p-5">
        {data &&
          Object.entries(data.payload).map(([pollId, poll]) => (
            <Link
              href={{
                pathname: '/poll/[pollId]',
                query: {
                  pollId,
                },
              }}
              key={pollId}
            >
              <a className="block cursor-pointer rounded-lg border-2 bg-white p-4 pl-8 text-slate-500 hover:bg-gray-200 dark:text-slate-400">
                <p className="text-lg font-bold hover:text-slate-800">
                  {poll.title}
                </p>
                <div>
                  {dayjs(poll.start_date).format('DD MMM YYYY HH:mm')} -{' '}
                  {dayjs(poll.end_date).format('DD MMM YYYY HH:mm')}
                </div>
              </a>
            </Link>
          ))}
      </div>
    </Fragment>
  )
}

export default Page
