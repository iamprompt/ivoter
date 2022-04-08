import { useRouter } from 'next/router'
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'

export const AppLayout: FunctionComponent = ({ children }) => {
  const { events } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  return isLoading ? (
    <div className="min-h-screen bg-gray-50">Loading...</div>
  ) : (
    <div className="min-h-screen bg-gray-50">{children}</div>
  )
}
