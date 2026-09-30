'use client'

import { Play } from 'lucide-react'
import { useState } from 'react'
import styles from './Message.module.sass'

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:[^\s]*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/g

/** Unique YouTube video ids linked in a message */
export const youtubeIds = (content: string) => [...new Set([...content.matchAll(YOUTUBE)].map(m => m[1]))].slice(0, 2)

/** Thumbnail card that turns into an inline player when clicked */
const YouTubeEmbed = ({ id }: { id: string }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={styles.embed}>
      <div className={styles.embedProvider}>YouTube</div>
      <a className={styles.embedTitle} href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer noopener">
        Watch on YouTube
      </a>
      <div className={styles.embedMedia}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title="YouTube video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.embedPlay} onClick={() => setPlaying(true)} aria-label="Play video">
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className={styles.embedPlayIcon}>
              <Play size={28} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default YouTubeEmbed
