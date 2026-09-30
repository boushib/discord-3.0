'use client'

import classNames from 'classnames'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch } from '../../hooks'
import { clearState } from '../../store/persist'
import { closeModal } from '../../store'
import Modal, { Button } from '../Modal'
import AccountSection from './AccountSection'
import AppearanceSection from './AppearanceSection'
import NotificationsSection from './NotificationsSection'
import ProfileSection from './ProfileSection'
import styles from './Settings.module.sass'

type Section = 'account' | 'profile' | 'appearance' | 'notifications'

const NAV: { heading: string; items: { id: Section; label: string }[] }[] = [
  {
    heading: 'User Settings',
    items: [
      { id: 'account', label: 'My Account' },
      { id: 'profile', label: 'Profiles' },
    ],
  },
  {
    heading: 'App Settings',
    items: [
      { id: 'appearance', label: 'Appearance' },
      { id: 'notifications', label: 'Notifications' },
    ],
  },
]

const Settings = () => {
  const dispatch = useAppDispatch()
  const [section, setSection] = useState<Section>('account')
  const [confirmReset, setConfirmReset] = useState(false)
  const close = () => dispatch(closeModal())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !confirmReset && dispatch(closeModal())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, confirmReset])

  return createPortal(
    <div className={styles.settings} role="dialog" aria-modal="true" aria-label="User Settings">
      <nav className={`${styles.sidebar} scroller`}>
        <div className={styles.sidebarInner}>
          {NAV.map(group => (
            <div key={group.heading}>
              <h2 className={styles.navHeading}>{group.heading}</h2>
              {group.items.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={classNames(styles.navItem, section === item.id && styles.navItemActive)}
                  onClick={() => setSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
              <div className={styles.navSeparator} />
            </div>
          ))}
          <button type="button" className={classNames(styles.navItem, styles.navDanger)} onClick={() => setConfirmReset(true)}>
            Reset Demo Data
          </button>
          <div className={styles.navSeparator} />
          <p className={styles.version}>Discord 3.0 · Next.js 16</p>
        </div>
      </nav>

      <main className={`${styles.content} scroller`}>
        <div className={styles.contentInner}>
          {section === 'account' && <AccountSection onEditProfile={() => setSection('profile')} />}
          {section === 'profile' && <ProfileSection />}
          {section === 'appearance' && <AppearanceSection />}
          {section === 'notifications' && <NotificationsSection />}
        </div>
        <div className={styles.closeColumn}>
          <button type="button" className={styles.close} onClick={close} aria-label="Close settings">
            <X size={18} />
          </button>
          <span className={styles.closeHint}>ESC</span>
        </div>
      </main>

      {confirmReset && (
        <Modal
          title="Reset Demo Data"
          subtitle="This wipes your messages, servers and settings from this browser and restores the demo data."
          onClose={() => setConfirmReset(false)}
          footer={
            <>
              <Button variant="link" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  clearState()
                  // A full reload is needed so the store is rebuilt from the seed data
                  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                  window.location.assign('/channels/@me')
                }}
              >
                Reset
              </Button>
            </>
          }
        />
      )}
    </div>,
    document.body
  )
}

export default Settings
