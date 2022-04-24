import Link from 'next/link'
import clsx from 'clsx'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { IdTokenResult } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'
import logoutIcon from '@iconify/icons-heroicons-outline/logout'
import Logo from './icon/Logo'
import { useStoreon } from '~/context/storeon'
import { getAuthInstance } from '~/core/services/firebase/getAuthInstance'

interface HeaderProps {
  className?: string
}

export const Header: FunctionComponent<HeaderProps> = ({ className }) => {
  const { push } = useRouter()
  const {
    dispatch,
    user: { auth },
  } = useStoreon('user', 'next')

  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>()

  useEffect(() => {
    auth?.getIdTokenResult().then((result) => {
      setIdTokenResult(result)
    })
  }, [auth])

  const handleSignOut = useCallback(async () => {
    signOut(getAuthInstance())
    dispatch('user/auth', null)
    dispatch('next/unset')
    push('/')
  }, [])

  return (
    <>
      <div className="sticky top-0 z-40 w-full flex-none bg-white duration-500 dark:border-slate-50/[0.06] lg:z-50 lg:border-b lg:border-slate-900/10">
        <div className={clsx('max-w-8xl mx-auto', className)}>
          <div className="border-b border-slate-900/10 py-4 px-4 dark:border-slate-300/10 lg:border-0 lg:px-8">
            <div className="relative flex items-center">
              <Link
                href={
                  idTokenResult?.claims.role === 'admin' ? '/admin' : '/poll'
                }
              >
                <a className="mr-3 flex-none overflow-hidden md:w-auto">
                  <span className="sr-only">I Voter Home Page</span>
                  <Logo className="h-9 w-auto text-green-500" />
                </a>
              </Link>
              <div className="relative ml-auto flex items-center">
                <nav className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                  <ul className="flex space-x-8">
                    {/* <HeaderNavItems items={Item} /> */}
                    {auth && (
                      <>
                        <li className="hidden lg:block">
                          <span
                            onClick={handleSignOut}
                            className="cursor-pointer hover:text-green-500 dark:hover:text-green-400"
                          >
                            Sign out
                          </span>
                        </li>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 lg:hidden"
                        >
                          <span className="sr-only">Navigation</span>
                          <Icon icon={logoutIcon} className="text-xl" />
                        </button>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
