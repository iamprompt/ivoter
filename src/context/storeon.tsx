import type { FunctionComponent, ReactNode } from 'react'
import { createContext } from 'react'

import { createStoreon } from 'storeon'
import { customContext } from 'storeon/react'
import type { NextEvent, NextStore } from './store/next'
import { next } from './store/next'

import type { UserEvent, UserStore } from './store/user'
import { user } from './store/user'

export const store = createStoreon<
  UserStore & NextStore,
  UserEvent & NextEvent
>([user, next])

const StoreonContext = createContext(store)

export const useStoreon = customContext(StoreonContext)

export const Context: FunctionComponent<{ children: ReactNode }> = (props) => {
  const { children } = props

  return (
    <StoreonContext.Provider value={store}>{children}</StoreonContext.Provider>
  )
}
