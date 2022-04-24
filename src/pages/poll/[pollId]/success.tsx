import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
// import { useStoreon } from '~/context/storeon'
import { getAuthInstance } from '~/core/services/firebase/getAuthInstance'

const PollList: NextPage = () => {
  const { push } = useRouter()
  // const { dispatch } = useStoreon('user')

  const handleSignOut = () => {
    signOut(getAuthInstance())
    // dispatch('user/auth', null)
    push('/')
  }

  useEffect(() => {
    setTimeout(handleSignOut, 5000)
  })

  return (
    <>
      <div className="pb-3 text-center">
        <h1 className="text-4xl font-bold">Your vote is counted!!</h1>
      </div>
      <div className="mt-5 text-center">
        <button
          onClick={handleSignOut}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Sign out
        </button>
      </div>
    </>
  )
}

export default PollList
