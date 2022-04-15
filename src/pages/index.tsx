import type { NextPage } from 'next'
import { useMemo } from 'react'
import { useStoreon } from '~/context/storeon'
import { Spinner } from '~/core/components/spinner'
import { SigninModule } from '~/modules/auth/signin/components'

const Page: NextPage = () => {
  const {
    user: { auth },
  } = useStoreon('user')

  const isAuth = useMemo(() => !!auth, [auth])

  return <div>{isAuth ? <Spinner /> : <SigninModule />}</div>
}

export default Page
