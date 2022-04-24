import { useRouter } from 'next/router'
import type { FunctionComponent, ReactNode } from 'react'
import { useEffect } from 'react'

import { useStoreon } from '../../context/storeon'

import { CenterSpinner } from '../../core/components/centerSpinner'

export const AuthWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { push, asPath } = useRouter()
  const {
    dispatch,
    user: { auth },
  } = useStoreon('user', 'next')

  useEffect(() => {
    if (auth === undefined || auth === null) {
      dispatch('next/set', window.location.pathname)
      push('/')
      return
    }

    auth.getIdTokenResult().then((res) => {
      if (asPath.includes('/admin')) {
        if (res.claims === undefined || res.claims.role !== 'admin') {
          push('/poll')
        }
      } else {
        if (res.claims.role === 'admin') {
          push('/admin')
        }
      }
    })
  }, [auth])

  return (
    <>
      {auth === undefined || auth === null ? (
        <CenterSpinner />
      ) : (
        <>{children}</>
      )}
    </>
  )
}
