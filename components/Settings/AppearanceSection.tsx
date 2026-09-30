'use client'

import classNames from 'classnames'
import { useAppDispatch, useSelector } from '../../hooks'
import { setCompactMode } from '../../store'
import styles from './Settings.module.sass'

const AppearanceSection = () => {
  const dispatch = useAppDispatch()
  const compact = useSelector(s => s.prefs.compactMode)

  const options = [
    { value: false, label: 'Cozy', description: 'Modern, beautiful, and easy on your eyes.' },
    { value: true, label: 'Compact', description: 'Fit more messages on screen at one time. #IRC' },
  ]

  return (
    <>
      <h1 className={styles.title}>Appearance</h1>
      <h2 className={styles.subtitle}>Theme</h2>
      <div className={styles.themes}>
        <div className={classNames(styles.theme, styles.themeActive)} style={{ background: '#313338' }} title="Dark" />
        <div className={styles.theme} style={{ background: '#fff', opacity: 0.4, cursor: 'not-allowed' }} title="Light (coming soon)" />
      </div>
      <div className={styles.divider} />
      <h2 className={styles.subtitle}>Message Display</h2>
      <div role="radiogroup" className={styles.radios}>
        {options.map(option => (
          <label key={option.label} className={classNames(styles.radioRow, compact === option.value && styles.radioRowActive)}>
            <input
              type="radio"
              name="display"
              className="sr-only"
              checked={compact === option.value}
              onChange={() => dispatch(setCompactMode(option.value))}
            />
            <span className={styles.radio} />
            <span>
              <span className={styles.radioLabel}>{option.label}</span>
              <span className={styles.radioDescription}>{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </>
  )
}

export default AppearanceSection
