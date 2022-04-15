import { useRouter } from 'next/router'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import { useStoreon } from '../../context/storeon'

import { CenterSpinner } from '../../core/components/centerSpinner'

export const AuthWrapper: FunctionComponent = (props) => {
  const { push } = useRouter()
  const {
    dispatch,
    user: { auth },
  } = useStoreon('user', 'next')

  useEffect(() => {
    if (!auth) {
      dispatch('next/set', window.location.pathname)
      push('/')
    }
  }, [auth])

  return (
    <>
      {auth === undefined || auth === null ? (
        <CenterSpinner />
      ) : (
        <>{props.children}</>
      )}
    </>
  )
}
