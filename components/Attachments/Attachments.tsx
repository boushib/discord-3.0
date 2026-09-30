'use client'

import { Download, FileText } from 'lucide-react'
import { formatBytes } from '../../lib/files'
import type { Attachment } from '../../models'
import styles from './Attachments.module.sass'

/** Images inline, other files as a download card, like Discord */
const Attachments = ({ attachments }: { attachments: Attachment[] }) => (
  <div className={styles.attachments}>
    {attachments.map(a =>
      !a.url ? (
        <div key={a.id} className={styles.file}>
          <FileText size={32} className={styles.fileIcon} />
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{a.name}</span>
            <span className={styles.fileSize}>File no longer available</span>
          </div>
        </div>
      ) : a.type.startsWith('image/') ? (
        <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className={styles.imageLink}>
          {/* eslint-disable-next-line @next/next/no-img-element -- user uploads (data/blob URLs) */}
          <img
            src={a.url}
            alt={a.name}
            className={styles.image}
            width={a.width}
            height={a.height}
            loading="lazy"
          />
        </a>
      ) : a.type.startsWith('video/') ? (
        <video key={a.id} src={a.url} controls className={styles.video} />
      ) : (
        <div key={a.id} className={styles.file}>
          <FileText size={32} className={styles.fileIcon} />
          <div className={styles.fileInfo}>
            <a href={a.url} download={a.name} className={styles.fileName}>
              {a.name}
            </a>
            <span className={styles.fileSize}>{formatBytes(a.size)}</span>
          </div>
          <a href={a.url} download={a.name} className={styles.download} aria-label={`Download ${a.name}`}>
            <Download size={20} />
          </a>
        </div>
      )
    )}
  </div>
)

export default Attachments
