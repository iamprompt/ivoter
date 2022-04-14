import { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { getAuthInstance } from './firebase/getAuthInstance'
import { useStoreon } from '~/context/storeon'

export const useAuth = () => {
  const { dispatch } = useStoreon('user')

  useEffect(() => {
    const listener = onAuthStateChanged(getAuthInstance(), (res) => {
      dispatch('user/auth', res)
    })

    return () => listener()
  }, [])
}
