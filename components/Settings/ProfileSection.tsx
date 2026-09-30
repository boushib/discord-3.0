'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { AVATAR_COLORS } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { updateProfile } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import Avatar from '../Avatar'
import { Button } from '../Modal'
import styles from './Settings.module.sass'

const BANNERS = ['#5865f2', '#eb459e', '#3ba55c', '#faa61a', '#ed4245', '#1abc9c', '#111827', '#9b59b6']

const ProfileSection = () => {
  const dispatch = useAppDispatch()
  const me = useSelector(selectCurrentUser)
  const initial = {
    displayName: me.displayName,
    username: me.username,
    customStatus: me.customStatus ?? '',
    bio: me.bio ?? '',
    avatarColor: me.avatarColor,
    bannerColor: me.bannerColor ?? '#5865f2',
  }
  const [draft, setDraft] = useState(initial)
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial)
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft(d => ({ ...d, [key]: value }))

  const save = () =>
    dispatch(
      updateProfile({
        ...draft,
        displayName: draft.displayName.trim() || me.username,
        username: draft.username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '') || me.username,
      })
    )

  return (
    <>
      <h1 className={styles.title}>Profiles</h1>
      <div className={styles.profileLayout}>
        <div className={styles.profileForm}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Display Name</span>
            <input value={draft.displayName} maxLength={32} onChange={e => set('displayName', e.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Username</span>
            <input value={draft.username} maxLength={32} onChange={e => set('username', e.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Custom Status</span>
            <input
              value={draft.customStatus}
              maxLength={128}
              placeholder="What’s up?"
              onChange={e => set('customStatus', e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>About Me</span>
            <textarea
              rows={4}
              value={draft.bio}
              maxLength={190}
              placeholder="Tell everyone a little about yourself"
              onChange={e => set('bio', e.target.value)}
            />
            <span className={styles.counter}>{190 - draft.bio.length}</span>
          </label>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Avatar Color</span>
            <div className={styles.swatches}>
              {AVATAR_COLORS.map((color, i) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Avatar color ${i + 1}`}
                  className={classNames(styles.swatch, draft.avatarColor === i && styles.swatchActive)}
                  style={{ backgroundColor: color }}
                  onClick={() => set('avatarColor', i)}
                />
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Banner Color</span>
            <div className={styles.swatches}>
              {BANNERS.map(color => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Banner ${color}`}
                  className={classNames(styles.swatch, draft.bannerColor === color && styles.swatchActive)}
                  style={{ backgroundColor: color }}
                  onClick={() => set('bannerColor', color)}
                />
              ))}
              <input
                type="color"
                aria-label="Custom banner color"
                className={styles.colorInput}
                value={draft.bannerColor}
                onChange={e => set('bannerColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <span className={styles.fieldLabel}>Preview</span>
          <div className={styles.preview}>
            <div className={styles.previewBanner} style={{ backgroundColor: draft.bannerColor }} />
            <div className={styles.previewAvatar}>
              <Avatar user={{ ...me, avatarColor: draft.avatarColor }} size={80} status={me.status} ringColor="var(--bg-floating)" />
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewName}>{draft.displayName || me.username}</div>
              <div className={styles.previewUsername}>{draft.username}</div>
              {draft.customStatus && <div className={styles.previewStatus}>{draft.customStatus}</div>}
              {draft.bio && (
                <>
                  <div className={styles.previewHeading}>About Me</div>
                  <p className={styles.previewBio}>{draft.bio}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {dirty && (
        <div className={styles.unsaved}>
          <span>Careful — you have unsaved changes!</span>
          <Button variant="link" onClick={() => setDraft(initial)}>
            Reset
          </Button>
          <Button variant="success" onClick={save}>
            Save Changes
          </Button>
        </div>
      )}
    </>
  )
}

export default ProfileSection
