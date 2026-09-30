'use client'

import classNames from 'classnames'
import { CheckCheck, ChevronDown, CirclePlus, Copy, LogOut, Settings, UserPlus, X } from 'lucide-react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, usePopover } from '../../hooks'
import VerifiedIcon from '../../icons/Verified'
import type { Server } from '../../models'
import { markRead, openModal } from '../../store'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import styles from './ChannelSidebar.module.sass'

const ServerHeader = ({ server }: { server: Server }) => {
  const dispatch = useAppDispatch()
  const { anchor, close, triggerProps } = usePopover()
  const isOwner = server.ownerId === CURRENT_USER_ID

  const run = (action: () => void) => () => {
    close()
    action()
  }

  return (
    <>
      <button
        type="button"
        className={classNames(styles.header, anchor && styles.headerOpen)}
        {...triggerProps}
      >
        {server.verified && (
          <span className={styles.verified} aria-label="Verified">
            <VerifiedIcon />
          </span>
        )}
        <span className={styles.headerName}>{server.name}</span>
        {anchor ? <X size={18} /> : <ChevronDown size={18} />}
      </button>
      {anchor && (
        <Popover anchor={anchor} placement="bottom-center" offset={4} onClose={close}>
          <Menu className={styles.serverMenu}>
            <MenuItem
              brand
              label="Invite People"
              icon={<UserPlus size={18} />}
              onClick={run(() => dispatch(openModal({ type: 'invite', serverId: server.id })))}
            />
            {isOwner && (
              <MenuItem
                label="Server Settings"
                icon={<Settings size={18} />}
                onClick={run(() => dispatch(openModal({ type: 'serverSettings', serverId: server.id })))}
              />
            )}
            <MenuItem
              label="Create Channel"
              icon={<CirclePlus size={18} />}
              onClick={run(() =>
                dispatch(openModal({ type: 'createChannel', serverId: server.id, categoryId: null }))
              )}
            />
            <MenuItem
              label="Mark As Read"
              icon={<CheckCheck size={18} />}
              onClick={run(() => server.channels.forEach(c => dispatch(markRead(c.id))))}
            />
            <MenuSeparator />
            <MenuItem
              label="Copy Server ID"
              icon={<Copy size={18} />}
              onClick={run(() => navigator.clipboard?.writeText(server.id))}
            />
            {!isOwner && (
              <>
                <MenuSeparator />
                <MenuItem
                  danger
                  label="Leave Server"
                  icon={<LogOut size={18} />}
                  onClick={run(() => dispatch(openModal({ type: 'leaveServer', serverId: server.id })))}
                />
              </>
            )}
          </Menu>
        </Popover>
      )}
    </>
  )
}

export default ServerHeader
