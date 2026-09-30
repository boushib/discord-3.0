'use client'

import classNames from 'classnames'
import { Check } from 'lucide-react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useNow } from '../../hooks'
import type { Message } from '../../models'
import { votePoll } from '../../store'
import styles from './Poll.module.sass'

const timeLeft = (ms: number) => {
  const hours = Math.floor(ms / 3_600_000)
  if (hours >= 24) return `${Math.floor(hours / 24)}d left`
  if (hours >= 1) return `${hours}h left`
  return `${Math.max(1, Math.floor(ms / 60_000))}m left`
}

const PollView = ({ message }: { message: Message }) => {
  const dispatch = useAppDispatch()
  const now = useNow()
  const poll = message.poll!
  const closed = now > poll.endsAt
  const voters = new Set(poll.options.flatMap(o => o.voterIds))
  const total = poll.options.reduce((sum, o) => sum + o.voterIds.length, 0)
  const voted = voters.has(CURRENT_USER_ID)
  const showResults = voted || closed
  const top = Math.max(...poll.options.map(o => o.voterIds.length))

  return (
    <div className={styles.poll}>
      <div className={styles.question}>{poll.question}</div>
      <div className={styles.hint}>{poll.multiple ? 'Select one or more answers' : 'Select one answer'}</div>
      <div className={styles.options}>
        {poll.options.map(option => {
          const count = option.voterIds.length
          const percent = total ? Math.round((count / total) * 100) : 0
          const mine = option.voterIds.includes(CURRENT_USER_ID)
          return (
            <button
              key={option.id}
              type="button"
              disabled={closed}
              className={classNames(
                styles.option,
                mine && styles.optionMine,
                closed && count === top && count > 0 && styles.optionWinner
              )}
              onClick={() =>
                dispatch(
                  votePoll({ channelId: message.channelId, messageId: message.id, optionId: option.id, userId: CURRENT_USER_ID })
                )
              }
            >
              {showResults && <span className={styles.bar} style={{ width: `${percent}%` }} />}
              <span className={styles.optionText}>{option.text}</span>
              {showResults && (
                <span className={styles.optionStats}>
                  {count} vote{count === 1 ? '' : 's'} · {percent}%
                </span>
              )}
              <span className={classNames(styles.check, mine && styles.checkOn, poll.multiple && styles.checkSquare)}>
                {mine && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>
      <div className={styles.footer}>
        {voters.size} vote{voters.size === 1 ? '' : 's'} · {closed ? 'Poll closed' : timeLeft(poll.endsAt - now)}
        {voted && !closed && <span className={styles.footerHint}>Click your answer again to remove your vote</span>}
      </div>
    </div>
  )
}

export default PollView
