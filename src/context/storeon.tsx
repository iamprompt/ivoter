import type { FunctionComponent } from 'react'
import { createContext } from 'react'

import { createStoreon } from 'storeon'
import { customContext } from 'storeon/react'

import type { UserEvent, UserStore } from './store/user'
import { user } from './store/user'

export const store = createStoreon<UserStore, UserEvent>([user])

const StoreonContext = createContext(store)

export const useStoreon = customContext(StoreonContext)

export const Context: FunctionComponent = (props) => {
  const { children } = props

  return (
    <StoreonContext.Provider value={store}>{children}</StoreonContext.Provider>
  )
}
