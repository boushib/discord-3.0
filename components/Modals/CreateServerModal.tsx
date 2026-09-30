'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { serverHref } from '../../lib/routes'
import { closeModal, createServer } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import Modal, { Button } from '../Modal'
import ServerIcon from '../ServerRail/ServerIcon'
import styles from './Modals.module.sass'

const TEMPLATES = [
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🏫', label: 'School Club' },
  { emoji: '📚', label: 'Study Group' },
  { emoji: '🧑‍🤝‍🧑', label: 'Friends' },
  { emoji: '🎨', label: 'Artists & Creators' },
  { emoji: '🏘️', label: 'Local Community' },
]

const CreateServerModal = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const me = useSelector(selectCurrentUser)
  const [step, setStep] = useState<'template' | 'customize'>('template')
  const [name, setName] = useState(`${me.displayName}'s server`)
  const [icon, setIcon] = useState('')
  const close = () => dispatch(closeModal())

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const action = dispatch(createServer({ name: name.trim(), icon: icon.trim() || undefined }))
    close()
    router.push(serverHref(action.payload.id))
  }

  if (step === 'template') {
    return (
      <Modal
        title="Create Your Server"
        subtitle="Your server is where you and your friends hang out. Make yours and start talking."
        onClose={close}
      >
        <button type="button" className={styles.template} onClick={() => setStep('customize')}>
          <span className={styles.templateEmoji}>✨</span>
          <span>Create My Own</span>
          <ChevronRight size={20} />
        </button>
        <h3 className={styles.templateHeading}>Start from a template</h3>
        {TEMPLATES.map(t => (
          <button
            key={t.label}
            type="button"
            className={styles.template}
            onClick={() => {
              setName(`${me.displayName}'s ${t.label.toLowerCase()}`)
              setStep('customize')
            }}
          >
            <span className={styles.templateEmoji}>{t.emoji}</span>
            <span>{t.label}</span>
            <ChevronRight size={20} />
          </button>
        ))}
      </Modal>
    )
  }

  return (
    <Modal
      title="Customize Your Server"
      subtitle="Give your new server a personality with a name and an icon. You can always change it later."
      onClose={close}
      footer={
        <>
          <Button variant="link" onClick={() => setStep('template')} className={styles.back}>
            Back
          </Button>
          <Button type="submit" form="create-server" disabled={!name.trim()}>
            Create
          </Button>
        </>
      }
    >
      <form id="create-server" onSubmit={create}>
        <div className={styles.iconPreview}>
          <ServerIcon key={icon} server={{ name: name || '?', icon: icon || undefined }} />
        </div>
        <label className={styles.field}>
          <span className={styles.label}>Server Name</span>
          <input autoFocus value={name} onChange={e => setName(e.target.value)} maxLength={100} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Icon URL (optional)</span>
          <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="https://…" />
        </label>
        <p className={styles.hint}>By creating a server, you agree to Discord’s Community Guidelines.</p>
      </form>
    </Modal>
  )
}

export default CreateServerModal
