import type { UrlObject } from 'url'
import type { StoreonModule } from 'storeon'

export interface NextStore {
  next: {
    path: UrlObject | string | undefined
  }
}

export interface NextEvent {
  'next/set': undefined | UrlObject | string
  'next/unset': void
}

export const next: StoreonModule<NextStore, NextEvent> = (store) => {
  store.on('@init', () => ({
    next: {
      path: undefined,
    },
  }))

  store.on('next/set', (store, event) => ({
    next: {
      ...store.next,
      path: event,
    },
  }))

  store.on('next/unset', (store) => ({
    next: {
      ...store.next,
      path: undefined,
    },
  }))
}
