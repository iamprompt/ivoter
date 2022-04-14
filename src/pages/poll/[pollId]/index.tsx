import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { RadioGroup } from '@headlessui/react'
import { Icon } from '@iconify/react'
import checkIcon from '@iconify/icons-heroicons-outline/check'
import axios from 'axios'
import DefaultErrorPage from 'next/error'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useStoreon } from '~/context/storeon'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import type { Poll } from '~/modules/api/@types/response/Poll'
import { createApiInstance } from '~/core/services/createApiInstance'
import { CenterSpinner } from '~/core/components/centerSpinner'

const Page: NextPage = () => {
  const { push, query } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  const [selected, setSelected] = useState<string>('')

  const { data, error } = useSWR<APIResponse<Poll>>(
    query.pollId ? `/api/poll/${query.pollId}` : null
  )

  const handleSubmit = async () => {
    try {
      const r = await (
        await createApiInstance(auth!)
      ).post(`/api/poll/${query.pollId}`, { optionId: selected })

      console.log(r.data)

      push(`/poll/${query.pollId}/success`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data)
      }
    }
  }

  if (error) {
    return <DefaultErrorPage statusCode={error.status} />
  }

  if (!data) {
    return <CenterSpinner />
  }

  return (
    <>
      <div className="pb-3 text-4xl font-bold">
        <h1>{data.payload.title}</h1>
        <p className="mt-2 text-base font-normal">
          {dayjs(data.payload.start_date).format('DD MMMM YYYY hh:mm A')} -{' '}
          {dayjs(data.payload.end_date).format('DD MMMM YYYY hh:mm A')}
        </p>
      </div>
      <div className="mb-5">
        <span className="text-lg font-bold">Description:</span>{' '}
        {data.payload.description}
      </div>
      <div className="w-full bg-gray-50 p-5">
        <div>
          <span className="text-lg font-bold">Question:</span>{' '}
          {data.payload.question}
        </div>
        <div>
          <RadioGroup value={selected} onChange={setSelected} className="mt-2">
            <RadioGroup.Label className="text-xl font-bold">
              Choose your choice:
            </RadioGroup.Label>
            <div className="mt-5 space-y-4">
              {data.payload.options.map((opt) => (
                <RadioGroup.Option
                  value={opt.id}
                  key={opt.id}
                  className="focus-visible:outline-none"
                >
                  {({ checked, disabled }) => (
                    <div
                      className={`flex w-full items-center rounded-xl border-4 py-3 px-5 ${
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        checked
                          ? 'border-transparent bg-[#6FCF97] text-white'
                          : 'border-[#6FCF97] bg-white text-black'
                      }`}
                    >
                      <RadioGroup.Label
                        as="p"
                        className="flex-1 text-2xl font-bold"
                      >
                        {opt.name}
                      </RadioGroup.Label>
                      {checked && (
                        <div className="flex-shrink-0 text-white">
                          <Icon icon={checkIcon} className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <div className="mt-12 flex flex-col-reverse justify-center gap-5 sm:flex-row sm:gap-8">
            <button
              onClick={() => {
                if (selected) {
                  console.log(selected)
                  handleSubmit()
                }
              }}
              className={`rounded-lg border-2 border-transparent ${
                selected !== ''
                  ? 'bg-blue-500'
                  : 'cursor-not-allowed bg-gray-200'
              } py-3 px-16 text-center font-bold text-white`}
            >
              Submit Vote
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
