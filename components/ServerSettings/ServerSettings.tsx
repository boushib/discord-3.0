'use client'

import classNames from 'classnames'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch, useSelector } from '../../hooks'
import { closeModal, leaveServer } from '../../store'
import Modal, { Button } from '../Modal'
import base from '../Settings/Settings.module.sass'
import ExpressionsSection from './ExpressionsSection'
import MembersSection from './MembersSection'
import OverviewSection from './OverviewSection'
import RolesSection from './RolesSection'

type Section = 'overview' | 'roles' | 'emoji' | 'stickers' | 'members'

const ServerSettings = ({ serverId }: { serverId: string }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const server = useSelector(s => s.servers.byId[serverId])
  const [section, setSection] = useState<Section>('overview')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const close = () => dispatch(closeModal())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !confirmDelete && dispatch(closeModal())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, confirmDelete])

  if (!server) return null

  const items: { id: Section; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'roles', label: 'Roles' },
    { id: 'emoji', label: 'Emoji' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'members', label: 'Members' },
  ]

  return createPortal(
    <div className={base.settings} role="dialog" aria-modal="true" aria-label="Server Settings">
      <nav className={`${base.sidebar} scroller`}>
        <div className={base.sidebarInner}>
          <div>
            <h2 className={base.navHeading}>{server.name}</h2>
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                className={classNames(base.navItem, section === item.id && base.navItemActive)}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div className={base.navSeparator} />
          </div>
          <button
            type="button"
            className={classNames(base.navItem, base.navDanger)}
            onClick={() => setConfirmDelete(true)}
          >
            Delete Server
          </button>
        </div>
      </nav>

      <main className={`${base.content} scroller`}>
        <div className={base.contentInner}>
          {section === 'overview' && <OverviewSection server={server} />}
          {section === 'roles' && <RolesSection server={server} />}
          {section === 'emoji' && <ExpressionsSection key="emoji" server={server} kind="emoji" />}
          {section === 'stickers' && <ExpressionsSection key="sticker" server={server} kind="sticker" />}
          {section === 'members' && <MembersSection server={server} />}
        </div>
        <div className={base.closeColumn}>
          <button type="button" className={base.close} onClick={close} aria-label="Close server settings">
            <X size={18} />
          </button>
          <span className={base.closeHint}>ESC</span>
        </div>
      </main>

      {confirmDelete && (
        <Modal
          title={`Delete '${server.name}'`}
          subtitle="This deletes the server, its channels and messages. It can’t be undone."
          onClose={() => setConfirmDelete(false)}
          footer={
            <>
              <Button variant="link" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  close()
                  router.push('/channels/@me')
                  dispatch(leaveServer(serverId))
                }}
              >
                Delete Server
              </Button>
            </>
          }
        />
      )}
    </div>,
    document.body
  )
}

export default ServerSettings
