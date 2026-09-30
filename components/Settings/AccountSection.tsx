'use client'

import { useSelector } from '../../hooks'
import { selectCurrentUser } from '../../store/selectors'
import Avatar from '../Avatar'
import { Button } from '../Modal'
import styles from './Settings.module.sass'

const AccountSection = ({ onEditProfile }: { onEditProfile: () => void }) => {
  const me = useSelector(selectCurrentUser)
  const rows = [
    { label: 'Display Name', value: me.displayName },
    { label: 'Username', value: me.username },
    { label: 'Email', value: '••••••••@example.com' },
    { label: 'Phone Number', value: 'You haven’t added a phone number yet.' },
  ]

  return (
    <>
      <h1 className={styles.title}>My Account</h1>
      <div className={styles.accountCard}>
        <div className={styles.accountBanner} style={{ backgroundColor: me.bannerColor ?? 'var(--brand)' }} />
        <div className={styles.accountHeader}>
          <div className={styles.accountAvatar}>
            <Avatar user={me} size={80} status={me.status} ringColor="var(--bg-tertiary)" />
          </div>
          <span className={styles.accountName}>{me.displayName}</span>
          <Button onClick={onEditProfile}>Edit User Profile</Button>
        </div>
        <div className={styles.accountFields}>
          {rows.map(row => (
            <div key={row.label} className={styles.accountRow}>
              <div>
                <div className={styles.fieldLabel}>{row.label}</div>
                <div className={styles.fieldValue}>{row.value}</div>
              </div>
              <Button variant="secondary" onClick={row.label.includes('Name') ? onEditProfile : undefined}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AccountSection
