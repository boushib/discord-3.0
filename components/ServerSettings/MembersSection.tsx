'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import type { Member, Server } from '../../models'
import { kickMember, toggleMemberRole } from '../../store'
import Avatar from '../Avatar'
import { Button } from '../Modal'
import Popover, { Menu, MenuItem } from '../Popover'
import base from '../Settings/Settings.module.sass'
import styles from './ServerSettings.module.sass'

const MemberRow = ({ server, member }: { server: Server; member: Member }) => {
  const dispatch = useAppDispatch()
  const user = useSelector(s => s.users.byId[member.userId])
  const picker = usePopover()
  if (!user) return null
  const roles = server.roles.filter(r => member.roleIds.includes(r.id))
  const toggle = (roleId: string) => dispatch(toggleMemberRole({ serverId: server.id, userId: user.id, roleId }))
  const kickable = user.id !== CURRENT_USER_ID && user.id !== server.ownerId

  return (
    <div className={styles.memberRow}>
      <Avatar user={user} size={32} />
      <div className={styles.memberName}>
        <strong>{user.displayName}</strong>
        <span>{user.username}</span>
      </div>
      <div className={styles.memberRoles}>
        {roles.map(role => (
          <span key={role.id} className={styles.roleChip}>
            <button
              type="button"
              aria-label={`Remove ${role.name}`}
              className={styles.roleChipDot}
              style={{ backgroundColor: role.color }}
              onClick={() => toggle(role.id)}
            >
              <X size={10} />
            </button>
            {role.name}
          </span>
        ))}
        {server.roles.length > 0 && (
          <button type="button" className={styles.addRole} aria-label="Add role" {...picker.triggerProps}>
            <Plus size={14} />
          </button>
        )}
      </div>
      {kickable && (
        <Button variant="danger" className={styles.kick} onClick={() => dispatch(kickMember({ serverId: server.id, userId: user.id }))}>
          Kick
        </Button>
      )}
      {picker.anchor && (
        <Popover anchor={picker.anchor} placement="bottom-end" onClose={picker.close}>
          <Menu>
            {server.roles.map(role => (
              <MenuItem
                key={role.id}
                label={role.name}
                checked={member.roleIds.includes(role.id)}
                onClick={() => toggle(role.id)}
              />
            ))}
          </Menu>
        </Popover>
      )}
    </div>
  )
}

const MembersSection = ({ server }: { server: Server }) => {
  const users = useSelector(s => s.users.byId)
  const [query, setQuery] = useState('')
  const members = server.members.filter(m => {
    const u = users[m.userId]
    return u && `${u.displayName} ${u.username}`.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <>
      <h1 className={base.title}>Server Members — {server.members.length}</h1>
      <input
        className={styles.search}
        placeholder="Search members"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {members.map(m => (
        <MemberRow key={m.userId} server={server} member={m} />
      ))}
    </>
  )
}

export default MembersSection
