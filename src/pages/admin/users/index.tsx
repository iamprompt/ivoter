import type { NextPage } from 'next'
import Link from 'next/link'
import { Fragment, useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { Icon } from '@iconify/react'
import PencilOutlineIcon from '@iconify/icons-heroicons-outline/pencil'
// import PlusOutlineIcon from '@iconify/icons-heroicons-outline/plus'
import ClipboardCopyIcon from '@iconify/icons-heroicons-outline/clipboard-copy'
import ShieldExclamationIcon from '@iconify/icons-heroicons-outline/shield-exclamation'
import ShieldCheckIcon from '@iconify/icons-heroicons-outline/shield-check'
import dayjs from 'dayjs'
import clsx from 'clsx'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Users } from '~/modules/api/@types/response/Users'
import { useStoreon } from '~/context/storeon'
import { createApiInstance } from '~/core/services/createApiInstance'

const Page: NextPage = () => {
  const {
    user: { auth },
  } = useStoreon('user')
  const { data, mutate } = useSWR<APIResponse<Users>>('/api/admin/users')

  const canRemoveAdmin = useMemo(
    () =>
      (data?.payload.reduce(
        (acc, u) => (u.role === 'admin' ? acc + 1 : acc),
        0
      ) || 0) > 1 || false,
    [data]
  )

  const handleModifyAdmin = async (userId: string, action: string) => {
    if (!auth) {
      return
    }

    if (action === 'UNSET_ROLE' && !canRemoveAdmin) {
      return
    }

    await (
      await createApiInstance(auth)
    ).post(`/api/admin/users/${userId}/admin`, { action })

    mutate()
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Fragment>
      <div className="pb-4 text-4xl font-bold">
        <h1>Users</h1>
      </div>
      {/* <div className="my-5 flex items-end justify-between">
        <div className="text-2xl font-bold">Poll List</div>
        <Link href={`/admin/poll/create`}>
          <a className="items-center rounded-full bg-green-500 py-2 px-4 text-white">
            <Icon icon={PlusOutlineIcon} className="mr-2 inline" inline />
            <span>Add Poll</span>
          </a>
        </Link>
      </div> */}
      <div className="relative overflow-auto rounded-xl border bg-gray-100">
        <div className="overflow-hidden shadow-sm">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="border-b border-slate-300">
              <tr className="">
                <th className="w-14 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  No
                </th>
                <th className="w-60 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Email
                </th>
                <th className="w-28 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Role
                </th>
                <th className="w-40 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Last Sign In
                </th>
                <th className="w-auto p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  UID
                </th>
                <th className="w-32 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/90">
              {data?.payload.map((user, index) => (
                <tr key={user.uid} className=" hover:bg-gray-200/50">
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {index + 1}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {user.role && (
                      <span className="rounded-full bg-green-300 px-3 capitalize">
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {user.lastSignInTime &&
                      dayjs(user.lastSignInTime).format('DD MMM YY HH:mm')}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {user.uid}{' '}
                    <Icon
                      icon={ClipboardCopyIcon}
                      className="inline cursor-pointer hover:text-green-500"
                      inline
                      onClick={() => navigator.clipboard.writeText(user.uid)}
                    />
                  </td>
                  <td className="items-center space-x-2 p-4 pr-8 text-right text-lg text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <Icon
                      className={clsx(
                        'inline-block cursor-pointer',
                        user.role === 'admin'
                          ? 'hover:text-red-500'
                          : 'hover:text-green-500'
                      )}
                      icon={
                        user.role === 'admin'
                          ? ShieldExclamationIcon
                          : ShieldCheckIcon
                      }
                      onClick={() =>
                        handleModifyAdmin(
                          user.uid,
                          user.role === 'admin' ? 'UNSET_ROLE' : 'SET_ROLE'
                        )
                      }
                    />
                    <Link
                      href={{
                        pathname: '/admin/users/[userId]/edit',
                        query: { userId: user.uid },
                      }}
                    >
                      <a>
                        <Icon
                          icon={PencilOutlineIcon}
                          className="inline-block cursor-pointer hover:text-green-500"
                        />
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  )
}

export default Page
