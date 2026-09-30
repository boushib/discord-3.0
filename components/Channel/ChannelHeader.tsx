'use client'

import classNames from 'classnames'
import { AtSign, Bell, BellOff, CircleHelp, Inbox as InboxIcon, MessagesSquare, Phone, Pin, Search, Users, Video, X } from 'lucide-react'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import { openModal, setOpenThread, setSearch, toggleMemberList } from '../../store'
import { selectChannelThreads, selectRecentMentions } from '../../store/selectors'
import type { ChannelContext } from '../../store/selectors'
import Avatar from '../Avatar'
import ChannelTypeIcon from '../ChannelTypeIcon'
import MobileNavButton from '../MobileNavButton'
import Popover, { Menu, MenuItem } from '../Popover'
import Tooltip from '../Tooltip'
import { useMedia } from '../Voice'
import Inbox from './Inbox'
import NotificationMenu from './NotificationMenu'
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
  const bell = usePopover()
  const threadsMenu = usePopover()
  const threads = useSelector(s => selectChannelThreads(s, channelId))
  const inbox = usePopover()
  const muted = useSelector(s => s.prefs.mutedChannels.includes(channelId))
  const hasMentions = useSelector(s => selectRecentMentions(s).length > 0)
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
          <>
            <IconButton label="Threads" active={!!threadsMenu.anchor} {...threadsMenu.triggerProps}>
              <MessagesSquare size={20} />
            </IconButton>
            <IconButton label="Notification Settings" active={!!bell.anchor} {...bell.triggerProps}>
              {muted ? <BellOff size={20} /> : <Bell size={20} />}
            </IconButton>
          </>
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

        <IconButton label="Inbox" active={!!inbox.anchor} {...inbox.triggerProps}>
          <span className={styles.inboxIcon}>
            <InboxIcon size={20} />
            {hasMentions && <span className={styles.inboxDot} />}
          </span>
        </IconButton>
        <IconButton label="Keyboard Shortcuts" onClick={() => dispatch(openModal({ type: 'shortcuts' }))}>
          <CircleHelp size={20} />
        </IconButton>
      </div>

      {threadsMenu.anchor && (
        <Popover anchor={threadsMenu.anchor} placement="bottom-end" onClose={threadsMenu.close}>
          <Menu className={styles.threadsMenu}>
            {threads.length ? (
              threads.map(t => (
                <MenuItem
                  key={t.id}
                  label={t.name}
                  icon={<MessagesSquare size={16} />}
                  onClick={() => {
                    threadsMenu.close()
                    dispatch(setOpenThread(t.id))
                  }}
                />
              ))
            ) : (
              <p className={styles.threadsEmpty}>
                No threads yet. Hover a message and click the thread icon to start one.
              </p>
            )}
          </Menu>
        </Popover>
      )}
      {bell.anchor && (
        <Popover anchor={bell.anchor} placement="bottom-end" onClose={bell.close}>
          <NotificationMenu channelId={channelId} onDone={bell.close} />
        </Popover>
      )}
      {inbox.anchor && (
        <Popover anchor={inbox.anchor} placement="bottom-end" onClose={inbox.close}>
          <Inbox onClose={inbox.close} />
        </Popover>
      )}
      {pins.anchor && (
        <Popover anchor={pins.anchor} placement="bottom-end" onClose={pins.close}>
          <PinnedMessages channelId={channelId} context={context} onJump={pins.close} />
        </Popover>
      )}
    </header>
  )
}

export default ChannelHeader
