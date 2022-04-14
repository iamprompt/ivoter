import type { NextPage } from 'next'
import { SigninModule } from '~/modules/auth/signin/components'

const Page: NextPage = () => {
  return (
    <div>
      <SigninModule />
    </div>
  )
}

export default Page
