'use client'

import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { updateProfile } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import Avatar from '../Avatar'
import { Button } from '../Modal'
import styles from './Settings.module.sass'

const maskEmail = (email: string) => {
  const [name, domain] = email.split('@')
  return `${'*'.repeat(Math.max(name.length, 4))}@${domain ?? ''}`
}

const Field = ({
  label,
  value,
  display,
  placeholder,
  onSave,
  extra,
}: {
  label: string
  value: string
  display?: string
  placeholder: string
  onSave: (value: string) => void
  extra?: React.ReactNode
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  return (
    <div className={styles.accountRow}>
      <div className={styles.accountRowMain}>
        <div className={styles.fieldLabel}>{label}</div>
        {editing ? (
          <form
            className={styles.inlineEdit}
            onSubmit={e => {
              e.preventDefault()
              onSave(draft.trim())
              setEditing(false)
            }}
          >
            <input autoFocus value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} />
            <Button type="submit">Save</Button>
            <Button variant="link" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <div className={styles.fieldValue}>
            {value ? display ?? value : <span className={styles.fieldEmpty}>{placeholder}</span>} {extra}
          </div>
        )}
      </div>
      {!editing && (
        <Button
          variant="secondary"
          onClick={() => {
            setDraft(value)
            setEditing(true)
          }}
        >
          {value ? 'Edit' : 'Add'}
        </Button>
      )}
    </div>
  )
}

const AccountSection = ({ onEditProfile }: { onEditProfile: () => void }) => {
  const dispatch = useAppDispatch()
  const me = useSelector(selectCurrentUser)
  const [revealEmail, setRevealEmail] = useState(false)

  return (
    <>
      <h1 className={styles.title}>My Account</h1>
      <div className={styles.accountCard}>
        <div className={styles.accountBanner} style={{ backgroundColor: me.bannerColor ?? 'var(--brand)' }} />
        <div className={styles.accountHeader}>
          <div className={styles.accountAvatar}>
            <Avatar user={me} size={80} status={me.status} ringColor="var(--bg-tertiary)" />
          </div>
          <span className={styles.accountName}>
            {me.displayName} {me.premium && <span title="Nitro">💎</span>}
          </span>
          <Button onClick={onEditProfile}>Edit User Profile</Button>
        </div>
        <div className={styles.accountFields}>
          <Field
            label="Display Name"
            value={me.displayName}
            placeholder="Add a display name"
            onSave={v => dispatch(updateProfile({ displayName: v || me.username }))}
          />
          <Field
            label="Username"
            value={me.username}
            placeholder="username"
            onSave={v => {
              const username = v.toLowerCase().replace(/[^a-z0-9_.]/g, '')
              if (username) dispatch(updateProfile({ username }))
            }}
          />
          <Field
            label="Email"
            value={me.email ?? ''}
            display={revealEmail ? me.email : maskEmail(me.email ?? '')}
            placeholder="You haven’t added an email yet."
            onSave={v => dispatch(updateProfile({ email: v || undefined }))}
            extra={
              me.email && (
                <button type="button" className={styles.reveal} onClick={() => setRevealEmail(r => !r)}>
                  {revealEmail ? 'Hide' : 'Reveal'}
                </button>
              )
            }
          />
          <Field
            label="Phone Number"
            value={me.phone ?? ''}
            placeholder="You haven’t added a phone number yet."
            onSave={v => dispatch(updateProfile({ phone: v || undefined }))}
          />
        </div>
      </div>
    </>
  )
}

export default AccountSection
