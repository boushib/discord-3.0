'use client'

import { useEffect, useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useSelector } from '../../hooks'
import type { User } from '../../models'
import CallStage from './CallStage'
import styles from './Voice.module.sass'

/** Call area shown above a DM conversation while a call is active */
const DMCall = ({ dmId, recipient }: { dmId: string; recipient: User }) => {
  const me = useSelector(s => s.users.byId[CURRENT_USER_ID])
  const voice = useSelector(s => s.ui.voice)
  const active = voice?.channelId === dmId
  const callId = active ? `${dmId}-${voice.startedAt}` : null
  const [answeredCall, setAnsweredCall] = useState<string | null>(null)
  const canAnswer = recipient.status !== 'offline'

  // The other side "picks up" after a moment if they're online
  useEffect(() => {
    if (!callId || !canAnswer) return
    const timer = setTimeout(() => setAnsweredCall(callId), 2200)
    return () => clearTimeout(timer)
  }, [callId, canAnswer])

  if (!callId) return null
  const answered = answeredCall === callId

  return (
    <div className={styles.dmCall}>
      <CallStage participants={answered ? [me, recipient] : [me]} compact />
      {!answered && (
        <div className={styles.ringing}>
          {canAnswer ? `Calling ${recipient.displayName}…` : `${recipient.displayName} is offline`}
        </div>
      )}
    </div>
  )
}

export default DMCall
