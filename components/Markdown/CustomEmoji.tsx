'use client'

import classNames from 'classnames'
import { useSelector } from '../../hooks'
import { selectCustomEmojiById } from '../../store/selectors'
import Tooltip from '../Tooltip'
import styles from './Markdown.module.sass'

/** Renders a server's custom emoji; falls back to :name: if it was deleted */
const CustomEmoji = ({ id, name, className }: { id: string; name: string; className?: string }) => {
  const emoji = useSelector(s => selectCustomEmojiById(s)[id])
  if (!emoji) return <>:{name}:</>
  return (
    <Tooltip label={`:${emoji.name}:`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- uploaded emoji (data URL) */}
      <img src={emoji.url} alt={`:${emoji.name}:`} className={classNames(styles.customEmoji, className)} draggable={false} />
    </Tooltip>
  )
}

export default CustomEmoji
