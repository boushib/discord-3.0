'use client'

import classNames from 'classnames'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { GIFS, gifPreview, STICKERS, type Gif } from '../../constants/expressions'
import type { CustomEmoji, CustomSticker } from '../../models'
import EmojiPicker from '../EmojiPicker'
import styles from './ExpressionPicker.module.sass'

export type ExpressionTab = 'gif' | 'sticker' | 'emoji'

interface Props {
  initialTab: ExpressionTab
  onEmoji: (emoji: string) => void
  onGif: (gif: Gif) => void
  onSticker: (sticker: { id: string; name: string; emoji?: string; url?: string }) => void
  /** Custom emoji and stickers from your servers, current server first */
  custom?: { serverId: string; serverName: string; emojis: CustomEmoji[]; stickers: CustomSticker[] }[]
}

const TABS: { id: ExpressionTab; label: string }[] = [
  { id: 'gif', label: 'GIFs' },
  { id: 'sticker', label: 'Stickers' },
  { id: 'emoji', label: 'Emoji' },
]

/** Discord's combined GIF / sticker / emoji picker */
const ExpressionPicker = ({ initialTab, onEmoji, onGif, onSticker, custom = [] }: Props) => {
  const [tab, setTab] = useState(initialTab)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const gifs = GIFS.filter(g => !q || `${g.label} ${g.tags}`.toLowerCase().includes(q))
  const stickers = STICKERS.filter(s => !q || s.name.toLowerCase().includes(q))
  const customStickers = custom
    .map(g => ({ ...g, stickers: g.stickers.filter(s => !q || s.name.toLowerCase().includes(q)) }))
    .filter(g => g.stickers.length)

  return (
    <div className={styles.picker}>
      <nav className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={classNames(styles.tab, tab === t.id && styles.tabActive)}
            onClick={() => {
              setTab(t.id)
              setQuery('')
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'emoji' ? (
        <div className={styles.emoji}>
          <EmojiPicker onSelect={onEmoji} custom={custom} />
        </div>
      ) : (
        <>
            <label className={styles.search}>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={tab === 'gif' ? 'Search GIFs' : 'Find the perfect sticker'}
              />
              <Search size={18} />
            </label>
            <div className={`${styles.body} scroller`}>
              {tab === 'gif' ? (
                gifs.length ? (
                  <div className={styles.gifs}>
                    {gifs.map(gif => (
                      <button key={gif.id} type="button" className={styles.gif} onClick={() => onGif(gif)} title={gif.label}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- remote GIF */}
                        <img src={gifPreview(gif.id)} alt={gif.label} loading="lazy" />
                        <span>{gif.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={styles.empty}>No GIFs match “{query}”. Try “cat”, “wow” or “thanks”.</p>
                )
              ) : stickers.length || customStickers.length ? (
                <>
                {customStickers.map(group => (
                  <section key={group.serverId}>
                    <h4 className={styles.groupLabel}>{group.serverName}</h4>
                    <div className={styles.stickers}>
                      {group.stickers.map(sticker => (
                        <button
                          key={sticker.id}
                          type="button"
                          className={styles.sticker}
                          onClick={() => onSticker(sticker)}
                          title={sticker.name}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded sticker */}
                          <img src={sticker.url} alt={sticker.name} className={styles.stickerImage} />
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
                {customStickers.length > 0 && stickers.length > 0 && <h4 className={styles.groupLabel}>Discord</h4>}
                <div className={styles.stickers}>
                  {stickers.map(sticker => (
                    <button
                      key={sticker.id}
                      type="button"
                      className={styles.sticker}
                      onClick={() => onSticker(sticker)}
                      title={sticker.name}
                    >
                      <span className={styles.stickerEmoji}>{sticker.emoji}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className={styles.empty}>No stickers match “{query}”.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ExpressionPicker
