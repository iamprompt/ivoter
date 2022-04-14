import { useRouter } from 'next/router'
import type { FunctionComponent } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { Header } from './header'
import { Footer } from './footer'
import { CenterSpinner } from '~/core/components/centerSpinner'
import { useAuth } from '~/core/services/useAuth'
import { useStoreon } from '~/context/storeon'
import { createApiInstance } from '~/core/services/createApiInstance'

export const AppLayout: FunctionComponent = ({ children }) => {
  const { events, asPath, push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    user: { auth },
  } = useStoreon('user')

  useAuth()

  const routeChangeStart = () => {
    setIsLoading(true)
  }

  const routeChangeEnd = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    events.on('routeChangeStart', routeChangeStart)
    events.on('routeChangeComplete', routeChangeEnd)
    events.on('routeChangeError', routeChangeEnd)

    return () => {
      events.off('routeChangeStart', routeChangeStart)
      events.off('routeChangeComplete', routeChangeEnd)
      events.off('routeChangeError', routeChangeEnd)
    }
  }, [])

  useEffect(() => {
    if (['/'].includes(asPath) && auth !== undefined && auth !== null) {
      auth.getIdTokenResult().then((res) => {
        if (res.claims.role === 'admin') {
          push('/admin')
        } else {
          push('/poll')
        }
      })
    }
  }, [asPath, auth])

  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        suspense: true,
        fetcher: async (url) =>
          auth
            ? (await createApiInstance(auth)).get(url).then((res) => res.data)
            : null,
      }}
    >
      {isLoading ? (
        <CenterSpinner />
      ) : (
        <>
          {/* <CenterSpinner /> */}
          <Suspense fallback={<CenterSpinner />}>
            <div className="relative">
              <Header className="max-w-screen-xl" />
              <main className="z-20 mx-auto max-w-screen-xl py-10 px-4 lg:px-8">
                {children}
              </main>
              <Footer />
            </div>
          </Suspense>
        </>
      )}
    </SWRConfig>
  )
}
