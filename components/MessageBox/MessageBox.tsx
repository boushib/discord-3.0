'use client'

import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch } from '../../hooks'
import AttachIcon from '../../icons/Attach'
import EmojiIcon from '../../icons/Emoji'
import GIFIcon from '../../icons/GIF'
import GiftIcon from '../../icons/Gift'
import StickerIcon from '../../icons/Sticker'
import { sendMessage } from '../../store'
import styles from './MessageBox.module.sass'

const MessageBox = ({ channelId, placeholder }: { channelId: string; placeholder: string }) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    dispatch(sendMessage({ channelId, authorId: CURRENT_USER_ID, content: value.trim() }))
    setValue('')
  }

  return (
    <form className={styles['message-box']} onSubmit={submit}>
      <div className={styles['message-box__input']}>
        <AttachIcon />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <GiftIcon />
        <GIFIcon />
        <StickerIcon />
        <EmojiIcon />
      </div>
    </form>
  )
}

export default MessageBox
