import Link from 'next/link'
import clsx from 'clsx'
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import type { IdTokenResult } from 'firebase/auth'
import type { LinkItem } from './headerNavItems'
import { HeaderNavItems, LinkItemType } from './headerNavItems'
import Logo from './icon/Logo'
import { useStoreon } from '~/context/storeon'

const Item: LinkItem[] = [
  {
    type: LinkItemType.INTERNAL,
    href: '/docs/installation',
    label: 'Docs',
  },
  {
    type: LinkItemType.EXTERNAL,
    href: 'https://tailwindui.com',
    label: 'Components',
  },
  {
    type: LinkItemType.INTERNAL,
    href: '/blog',
    label: 'Blog',
  },
]

interface HeaderProps {
  hasNav?: boolean
  navIsOpen?: boolean
  onNavToggle?: (v: boolean) => void
  className?: string
}

export const Header: FunctionComponent<HeaderProps> = ({
  hasNav = false,
  navIsOpen,
  onNavToggle,
  className,
}) => {
  const {
    user: { auth },
  } = useStoreon('user')

  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>()

  useEffect(() => {
    auth?.getIdTokenResult().then((result) => {
      setIdTokenResult(result)
    })
  }, [auth])

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
              <div className="relative ml-auto hidden items-center lg:flex">
                <nav className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                  <ul className="flex space-x-8">
                    <HeaderNavItems items={Item} />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          {hasNav && (
            <div className="flex items-center border-b border-slate-900/10 p-4 dark:border-slate-50/[0.06] lg:hidden">
              <button
                type="button"
                onClick={() => onNavToggle?.(!navIsOpen)}
                className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <span className="sr-only">Navigation</span>
                <svg width="24" height="24">
                  <path
                    d="M5 6h14M5 12h14M5 18h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
