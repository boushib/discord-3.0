'use client'

import { useAppDispatch } from '../../hooks'
import { closeModal } from '../../store'
import Modal from '../Modal'
import styles from './Modals.module.sass'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const MOD = isMac ? '⌘' : 'Ctrl'

const SHORTCUTS: [string, string[]][] = [
  ['Quick switcher', [MOD, 'K']],
  ['Keyboard shortcuts', [MOD, '/']],
  ['Toggle mute', [MOD, 'Shift', 'M']],
  ['Toggle deafen', [MOD, 'Shift', 'D']],
  ['Send message', ['Enter']],
  ['New line', ['Shift', 'Enter']],
  ['Edit your last message', ['↑']],
  ['Cancel reply / edit', ['Esc']],
  ['Pick autocomplete', ['Tab']],
  ['Close popup or modal', ['Esc']],
]

const ShortcutsModal = () => {
  const dispatch = useAppDispatch()
  return (
    <Modal title="Keyboard Shortcuts" onClose={() => dispatch(closeModal())} size="medium">
      <ul className={styles.shortcuts}>
        {SHORTCUTS.map(([label, keys]) => (
          <li key={label}>
            <span>{label}</span>
            <span className={styles.keys}>
              {keys.map(k => (
                <kbd key={k}>{k}</kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.hint}>
        Markdown works in messages: **bold**, *italic*, __underline__, ~~strike~~, `code`, ||spoiler|| and &gt; quotes.
      </p>
    </Modal>
  )
}

export default ShortcutsModal
