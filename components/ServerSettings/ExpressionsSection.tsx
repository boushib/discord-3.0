'use client'

import { Trash, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAppDispatch } from '../../hooks'
import { imageToDataURL, toEmojiName } from '../../lib/files'
import type { Server } from '../../models'
import { addEmoji, addSticker, removeEmoji, removeSticker, renameEmoji, renameSticker } from '../../store'
import { Button } from '../Modal'
import base from '../Settings/Settings.module.sass'
import styles from './ServerSettings.module.sass'

const LIMITS = { emoji: 50, sticker: 20 }

/** Upload and manage a server's custom emoji or stickers */
const ExpressionsSection = ({ server, kind }: { server: Server; kind: 'emoji' | 'sticker' }) => {
  const dispatch = useAppDispatch()
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const items = (kind === 'emoji' ? server.emojis : server.stickers) ?? []
  const limit = LIMITS[kind]

  const upload = async (files: FileList) => {
    setError(null)
    const names = new Set(items.map(i => i.name))
    for (const file of [...files].slice(0, limit - items.length)) {
      if (!file.type.startsWith('image/')) {
        setError('Only images (PNG, JPEG, GIF, WebP) can be uploaded.')
        continue
      }
      if (file.size > 2 * 1024 * 1024) {
        setError(`${file.name} is larger than 2 MB.`)
        continue
      }
      let name = toEmojiName(file.name)
      for (let n = 2; names.has(name); n++) name = `${toEmojiName(file.name).slice(0, 29)}_${n}`
      names.add(name)
      const url = await imageToDataURL(file, kind === 'emoji' ? 128 : 320)
      if (kind === 'emoji') dispatch(addEmoji({ serverId: server.id, name, url }))
      else dispatch(addSticker({ serverId: server.id, name, url }))
    }
    if (files.length > limit - items.length) setError(`This server can have up to ${limit} ${kind === 'emoji' ? 'emoji' : 'stickers'}.`)
  }

  const rename = (id: string, raw: string) => {
    const name = kind === 'emoji' ? toEmojiName(raw) : raw.trim().slice(0, 30) || 'sticker'
    if (kind === 'emoji') dispatch(renameEmoji({ serverId: server.id, emojiId: id, name }))
    else dispatch(renameSticker({ serverId: server.id, stickerId: id, name }))
  }

  return (
    <>
      <h1 className={base.title}>{kind === 'emoji' ? 'Emoji' : 'Stickers'}</h1>
      <p className={styles.help}>
        {kind === 'emoji'
          ? 'Add custom emoji anyone can use in this server. Type :name: in a message or pick them from the emoji picker and reactions.'
          : 'Upload custom stickers for this server. They show up in the sticker picker.'}{' '}
        PNG, JPEG, GIF or WebP up to 2 MB; images are resized automatically.
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple
        hidden
        onChange={e => {
          if (e.target.files) void upload(e.target.files)
          e.target.value = ''
        }}
      />
      <Button onClick={() => fileRef.current?.click()} disabled={items.length >= limit}>
        <span className={styles.buttonInner}>
          <Upload size={16} /> Upload {kind === 'emoji' ? 'Emoji' : 'Sticker'}
        </span>
      </Button>
      {error && <p className={base.warning}>{error}</p>}

      <h2 className={styles.slotsTitle}>
        {kind === 'emoji' ? 'Emoji' : 'Stickers'} — {items.length} of {limit} used
      </h2>
      <div className={styles.expressionList}>
        {items.map(item => (
          <div key={item.id} className={styles.expressionRow}>
            {/* eslint-disable-next-line @next/next/no-img-element -- uploaded image */}
            <img src={item.url} alt="" className={kind === 'emoji' ? styles.emojiPreview : styles.stickerPreview} />
            <label className={styles.expressionName}>
              {kind === 'emoji' && <span>:</span>}
              <input
                key={item.name}
                defaultValue={item.name}
                aria-label="Name"
                maxLength={32}
                onBlur={e => rename(item.id, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
              />
              {kind === 'emoji' && <span>:</span>}
            </label>
            <button
              type="button"
              className={styles.expressionDelete}
              aria-label={`Delete ${item.name}`}
              onClick={() =>
                kind === 'emoji'
                  ? dispatch(removeEmoji({ serverId: server.id, emojiId: item.id }))
                  : dispatch(removeSticker({ serverId: server.id, stickerId: item.id }))
              }
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className={styles.help}>Nothing here yet. Upload one to get started!</p>}
      </div>
    </>
  )
}

export default ExpressionsSection
