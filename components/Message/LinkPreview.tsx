'use client'

import { useEffect, useState } from 'react'
import type { LinkPreview as Preview } from '../../lib/server/unfurl'
import { isImageLink } from './RichContent'
import { youtubeIds } from './YouTubeEmbed'
import styles from './Message.module.sass'

const URL_PATTERN = /https?:\/\/[^\s<]+[^\s<.,:;"')\]]/g

// One request per URL per session, shared by every message that links it
const requests = new Map<string, Promise<Preview | null>>()

const loadPreview = (url: string) => {
  let request = requests.get(url)
  if (!request) {
    request = fetch(`/api/unfurl?url=${encodeURIComponent(url)}`)
      .then(res => (res.ok ? (res.json() as Promise<Preview>) : null))
      .catch(() => null)
    requests.set(url, request)
  }
  return request
}

/** Links that should get a rich preview (YouTube and image links have their own embeds) */
export const previewableLinks = (content: string) =>
  [...new Set(content.match(URL_PATTERN) ?? [])]
    .filter(url => !isImageLink(url) && youtubeIds(url).length === 0)
    .slice(0, 2)

const LinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<Preview | null>(null)

  useEffect(() => {
    let cancelled = false
    loadPreview(url).then(data => {
      if (!cancelled) setPreview(data)
    })
    return () => {
      cancelled = true
    }
  }, [url])

  if (!preview) return null

  return (
    <div className={styles.linkEmbed} style={{ borderLeftColor: preview.themeColor ?? 'var(--bg-tertiary)' }}>
      {preview.siteName && <div className={styles.embedProvider}>{preview.siteName}</div>}
      {preview.title && (
        <a className={styles.embedTitle} href={url} target="_blank" rel="noreferrer noopener">
          {preview.title}
        </a>
      )}
      {preview.description && <p className={styles.linkDescription}>{preview.description}</p>}
      {preview.image && (
        <a href={url} target="_blank" rel="noreferrer noopener" className={styles.linkImage}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote preview image */}
          <img src={preview.image} alt="" loading="lazy" onError={e => (e.currentTarget.style.display = 'none')} />
        </a>
      )}
    </div>
  )
}

export default LinkPreview
