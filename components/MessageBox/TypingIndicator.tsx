'use client'

import { useSelector } from '../../hooks'
import type { Server } from '../../models'
import { displayNameIn } from '../../store/selectors'
import styles from './MessageBox.module.sass'

const EMPTY: string[] = []

const TypingIndicator = ({ channelId, server }: { channelId: string; server?: Server }) => {
  const typing = useSelector(s => s.ui.typing[channelId] ?? EMPTY)
  const users = useSelector(s => s.users.byId)
  const names = typing.map(id => displayNameIn(server, users[id]))

  let text: React.ReactNode = null
  if (names.length === 1) text = <><strong>{names[0]}</strong> is typing…</>
  else if (names.length === 2) text = <><strong>{names[0]}</strong> and <strong>{names[1]}</strong> are typing…</>
  else if (names.length > 2) text = 'Several people are typing…'

  return (
    <div className={styles.typing} aria-live="polite">
      {text && (
        <>
          <span className={styles.dots}>
            <span />
            <span />
            <span />
          </span>
          <span>{text}</span>
        </>
      )}
    </div>
  )
}

export default TypingIndicator
