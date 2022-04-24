import clsx from 'clsx'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import { Icon } from '@iconify/react'

import PlusOutlineIcon from '@iconify/icons-heroicons-outline/plus'
import TrashOutlineIcon from '@iconify/icons-heroicons-outline/trash'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import type { AxiosError } from 'axios'
import { unparse } from 'papaparse'
import { useStoreon } from '~/context/storeon'
import { createApiInstance } from '~/core/services/createApiInstance'
import { FileDropZone } from '~/modules/admin/poll/participants/components/fileDropZone'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'

interface NewUserMeta {
  email: string
}

interface UsersResponse {
  uid: string
  email: string
  password: string
}

const Page: NextPage = () => {
  const { query } = useRouter()
  const { pollId } = query
  const {
    user: { auth },
  } = useStoreon('user')

  const { data } = useSWR<APIResponse<Poll>, AxiosError>(
    pollId ? `/api/admin/poll/${pollId}` : null
  )

  const [isShowDropZone, setIsShowDropZone] = useState<boolean>(true)
  const [isShowAccountForm, setIsShowAccountForm] = useState<boolean>(true)
  const [isShowAccountSummary, setIsShowAccountSummary] =
    useState<boolean>(false)

  const [accountSummary, setAccountSummary] = useState<UsersResponse[]>([])

  const formik = useFormik({
    initialValues: {
      users: [{ email: '' }],
    },
    onSubmit: async (values) => {
      console.log(values)

      const { data } = await (
        await createApiInstance(auth!)
      ).post<APIResponse<UsersResponse[]>>(
        `/api/admin/poll/${query.pollId}/participants`,
        values
      )

      setAccountSummary(data.payload)
      setIsShowDropZone(false)
      setIsShowAccountForm(false)
      setIsShowAccountSummary(true)
    },
  })

  const csvFileUrl = () => {
    const csv = unparse<UsersResponse>(accountSummary, { header: true })
    const csvFile = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    return csvFile
  }

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Add Participants{data ? `  - ${data?.payload.title}` : ''}</h1>
      </div>

      {isShowDropZone && (
        <FileDropZone
          onChange={(e) => {
            formik.setFormikState((state) => ({
              ...state,
              values: {
                ...state.values,
                users: [
                  ...state.values.users.filter((_) => _.email !== ''),
                  ...e.map((d: NewUserMeta) => ({
                    email: d.email,
                  })),
                ],
              },
            }))

            setIsShowDropZone(false)
          }}
        />
      )}

      {isShowAccountForm && (
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FieldArray name="users">
              {({ push, remove }) => (
                <>
                  <div className="mt-5 space-y-4">
                    {formik.values.users.map((user, index) => (
                      <div key={index} className="flex items-center gap-5">
                        <span className="w-4 text-right">{index + 1}</span>
                        <input
                          value={user.email}
                          name={`users.${index}.email`}
                          onChange={formik.handleChange}
                          placeholder={`Email`}
                          className="txtInput w-1/2"
                        />

                        <span className="flex flex-row items-center gap-3">
                          <Icon
                            icon={TrashOutlineIcon}
                            onClick={() =>
                              formik.values.users.length > 1 && remove(index)
                            }
                            className={clsx(
                              formik.values.users.length > 1
                                ? 'cursor-pointer text-gray-600 hover:text-red-600'
                                : 'cursor-not-allowed text-gray-300'
                            )}
                          />
                        </span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          email: '',
                          password: '',
                        })
                      }
                      className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
                    >
                      <Icon icon={PlusOutlineIcon} inline className="inline" />{' '}
                      More
                    </button>
                  </div>
                </>
              )}
            </FieldArray>
            <div className="mt-8 flex justify-end gap-x-5">
              <button
                type="submit"
                className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
              >
                Add Participants
              </button>
            </div>
          </form>
        </FormikProvider>
      )}

      {isShowAccountSummary && accountSummary && (
        <>
          <div className="relative overflow-auto rounded-xl border bg-gray-100">
            <div className="overflow-hidden shadow-sm">
              <table className="w-full table-auto border-collapse text-sm">
                <thead className="border-b border-slate-300">
                  <tr className="divide-x divide-slate-200">
                    <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white/90">
                  {accountSummary.map((account, index) => (
                    <>
                      <tr
                        key={`${index}-${account.email}`}
                        className="divide-x divide-slate-200"
                      >
                        <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          {account.email}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-x-5">
            <a
              href={URL.createObjectURL(csvFileUrl())}
              download={`participants-${Date.now()}.csv`}
              className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
            >
              Export Added Participants
            </a>
            <button
              type="button"
              onClick={() => {
                setAccountSummary([])
                setIsShowAccountForm(true)
                setIsShowAccountSummary(false)
                setIsShowDropZone(true)
              }}
              className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
            >
              Add More Participants
            </button>
            <Link
              href={{
                pathname: '/admin/poll/[pollId]',
                query: {
                  pollId: query.pollId,
                },
              }}
            >
              <a className="items-center rounded-full bg-green-500 py-2 px-4 text-white">
                Back
              </a>
            </Link>
          </div>
        </>
      )}
    </>
  )
}

export default Page
