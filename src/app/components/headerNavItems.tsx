import Link from 'next/link'
import type { FunctionComponent } from 'react'

export enum LinkItemType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export interface LinkItem {
  type: LinkItemType
  href: string
  label: string
}

export const HeaderNavItems: FunctionComponent<{ items: LinkItem[] }> = ({
  items,
}) => {
  return (
    <>
      {items.map((item) => {
        return item.type === LinkItemType.INTERNAL ? (
          <li key={item.label}>
            <Link href={item.href}>
              <a className="hover:text-green-500 dark:hover:text-green-400">
                {item.label}
              </a>
            </Link>
          </li>
        ) : (
          <li key={item.label}>
            <a
              href={item.href}
              className="hover:text-green-500 dark:hover:text-green-400"
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </>
  )
}
