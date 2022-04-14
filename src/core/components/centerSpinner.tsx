import type { FunctionComponent } from 'react'
import { memo } from 'react'

import { Spinner } from './spinner'

export const CenterSpinner: FunctionComponent = memo(() => (
  <div className="absolute inset-0 z-[99] flex min-h-screen items-center justify-center bg-gray-50">
    <Spinner />
  </div>
))
