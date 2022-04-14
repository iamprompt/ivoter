import clsx from 'clsx'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import { Icon } from '@iconify/react'

import PlusOutlineIcon from '@iconify/icons-heroicons-outline/plus'
import TrashOutlineIcon from '@iconify/icons-heroicons-outline/trash'

import { useState } from 'react'
import Link from 'next/link'
import { useStoreon } from '~/context/storeon'
import { createApiInstance } from '~/core/services/createApiInstance'
import { FileDropZone } from '~/modules/admin/poll/participants/components/fileDropZone'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'

interface NewUserMeta {
  email: string
  password: string
}

const Page: NextPage = () => {
  const { query, reload } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  const [isShowDropZone, setIsShowDropZone] = useState<boolean>(true)
  const [isShowAccountForm, setIsShowAccountForm] = useState<boolean>(true)
  const [isShowAccountSummary, setIsShowAccountSummary] =
    useState<boolean>(false)

  const [accountSummary, setAccountSummary] = useState<Record<
    'new' | 'existed',
    Array<string>
  > | null>(null)

  const formik = useFormik({
    initialValues: {
      users: [{ email: '', password: '' }],
    },
    onSubmit: async (values) => {
      console.log(values)

      const { data } = await (
        await createApiInstance(auth!)
      ).post<APIResponse<Record<'new' | 'existed', Array<string>>>>(
        `/api/admin/poll/${query.pollId}/participants`,
        values
      )

      // console.log(data)

      setAccountSummary(data.payload)
      setIsShowDropZone(false)
      setIsShowAccountForm(false)
      setIsShowAccountSummary(true)
    },
  })

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Add Participants - []</h1>
      </div>

      {isShowDropZone && (
        <FileDropZone
          onChange={(e) => {
            formik.setFormikState((state) => ({
              ...state,
              values: {
                ...state.values,
                users: [
                  ...state.values.users.filter(
                    (_) => _.email !== '' || _.password !== ''
                  ),
                  ...e.map((d: NewUserMeta) => ({
                    email: d.email,
                    password: d.password,
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
                        <input
                          value={user.password}
                          name={`users.${index}.password`}
                          onChange={formik.handleChange}
                          placeholder={`Password`}
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
                    <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                      Password
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white/90">
                  {Object.entries(accountSummary).map(([type, accounts]) => (
                    <>
                      {accounts.map((account, index) => (
                        <tr
                          key={`${type}-${index}`}
                          className={clsx(
                            'divide-x divide-slate-200 ',
                            type === 'new'
                              ? 'bg-green-100 hover:bg-green-200/75'
                              : 'hover:bg-gray-200/50'
                          )}
                        >
                          <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            {account}
                          </td>
                          <td
                            className={clsx(
                              'p-4 text-center  dark:border-slate-700 dark:text-slate-400',
                              type === 'new'
                                ? 'text-blue-500'
                                : 'text-slate-500'
                            )}
                          >
                            {type === 'new'
                              ? formik.values.users.find(
                                  (u) => u.email === account
                                )?.password
                              : 'Use Previous Password'}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-x-5">
            <button
              type="button"
              onClick={() => {}}
              className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
            >
              Export Added Participants
            </button>
            <button
              type="button"
              onClick={() => {
                reload()
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
