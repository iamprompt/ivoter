import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AppLayout } from '~/app/components/layout'
import { Context } from '~/context/storeon'
import { AuthWrapper } from '~/app/components/authWrapper'

function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter()

  return (
    <Context>
      <AppLayout>
        {asPath === '/' ? (
          <Component {...pageProps} />
        ) : (
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        )}
      </AppLayout>
    </Context>
  )
}

export default App
