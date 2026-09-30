'use client'

import { useRef, useState } from 'react'
import { useAppDispatch } from '../../hooks'
import type { Message } from '../../models'
import { editMessage, openModal, setEditing } from '../../store'
import styles from './Message.module.sass'

const MessageEditor = ({ message }: { message: Message }) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(message.content)
  const ref = useRef<HTMLTextAreaElement>(null)

  const cancel = () => dispatch(setEditing(null))
  const save = () => {
    const content = value.trim()
    if (!content) {
      dispatch(setEditing(null))
      dispatch(openModal({ type: 'deleteMessage', channelId: message.channelId, messageId: message.id }))
      return
    }
    if (content !== message.content) {
      dispatch(editMessage({ channelId: message.channelId, messageId: message.id, content }))
    }
    cancel()
  }

  const grow = (el: HTMLTextAreaElement | null) => {
    ref.current = el
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <div className={styles.editor}>
      <textarea
        ref={grow}
        autoFocus
        value={value}
        className={styles.editorInput}
        onFocus={e => e.currentTarget.setSelectionRange(value.length, value.length)}
        onChange={e => {
          setValue(e.target.value)
          grow(e.target)
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            cancel()
          } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            save()
          }
        }}
      />
      <div className={styles.editorHint}>
        escape to <button type="button" onClick={cancel}>cancel</button> • enter to{' '}
        <button type="button" onClick={save}>save</button>
      </div>
    </div>
  )
}

export default MessageEditor
