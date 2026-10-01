'use client'

import classNames from 'classnames'
import { ChartBar, CirclePlus, FileText, Trash, Upload, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { replaceShortcodes, searchEmojis } from '../../constants/emojis'
import { gifUrl, type Gif } from '../../constants/expressions'
import { parseCustomEmojiToken, replaceCustomShortcodes } from '../../lib/customEmoji'
import { useAppDispatch, useFileUploads, usePopover, useSelector } from '../../hooks'
import EmojiIcon from '../../icons/Emoji'
import GIFIcon from '../../icons/GIF'
import GiftIcon from '../../icons/Gift'
import StickerIcon from '../../icons/Sticker'
import { clearUploads, openModal, removeUpload, sendMessage, setEditing, setReplyTo } from '../../store'
import { simulateReply } from '../../store/simulate'
import { ChannelContext, displayNameIn, selectCustomExpressions, selectMessages } from '../../store/selectors'
import Avatar from '../Avatar'
import ExpressionPicker, { type ExpressionTab } from '../ExpressionPicker'
import Popover, { Menu, MenuItem } from '../Popover'
import Tooltip from '../Tooltip'
import TypingIndicator from './TypingIndicator'
import styles from './MessageBox.module.sass'

const MAX_LENGTH = 2000

const SLASH_COMMANDS: Record<string, (arg: string) => string> = {
  shrug: arg => `${arg} ¯\\\\\\_(ツ)\\_/¯`.trim(),
  tableflip: arg => `${arg} (╯°□°)╯︵ ┻━┻`.trim(),
  unflip: arg => `${arg} ┬─┬ノ( º _ ºノ)`.trim(),
  me: arg => `_${arg}_`,
  spoiler: arg => `||${arg}||`,
}

const applyCommands = (text: string) => {
  const match = /^\/(\w+)\s*([\s\S]*)$/.exec(text)
  const command = match && SLASH_COMMANDS[match[1]]
  return command ? command(match[2]) : text
}

type Suggestion =
  | { kind: 'user'; id: string; label: string; sub: string; insert: string }
  | { kind: 'emoji'; id: string; label: string; sub: string; insert: string; image?: string }
  | { kind: 'command'; id: string; label: string; sub: string; insert: string }

interface Props {
  channelId: string
  context: ChannelContext
}

const MessageBox = ({ channelId, context }: Props) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState('')
  const [caret, setCaret] = useState(0)
  const [selected, setSelected] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const expressions = usePopover()
  const plusMenu = usePopover()
  const [expressionTab, setExpressionTab] = useState<ExpressionTab>('emoji')
  const upload = useFileUploads(channelId)
  const uploads = useSelector(s => s.ui.uploads[channelId])

  const users = useSelector(s => s.users.byId)
  const replyToId = useSelector(s => s.ui.replyTo[channelId])
  const replyTo = useSelector(s => selectMessages(s, channelId).find(m => m.id === replyToId))
  const lastOwnMessage = useSelector(s =>
    selectMessages(s, channelId).findLast(m => m.authorId === CURRENT_USER_ID)
  )
  const blocked = useSelector(
    s =>
      context.kind === 'dm' &&
      s.users.relationships.some(r => r.userId === context.recipient.id && r.type === 'blocked')
  )

  const server = context.kind === 'server' ? context.server : undefined
  const customGroups = useSelector(s => selectCustomExpressions(s, server?.id))
  const customEmojis = useMemo(() => customGroups.flatMap(g => g.emojis), [customGroups])
  const placeholder =
    context.kind === 'server'
      ? `Message #${context.channel.name}`
      : context.kind === 'dm'
        ? `Message @${context.recipient.displayName}`
        : `Message ${context.name}`

  const memberIds = useMemo(
    () =>
      server
        ? server.members.map(m => m.userId)
        : context.kind === 'dm'
          ? [context.recipient.id, CURRENT_USER_ID]
          : context.kind === 'group'
            ? [...context.group.memberIds, CURRENT_USER_ID]
            : [],
    [server, context]
  )

  // Autocomplete for @mentions, :emoji: and /commands based on the text before the caret
  const suggestions = useMemo((): Suggestion[] => {
    const before = value.slice(0, caret)
    const mention = /(?:^|\s)@([\w.]*)$/.exec(before)
    if (mention) {
      const q = mention[1].toLowerCase()
      return memberIds
        .map(id => users[id])
        .filter(u => u && (u.username.toLowerCase().startsWith(q) || u.displayName.toLowerCase().startsWith(q)))
        .slice(0, 8)
        .map(u => ({
          kind: 'user',
          id: u.id,
          label: displayNameIn(server, u),
          sub: u.username,
          insert: `@${u.username} `,
        }))
    }
    const emojiMatch = /(?:^|\s):([a-z0-9_+-]{2,})$/.exec(before)
    if (emojiMatch) {
      const q = emojiMatch[1]
      const custom: Suggestion[] = customEmojis
        .filter(e => e.name.includes(q))
        .map(e => ({ kind: 'emoji', id: e.id, label: '', image: e.url, sub: `:${e.name}:`, insert: `:${e.name}: ` }))
      const unicode: Suggestion[] = searchEmojis(q).map(e => ({
        kind: 'emoji',
        id: e.char,
        label: e.char,
        sub: `:${e.name.split(',')[0]}:`,
        insert: `${e.char} `,
      }))
      return [...custom, ...unicode].slice(0, 8)
    }
    const command = /^\/(\w*)$/.exec(before)
    if (command) {
      return Object.keys(SLASH_COMMANDS)
        .filter(name => name.startsWith(command[1]))
        .map(name => ({ kind: 'command', id: name, label: `/${name}`, sub: SLASH_COMMANDS[name]('message'), insert: `/${name} ` }))
    }
    return []
  }, [value, caret, memberIds, users, server, customEmojis])

  const showSuggestions = suggestions.length > 0 && !dismissed
  const active = Math.min(selected, suggestions.length - 1)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 50 * 22)}px`
  }

  const update = (next: string, nextCaret: number) => {
    setValue(next)
    setCaret(nextCaret)
    setSelected(0)
    setDismissed(false)
    requestAnimationFrame(resize)
  }

  const insertSuggestion = (s: Suggestion) => {
    const before = value.slice(0, caret)
    const start = s.kind === 'command' ? 0 : before.search(s.kind === 'user' ? /@[\w.]*$/ : /:[a-z0-9_+-]*$/)
    const next = value.slice(0, start) + s.insert + value.slice(caret)
    const nextCaret = start + s.insert.length
    update(next, nextCaret)
    requestAnimationFrame(() => textareaRef.current?.setSelectionRange(nextCaret, nextCaret))
  }

  const insertAtCaret = (text: string) => {
    const next = value.slice(0, caret) + text + value.slice(caret)
    update(next, caret + text.length)
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(caret + text.length, caret + text.length)
    })
  }

  /** GIF/sticker/emoji buttons share one picker; switching buttons switches tabs */
  const pickerButton = (tab: ExpressionTab) => ({
    'aria-expanded': expressions.anchor !== null && expressionTab === tab,
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      if (expressions.anchor && expressionTab === tab) return expressions.close()
      setExpressionTab(tab)
      expressions.openAt(e.currentTarget.closest('[data-composer]') ?? e.currentTarget)
    },
  })

  const sendRich = (extra: { content?: string; sticker?: { id: string; name: string; emoji?: string; url?: string } }) => {
    expressions.close()
    const action = dispatch(
      sendMessage({
        channelId,
        authorId: CURRENT_USER_ID,
        content: extra.content ?? '',
        replyToId: replyTo?.id,
        sticker: extra.sticker,
      })
    )
    dispatch(setReplyTo({ channelId, messageId: null }))
    dispatch(simulateReply(channelId, action.payload.id, extra.content ?? ''))
  }

  const submit = () => {
    const content = replaceShortcodes(replaceCustomShortcodes(applyCommands(value.trim()), customEmojis))
    if ((!content && !uploads?.length) || content.length > MAX_LENGTH) return
    const action = dispatch(
      sendMessage({
        channelId,
        authorId: CURRENT_USER_ID,
        content,
        replyToId: replyTo?.id,
        attachments: uploads?.length ? uploads : undefined,
      })
    )
    dispatch(setReplyTo({ channelId, messageId: null }))
    dispatch(clearUploads(channelId))
    dispatch(simulateReply(channelId, action.payload.id, content))
    update('', 0)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const delta = e.key === 'ArrowDown' ? 1 : -1
        setSelected((active + delta + suggestions.length) % suggestions.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        insertSuggestion(suggestions[active])
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setDismissed(true)
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape' && replyTo) {
      dispatch(setReplyTo({ channelId, messageId: null }))
    } else if (e.key === 'ArrowUp' && !value && lastOwnMessage) {
      e.preventDefault()
      dispatch(setEditing({ channelId, messageId: lastOwnMessage.id }))
    }
  }

  if (blocked) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.blocked}>You cannot send messages to a user you have blocked.</div>
      </div>
    )
  }

  const replyAuthor = replyTo ? users[replyTo.authorId] : undefined
  const remaining = MAX_LENGTH - value.length

  return (
    <div className={styles.wrapper}>
      {showSuggestions && (
        <div className={styles.autocomplete} role="listbox">
          <div className={styles.autocompleteTitle}>
            {suggestions[0].kind === 'user' ? 'Members' : suggestions[0].kind === 'emoji' ? 'Emoji matching' : 'Commands'}
          </div>
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="option"
              aria-selected={i === active}
              className={classNames(styles.suggestion, i === active && styles.suggestionActive)}
              onMouseEnter={() => setSelected(i)}
              onMouseDown={e => e.preventDefault()}
              onClick={() => insertSuggestion(s)}
            >
              {s.kind === 'user' && <Avatar user={users[s.id]} size={24} />}
              {s.kind === 'emoji' && s.image && (
                // eslint-disable-next-line @next/next/no-img-element -- uploaded emoji
                <img src={s.image} alt="" className={styles.suggestionImage} />
              )}
              <span className={classNames(styles.suggestionLabel, s.kind === 'emoji' && styles.suggestionEmoji)}>
                {s.label}
              </span>
              <span className={styles.suggestionSub}>{s.sub}</span>
            </button>
          ))}
        </div>
      )}

      {replyTo && replyAuthor && (
        <div className={styles.replyBar}>
          <span>
            Replying to <strong>{displayNameIn(server, replyAuthor)}</strong>
          </span>
          <button
            type="button"
            aria-label="Cancel reply"
            onClick={() => dispatch(setReplyTo({ channelId, messageId: null }))}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {uploads && uploads.length > 0 && (
        <div className={classNames(styles.uploads, replyTo && styles.uploadsReplying)}>
          {uploads.map(a => (
            <div key={a.id} className={styles.upload}>
              {a.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element -- local preview
                <img src={a.url} alt="" className={styles.uploadImage} />
              ) : (
                <FileText size={48} className={styles.uploadIcon} />
              )}
              <span className={styles.uploadName}>{a.name}</span>
              <Tooltip label="Remove Attachment">
                <button
                  type="button"
                  className={styles.uploadRemove}
                  aria-label="Remove Attachment"
                  onClick={() => dispatch(removeUpload({ channelId, id: a.id }))}
                >
                  <Trash size={16} />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      )}

      <div
        data-composer
        className={classNames(
          styles.box,
          (replyTo || uploads?.length) && styles.boxReplying
        )}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={e => {
            if (e.target.files) upload(e.target.files)
            e.target.value = ''
          }}
        />
        <Tooltip label="Upload a File or Create a Poll">
          <button
            type="button"
            className={styles.attach}
            aria-label="Upload a File or Create a Poll"
            {...plusMenu.triggerProps}
          >
            <CirclePlus size={24} fill="currentColor" stroke="var(--bg-textarea)" />
          </button>
        </Tooltip>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          className={styles.textarea}
          maxLength={MAX_LENGTH + 500}
          onChange={e => update(e.target.value, e.target.selectionStart)}
          onSelect={e => setCaret(e.currentTarget.selectionStart)}
          onKeyDown={onKeyDown}
          onPaste={e => {
            const files = [...e.clipboardData.files]
            if (files.length) {
              e.preventDefault()
              upload(files)
            }
          }}
          autoFocus
        />
        <div className={styles.buttons}>
          <Tooltip label="Send a gift">
            <button
              type="button"
              className={styles.button}
              aria-label="Send a gift"
              onClick={() => dispatch(openModal({ type: 'gift', channelId }))}
            >
              <GiftIcon />
            </button>
          </Tooltip>
          <Tooltip label="Open GIF picker">
            <button type="button" className={styles.button} aria-label="Open GIF picker" {...pickerButton('gif')}>
              <GIFIcon />
            </button>
          </Tooltip>
          <Tooltip label="Open sticker picker">
            <button type="button" className={styles.button} aria-label="Open sticker picker" {...pickerButton('sticker')}>
              <StickerIcon />
            </button>
          </Tooltip>
          <Tooltip label="Select emoji">
            <button
              type="button"
              className={classNames(styles.button, styles.emojiButton)}
              aria-label="Select emoji"
              {...pickerButton('emoji')}
            >
              <EmojiIcon />
            </button>
          </Tooltip>
        </div>
        {remaining < 200 && (
          <span className={classNames(styles.counter, remaining < 0 && styles.counterOver)}>{remaining}</span>
        )}
      </div>

      {plusMenu.anchor && (
        <Popover anchor={plusMenu.anchor} placement="top-start" onClose={plusMenu.close}>
          <Menu>
            <MenuItem
              label="Upload a File"
              icon={<Upload size={18} />}
              onClick={() => {
                plusMenu.close()
                fileRef.current?.click()
              }}
            />
            <MenuItem
              label="Create Poll"
              icon={<ChartBar size={18} />}
              onClick={() => {
                plusMenu.close()
                dispatch(openModal({ type: 'poll', channelId }))
              }}
            />
          </Menu>
        </Popover>
      )}
      {expressions.anchor && (
        <Popover anchor={expressions.anchor} placement="top-end" offset={8} onClose={expressions.close}>
          <ExpressionPicker
            key={expressionTab}
            initialTab={expressionTab}
            custom={customGroups}
            onEmoji={char => {
              // Custom emoji go in as :name: and become tokens when sent
              const custom = parseCustomEmojiToken(char)
              insertAtCaret(custom ? `:${custom.name}: ` : char)
              expressions.close()
            }}
            onGif={(gif: Gif) => sendRich({ content: gifUrl(gif.id) })}
            onSticker={sticker => sendRich({ sticker })}
          />
        </Popover>
      )}

      <TypingIndicator channelId={channelId} server={server} />
    </div>
  )
}

export default MessageBox
