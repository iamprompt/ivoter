import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useStoreon } from '~/context/storeon'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import { formatDocument } from '~/app/services/formatDocument'
import { createApiInstance } from '~/core/services/createApiInstance'
import { PollAdminFormModule } from '~/modules/admin/poll/forms/components/form'
import type { Poll } from '~/modules/api/@types/response/Poll'

const Page: NextPage = () => {
  const { push, query } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  const { data, error } = useSWR<APIResponse<Poll>>(
    query.pollId ? `/api/admin/poll/${query.pollId}` : null
  )

  if (error) {
    return <div>Error</div>
  }

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Edit Poll</h1>
      </div>
      {data && (
        <PollAdminFormModule
          type="edit"
          config={{
            initialValues: {
              title: data.payload.title,
              question: data.payload.question,
              description: data.payload.description,
              options: data.payload.options,
              start_date: dayjs(data.payload.start_date).format(
                'YYYY-MM-DDTHH:mm'
              ),
              end_date: dayjs(data.payload.end_date).format('YYYY-MM-DDTHH:mm'),
            },
            onSubmit: async (values) => {
              try {
                await (
                  await createApiInstance(auth!)
                ).patch<APIResponse<string>>(
                  `/api/admin/poll/${query.pollId}`,
                  formatDocument(values)
                )

                push({
                  pathname: '/admin/poll/[pollId]',
                  query: { pollId: query.pollId },
                })
              } catch (error) {}
            },
          }}
        />
      )}
    </>
  )
}

export default Page
