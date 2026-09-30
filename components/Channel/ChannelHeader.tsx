'use client'

import classNames from 'classnames'
import { AtSign, Bell, CircleHelp, Inbox, Phone, Pin, Search, Users, Video, X } from 'lucide-react'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import { setSearch, toggleMemberList } from '../../store'
import type { ChannelContext } from '../../store/selectors'
import Avatar from '../Avatar'
import ChannelTypeIcon from '../ChannelTypeIcon'
import MobileNavButton from '../MobileNavButton'
import Popover from '../Popover'
import Tooltip from '../Tooltip'
import { useMedia } from '../Voice'
import PinnedMessages from './PinnedMessages'
import { ME } from '../../lib/routes'
import styles from './Channel.module.sass'

const IconButton = ({
  label,
  active,
  children,
  ...props
}: { label: string; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Tooltip label={label} placement="bottom">
    <button
      type="button"
      aria-label={label}
      className={classNames(styles.headerButton, active && styles.headerButtonActive)}
      {...props}
    >
      {children}
    </button>
  </Tooltip>
)

const ChannelHeader = ({ channelId, context }: { channelId: string; context: ChannelContext }) => {
  const dispatch = useAppDispatch()
  const memberListOpen = useSelector(s => s.prefs.memberListOpen)
  const search = useSelector(s => s.ui.search)
  const pins = usePopover()
  const media = useMedia()
  const inCall = useSelector(s => s.ui.voice?.channelId === channelId)
  const startCall = async (video: boolean) => {
    if (!inCall) media.join(ME, channelId)
    if (video && !media.camera) await media.toggleCamera()
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <MobileNavButton />
        {context.kind === 'server' ? (
          <>
            <ChannelTypeIcon type={context.channel.type} size={24} className={styles.headerIcon} />
            <h1 className={styles.headerName}>{context.channel.name}</h1>
            {context.channel.topic && (
              <>
                <span className={styles.headerDivider} />
                <span className={styles.headerTopic} title={context.channel.topic}>
                  {context.channel.topic}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <AtSign size={24} className={styles.headerIcon} />
            <Avatar user={context.recipient} size={24} status={context.recipient.status} ringColor="var(--bg-primary)" />
            <h1 className={styles.headerName}>{context.recipient.displayName}</h1>
          </>
        )}
      </div>

      <div className={styles.headerTools}>
        {context.kind === 'dm' ? (
          <>
            <IconButton label="Start Voice Call" active={inCall} onClick={() => startCall(false)}>
              <Phone size={20} />
            </IconButton>
            <IconButton label="Start Video Call" active={inCall && !!media.camera} onClick={() => startCall(true)}>
              <Video size={22} />
            </IconButton>
          </>
        ) : (
          <IconButton label="Notification Settings">
            <Bell size={20} />
          </IconButton>
        )}
        <IconButton label="Pinned Messages" active={!!pins.anchor} {...pins.triggerProps}>
          <Pin size={20} />
        </IconButton>
        {context.kind === 'server' && (
          <IconButton
            label={memberListOpen ? 'Hide Member List' : 'Show Member List'}
            active={memberListOpen}
            onClick={() => dispatch(toggleMemberList())}
          >
            <Users size={20} />
          </IconButton>
        )}

        <label className={classNames(styles.search, search && styles.searchFilled)}>
          <input
            value={search}
            placeholder="Search"
            aria-label="Search messages"
            onChange={e => dispatch(setSearch(e.target.value))}
            onKeyDown={e => e.key === 'Escape' && dispatch(setSearch(''))}
          />
          {search ? (
            <button type="button" aria-label="Clear search" onClick={() => dispatch(setSearch(''))}>
              <X size={16} />
            </button>
          ) : (
            <Search size={16} />
          )}
        </label>

        <IconButton label="Inbox">
          <Inbox size={20} />
        </IconButton>
        <IconButton label="Help">
          <CircleHelp size={20} />
        </IconButton>
      </div>

      {pins.anchor && (
        <Popover anchor={pins.anchor} placement="bottom-end" onClose={pins.close}>
          <PinnedMessages channelId={channelId} context={context} onJump={pins.close} />
        </Popover>
      )}
    </header>
  )
}

export default ChannelHeader
