'use client'

import { Laptop, Monitor, Smartphone, Terminal } from 'lucide-react'
import { useAppDispatch } from '../../hooks'
import { closeModal } from '../../store'
import Modal from '../Modal'
import styles from './Modals.module.sass'

const PLATFORMS = [
  { name: 'Windows', icon: <Monitor size={32} /> },
  { name: 'macOS', icon: <Laptop size={32} /> },
  { name: 'Linux', icon: <Terminal size={32} /> },
  { name: 'iOS & Android', icon: <Smartphone size={32} /> },
]

const DownloadModal = () => {
  const dispatch = useAppDispatch()
  return (
    <Modal
      title="Get the Discord app"
      subtitle="This clone runs in your browser, but the real Discord has apps for every platform."
      onClose={() => dispatch(closeModal())}
      size="medium"
    >
      <div className={styles.platforms}>
        {PLATFORMS.map(p => (
          <a
            key={p.name}
            href="https://discord.com/download"
            target="_blank"
            rel="noreferrer noopener"
            className={styles.platform}
          >
            {p.icon}
            <span>{p.name}</span>
          </a>
        ))}
      </div>
    </Modal>
  )
}

export default DownloadModal
