'use client'

import classNames from 'classnames'
import { Copy, Ellipsis, EyeOff, Hash, MessagesSquare, Pencil, Pin, Reply, SmilePlus, Trash } from 'lucide-react'
import { CURRENT_USER_ID, QUICK_REACTIONS } from '../../constants'
import { emojiName } from '../../constants/emojis'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import type { Message } from '../../models'
import {
  createThread,
  deleteMessage,
  markUnread,
  openModal,
  setEditing,
  setOpenThread,
  setReplyTo,
  togglePin,
  toggleReaction,
} from '../../store'
import { selectCustomExpressions } from '../../store/selectors'
import EmojiPicker from '../EmojiPicker'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import Tooltip from '../Tooltip'
import styles from './Message.module.sass'

export const useMessageActions = (message: Message) => {
  const dispatch = useAppDispatch()
  const { channelId, id: messageId } = message
  // Threads can be started from server channel messages (not DMs or other threads)
  const threadServerId = useSelector(s => {
    if (s.threads[channelId]) return null
    return s.servers.order.find(id => s.servers.byId[id].channels.some(c => c.id === channelId)) ?? null
  })
  return {
    canThread: threadServerId !== null,
    thread: () => {
      if (message.threadId) return dispatch(setOpenThread(message.threadId))
      if (!threadServerId) return
      const text = message.content.replace(/[*_~`|>#]/g, '').trim()
      const action = dispatch(
        createThread({
          name: text ? text.slice(0, 48) + (text.length > 48 ? '…' : '') : 'New Thread',
          serverId: threadServerId,
          parentChannelId: channelId,
          parentMessageId: messageId,
          ownerId: CURRENT_USER_ID,
        })
      )
      dispatch(setOpenThread(action.payload.id))
    },
    react: (emoji: string) =>
      dispatch(toggleReaction({ channelId, messageId, emoji, userId: CURRENT_USER_ID })),
    reply: () => {
      dispatch(setReplyTo({ channelId, messageId }))
      document.querySelector<HTMLTextAreaElement>('textarea')?.focus()
    },
    edit: () => dispatch(setEditing({ channelId, messageId })),
    pin: () => dispatch(togglePin({ channelId, messageId })),
    markUnread: () => dispatch(markUnread({ channelId, before: message.createdAt })),
    remove: (skipConfirm = false) =>
      skipConfirm
        ? dispatch(deleteMessage({ channelId, messageId }))
        : dispatch(openModal({ type: 'deleteMessage', channelId, messageId })),
  }
}

export const MessageMenu = ({ message, onDone }: { message: Message; onDone: () => void }) => {
  const actions = useMessageActions(message)
  const own = message.authorId === CURRENT_USER_ID
  const run = (fn: (e: React.MouseEvent) => void) => (e: React.MouseEvent) => {
    onDone()
    fn(e)
  }
  return (
    <Menu>
      <div className={styles.menuReactions}>
        {QUICK_REACTIONS.slice(0, 4).map(emoji => (
          <button key={emoji} type="button" onClick={run(() => actions.react(emoji))} aria-label={emojiName(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
      <MenuSeparator />
      {own && <MenuItem label="Edit Message" icon={<Pencil size={16} />} onClick={run(() => actions.edit())} />}
      <MenuItem label="Reply" icon={<Reply size={16} />} onClick={run(() => actions.reply())} />
      {actions.canThread && (
        <MenuItem
          label={message.threadId ? 'Open Thread' : 'Create Thread'}
          icon={<MessagesSquare size={16} />}
          onClick={run(() => actions.thread())}
        />
      )}
      <MenuItem
        label={message.pinned ? 'Unpin Message' : 'Pin Message'}
        icon={<Pin size={16} />}
        onClick={run(() => actions.pin())}
      />
      <MenuItem
        label="Copy Text"
        icon={<Copy size={16} />}
        onClick={run(() => navigator.clipboard?.writeText(message.content))}
      />
      {!own && <MenuItem label="Mark Unread" icon={<EyeOff size={16} />} onClick={run(() => actions.markUnread())} />}
      <MenuSeparator />
      <MenuItem
        label="Copy Message ID"
        icon={<Hash size={16} />}
        onClick={run(() => navigator.clipboard?.writeText(message.id))}
      />
      {own && (
        <MenuItem danger label="Delete Message" icon={<Trash size={16} />} onClick={run(e => actions.remove(e.shiftKey))} />
      )}
    </Menu>
  )
}

export const MessageToolbar = ({ message }: { message: Message }) => {
  const actions = useMessageActions(message)
  const picker = usePopover()
  const more = usePopover()
  const customGroups = useSelector(s => selectCustomExpressions(s))
  const own = message.authorId === CURRENT_USER_ID

  return (
    <div className={classNames(styles.toolbar, (picker.anchor || more.anchor) && styles.toolbarOpen)}>
      {QUICK_REACTIONS.slice(0, 3).map(emoji => (
        <Tooltip key={emoji} label={`:${emojiName(emoji)}:`}>
          <button type="button" className={styles.toolbarButton} onClick={() => actions.react(emoji)}>
            <span className={styles.toolbarEmoji}>{emoji}</span>
          </button>
        </Tooltip>
      ))}
      <span className={styles.toolbarDivider} />
      <Tooltip label="Add Reaction">
        <button type="button" className={styles.toolbarButton} aria-label="Add Reaction" {...picker.triggerProps}>
          <SmilePlus size={20} />
        </button>
      </Tooltip>
      {own ? (
        <Tooltip label="Edit">
          <button type="button" className={styles.toolbarButton} aria-label="Edit" onClick={actions.edit}>
            <Pencil size={18} />
          </button>
        </Tooltip>
      ) : (
        <Tooltip label="Reply">
          <button type="button" className={styles.toolbarButton} aria-label="Reply" onClick={actions.reply}>
            <Reply size={20} />
          </button>
        </Tooltip>
      )}
      {actions.canThread && (
        <Tooltip label={message.threadId ? 'Open Thread' : 'Create Thread'}>
          <button type="button" className={styles.toolbarButton} aria-label="Create Thread" onClick={actions.thread}>
            <MessagesSquare size={19} />
          </button>
        </Tooltip>
      )}
      <Tooltip label="More">
        <button type="button" className={styles.toolbarButton} aria-label="More" {...more.triggerProps}>
          <Ellipsis size={20} />
        </button>
      </Tooltip>

      {picker.anchor && (
        <Popover anchor={picker.anchor} placement="left-start" onClose={picker.close}>
          <EmojiPicker
            custom={customGroups}
            onSelect={emoji => {
              actions.react(emoji)
              picker.close()
            }}
          />
        </Popover>
      )}
      {more.anchor && (
        <Popover anchor={more.anchor} placement="left-start" onClose={more.close}>
          <MessageMenu message={message} onDone={more.close} />
        </Popover>
      )}
    </div>
  )
}
