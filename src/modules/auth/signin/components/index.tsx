import type { FormEventHandler, FunctionComponent } from 'react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { XCircleIcon } from '@heroicons/react/solid'

import { Icon } from '@iconify/react'
import MailOutlineIcon from '@iconify/icons-heroicons-outline/mail'
import LockCloseOutlineIcon from '@iconify/icons-heroicons-outline/lock-closed'
// import ExclamationCircleOutlineIcon from '@iconify/icons-heroicons-outline/exclamation-circle'
import { useRouter } from 'next/router'
import { useStoreon } from '../../../../context/storeon'
import { getAuthInstance } from '~/core/services/firebase/getAuthInstance'

export const SigninModule: FunctionComponent = () => {
  const { push } = useRouter()
  const {
    dispatch,
    user: { auth },
  } = useStoreon('user')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [isOperation, setIsOperation] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()

      setIsOperation(true)
      setError(null)

      const email = emailRef.current?.value || ''
      const password = passwordRef.current?.value || ''

      try {
        const a = await signInWithEmailAndPassword(
          getAuthInstance(),
          email,
          password
        )
        a.user.getIdTokenResult().then((res) => {
          if (res.claims.role === 'admin') {
            push('/admin')
          } else {
            push('/poll')
          }
        })
      } catch (e) {
        const { message } = e as any
        setError(message)
        setIsOperation(false)
      }
    },
    [emailRef, passwordRef]
  )

  useEffect(() => {}, [auth])

  return (
    <Fragment>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with provided credentials
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {error !== null && (
          <div className="mb-6 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={onSubmit} className="mx-auto max-w-screen-sm">
          <div className="mx-auto max-w-sm">
            <div className="relative my-5">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Icon
                icon={MailOutlineIcon}
                inline={true}
                className="absolute inset-0 mx-4 h-full w-5"
              />
              <input
                type="text"
                inputMode="email"
                name="email"
                id="email"
                ref={emailRef}
                disabled={isOperation}
                className="w-full rounded-full bg-gray-50 py-2 px-4 pl-12 text-gray-900 shadow-sm ring-1 ring-gray-100 focus:shadow-md focus:outline-none"
              />
            </div>
            <div className="relative my-5">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Icon
                icon={LockCloseOutlineIcon}
                inline={true}
                className="absolute inset-0 mx-4 h-full w-5"
              />
              <input
                type="password"
                name="password"
                id="password"
                ref={passwordRef}
                disabled={isOperation}
                className="w-full rounded-full bg-gray-50 py-2 px-4 pl-12 text-gray-900 shadow-sm ring-1 ring-gray-100 focus:shadow-md focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-green-500 py-2 text-white shadow-sm hover:bg-green-400 hover:shadow-md"
            >
              Login
            </button>
            {auth && (
              <button
                type="button"
                onClick={async () => {
                  await signOut(getAuthInstance())
                  dispatch('user/auth', null)
                }}
                className="mt-5 w-full rounded-full bg-red-500 py-2 text-white shadow-sm hover:bg-red-400 hover:shadow-md"
              >
                Sign out
              </button>
            )}
          </div>
        </form>
      </div>
    </Fragment>
  )
}
