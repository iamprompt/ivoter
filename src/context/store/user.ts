import type { User } from 'firebase/auth'
import type { StoreonModule } from 'storeon'

export interface UserStore {
  user: {
    auth: User | null | undefined
  }
}

export interface UserEvent {
  'user/auth': User | null | undefined
}

export const user: StoreonModule<UserStore, UserEvent> = (store) => {
  store.on('@init', () => ({
    user: {
      auth: undefined,
    },
  }))

  store.on('user/auth', (store, event) => ({
    user: {
      ...store.user,
      auth: event,
    },
  }))
}
