import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useStoreon } from '~/context/storeon'
import type { APIResponse } from '~/modules/api/@types/response/APIResponse'
import { formatDocument } from '~/app/services/formatDocument'
import { createApiInstance } from '~/core/services/createApiInstance'
import { PollAdminFormModule } from '~/modules/admin/poll/forms/components/form'

const Page: NextPage = () => {
  const { push } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Create Poll</h1>
      </div>
      <PollAdminFormModule
        type="create"
        config={{
          initialValues: {
            title: '',
            question: '',
            description: '',
            options: [{ name: '' }, { name: '' }],
            start_date: '',
            end_date: '',
          },
          onSubmit: async (values) => {
            try {
              const {
                data: { payload },
              } = await (
                await createApiInstance(auth!)
              ).post<APIResponse<string>>(
                '/api/admin/poll',
                formatDocument(values)
              )

              push({
                pathname: '/admin/poll/[pollId]',
                query: { pollId: payload },
              })
            } catch (error) {}
          },
        }}
      />
    </>
  )
}

export default Page
