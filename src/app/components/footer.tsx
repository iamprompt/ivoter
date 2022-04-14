import clsx from 'clsx'
import type { FunctionComponent } from 'react'
import MUICTLogo from './icon/MUICT'
import NAKAMALogo from './icon/NAKAMA'

interface Props {
  className?: string
}

export const Footer: FunctionComponent<Props> = ({
  className = 'flex-col-reverse mt-8 mb-5',
}) => {
  return (
    <footer
      className={clsx(
        'container mx-auto flex max-w-screen-xl items-center gap-5 text-stone-700',
        className
      )}
    >
      <div>
        <span>© 2022 NAKAMA</span>
      </div>
      <div className="flex h-10 items-center gap-8">
        <MUICTLogo />
        <NAKAMALogo />
      </div>
    </footer>
  )
}
