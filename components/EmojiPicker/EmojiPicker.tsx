'use client'

import classNames from 'classnames'
import { Search } from 'lucide-react'
import { useRef, useState } from 'react'
import { EMOJI_CATEGORIES, Emoji, searchEmojis } from '../../constants/emojis'
import styles from './EmojiPicker.module.sass'

interface Props {
  onSelect: (emoji: string) => void
}

const EmojiPicker = ({ onSelect }: Props) => {
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState<Emoji>(EMOJI_CATEGORIES[0].emojis[0])
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].id)
  const gridRef = useRef<HTMLDivElement>(null)
  const results = query ? searchEmojis(query) : null

  const renderEmoji = (emoji: Emoji) => (
    <button
      key={emoji.char + emoji.name}
      type="button"
      className={styles.emoji}
      onMouseEnter={() => setHovered(emoji)}
      onFocus={() => setHovered(emoji)}
      onClick={() => onSelect(emoji.char)}
      aria-label={emoji.name.split(',')[0]}
    >
      {emoji.char}
    </button>
  )

  const onScroll = () => {
    const grid = gridRef.current
    if (!grid || results) return
    const sections = grid.querySelectorAll<HTMLElement>('[data-category]')
    for (const section of sections) {
      if (section.offsetTop + section.offsetHeight - 40 > grid.scrollTop) {
        setActiveCategory(section.dataset.category!)
        break
      }
    }
  }

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <label className={styles.search}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find the perfect emoji"
            onKeyDown={e => {
              if (e.key === 'Enter' && results?.[0]) onSelect(results[0].char)
            }}
          />
          <Search size={18} />
        </label>
      </div>
      <div className={styles.main}>
        <nav className={styles.categories}>
          {EMOJI_CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              className={classNames(styles.categoryButton, activeCategory === c.id && !results && styles.categoryActive)}
              onClick={() => {
                setQuery('')
                gridRef.current
                  ?.querySelector(`[data-category="${c.id}"]`)
                  ?.scrollIntoView({ block: 'start' })
              }}
            >
              {c.icon}
            </button>
          ))}
        </nav>
        <div ref={gridRef} className={`${styles.grid} scroller`} onScroll={onScroll}>
          {results ? (
            results.length ? (
              <div className={styles.emojis}>{results.map(renderEmoji)}</div>
            ) : (
              <div className={styles.empty}>No emoji match “{query}”</div>
            )
          ) : (
            EMOJI_CATEGORIES.map(c => (
              <section key={c.id} data-category={c.id}>
                <h4 className={styles.categoryLabel}>{c.label}</h4>
                <div className={styles.emojis}>{c.emojis.map(renderEmoji)}</div>
              </section>
            ))
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.previewEmoji}>{hovered.char}</span>
        <span className={styles.previewName}>:{hovered.name.split(',')[0]}:</span>
      </div>
    </div>
  )
}

export default EmojiPicker
