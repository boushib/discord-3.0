'use client'

import { useSelector } from '../../hooks'
import type { Member as MemberType, Server } from '../../models'
import Member from './Member'
import styles from './Members.module.sass'

const byName = (users: Record<string, { displayName: string }>) => (a: MemberType, b: MemberType) =>
  users[a.userId].displayName.localeCompare(users[b.userId].displayName)

const Members = ({ server }: { server: Server }) => {
  const users = useSelector(s => s.users.byId)
  const members = server.members.filter(m => users[m.userId])
  const sort = byName(users)

  const offline = members.filter(m => users[m.userId].status === 'offline').sort(sort)
  const online = members.filter(m => users[m.userId].status !== 'offline')

  // Online members are grouped under their highest hoisted role, like Discord
  const hoisted = server.roles.filter(r => r.hoist)
  const assigned = new Set<string>()
  const groups = hoisted.map(role => {
    const list = online.filter(m => !assigned.has(m.userId) && m.roleIds.includes(role.id)).sort(sort)
    list.forEach(m => assigned.add(m.userId))
    return { id: role.id, label: role.name, members: list }
  })
  groups.push({ id: 'online', label: 'Online', members: online.filter(m => !assigned.has(m.userId)).sort(sort) })
  groups.push({ id: 'offline', label: 'Offline', members: offline })

  return (
    <aside className={`${styles.members} scroller`} aria-label="Members">
      {groups
        .filter(g => g.members.length)
        .map(group => (
          <section key={group.id}>
            <h3 className={styles.label}>
              {group.label} — {group.members.length}
            </h3>
            {group.members.map(m => (
              <Member key={m.userId} user={users[m.userId]} server={server} offline={group.id === 'offline'} />
            ))}
          </section>
        ))}
    </aside>
  )
}

export default Members
