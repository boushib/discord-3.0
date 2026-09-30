'use client'

import { usePopover } from '../../hooks'
import type { Server } from '../../models'
import Popover, { type Placement } from '../Popover'
import ProfileCard from './ProfileCard'

interface Props {
  userId: string
  server?: Server
  placement?: Placement
  className?: string
  children: React.ReactNode
}

/** Wraps a name or avatar so clicking it opens the user's profile card */
const ProfileTrigger = ({ userId, server, placement = 'right-start', className, children }: Props) => {
  const { anchor, close, triggerProps } = usePopover()
  return (
    <>
      <span role="button" tabIndex={0} className={className} {...triggerProps}>
        {children}
      </span>
      {anchor && (
        <Popover anchor={anchor} placement={placement} onClose={close}>
          <ProfileCard userId={userId} server={server} onClose={close} />
        </Popover>
      )}
    </>
  )
}

export default ProfileTrigger
