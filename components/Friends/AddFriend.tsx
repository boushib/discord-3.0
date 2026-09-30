'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { sendFriendRequest } from '../../store'
import styles from './Friends.module.sass'

const AddFriend = () => {
  const dispatch = useAppDispatch()
  const users = useSelector(s => s.users.byId)
  const relationships = useSelector(s => s.users.relationships)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const username = value.trim().toLowerCase()
    const user = Object.values(users).find(u => u.username.toLowerCase() === username)
    const existing = user && relationships.find(r => r.userId === user.id)
    if (!user || user.id === CURRENT_USER_ID) {
      setResult({ ok: false, text: 'Hm, didn’t work. Double check that the username is correct.' })
    } else if (existing?.type === 'friend') {
      setResult({ ok: false, text: `You’re already friends with ${user.displayName}!` })
    } else if (existing?.type === 'outgoing') {
      setResult({ ok: false, text: `You’ve already sent ${user.displayName} a friend request.` })
    } else {
      dispatch(sendFriendRequest(username))
      setResult({
        ok: true,
        text:
          existing?.type === 'incoming'
            ? `You and ${user.displayName} are now friends!`
            : `Success! Your friend request to ${user.username} was sent.`,
      })
      setValue('')
    }
  }

  return (
    <div className={styles.add}>
      <h2 className={styles.addTitle}>Add Friend</h2>
      <p className={styles.addText}>You can add friends with their Discord username. Try “ava.gg” or “noah”.</p>
      <form
        onSubmit={submit}
        className={classNames(
          styles.addForm,
          result?.ok === true && styles.addFormOk,
          result?.ok === false && styles.addFormError
        )}
      >
        <input
          autoFocus
          value={value}
          onChange={e => {
            setValue(e.target.value)
            setResult(null)
          }}
          placeholder="You can add friends with their Discord username."
          aria-label="Username"
        />
        <button type="submit" disabled={!value.trim()}>
          Send Friend Request
        </button>
      </form>
      {result && (
        <p className={classNames(styles.addResult, result.ok ? styles.addResultOk : styles.addResultError)}>
          {result.text}
        </p>
      )}
    </div>
  )
}

export default AddFriend
