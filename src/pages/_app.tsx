import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppLayout } from '~/app/components/layout'

function _App({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  )
}

export default _App
