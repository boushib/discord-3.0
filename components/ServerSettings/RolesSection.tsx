'use client'

import classNames from 'classnames'
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '../../hooks'
import type { Server } from '../../models'
import { createRole, deleteRole, moveRole, updateRole } from '../../store'
import { Button } from '../Modal'
import base from '../Settings/Settings.module.sass'
import styles from './ServerSettings.module.sass'

const COLORS = ['#99aab5', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e91e63', '#f1c40f', '#e67e22', '#e74c3c', '#f47b67']

const RolesSection = ({ server }: { server: Server }) => {
  const dispatch = useAppDispatch()
  const [selectedId, setSelectedId] = useState<string | null>(server.roles[0]?.id ?? null)
  const selected = server.roles.find(r => r.id === selectedId) ?? server.roles[0]
  const update = (changes: Parameters<typeof updateRole>[0]['changes']) =>
    selected && dispatch(updateRole({ serverId: server.id, roleId: selected.id, changes }))

  return (
    <>
      <h1 className={base.title}>Roles</h1>
      <p className={styles.help}>
        Roles give members a color and, when hoisted, their own section in the member list. Higher roles win the
        name color.
      </p>
      <div className={styles.roles}>
        <div className={styles.roleList}>
          <Button
            onClick={() => {
              const action = dispatch(createRole(server.id))
              setSelectedId(action.payload.role.id)
            }}
          >
            <span className={styles.buttonInner}>
              <Plus size={16} /> Create Role
            </span>
          </Button>
          {server.roles.map((role, i) => (
            <div
              key={role.id}
              className={classNames(styles.roleRow, selected?.id === role.id && styles.roleRowActive)}
            >
              <button type="button" className={styles.roleName} onClick={() => setSelectedId(role.id)}>
                <span className={styles.roleDot} style={{ backgroundColor: role.color }} />
                {role.name}
                <span className={styles.roleCount}>
                  {server.members.filter(m => m.roleIds.includes(role.id)).length}
                </span>
              </button>
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => dispatch(moveRole({ serverId: server.id, roleId: role.id, direction: -1 }))}
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === server.roles.length - 1}
                onClick={() => dispatch(moveRole({ serverId: server.id, roleId: role.id, direction: 1 }))}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          ))}
          {server.roles.length === 0 && <p className={styles.help}>No roles yet.</p>}
        </div>

        {selected && (
          <div className={styles.roleEditor}>
            <label className={base.field}>
              <span className={base.fieldLabel}>Role Name</span>
              <input value={selected.name} maxLength={100} onChange={e => update({ name: e.target.value })} />
            </label>
            <div className={base.field}>
              <span className={base.fieldLabel}>Role Color</span>
              <div className={base.swatches}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Color ${color}`}
                    className={classNames(base.swatch, selected.color === color && base.swatchActive)}
                    style={{ backgroundColor: color }}
                    onClick={() => update({ color })}
                  />
                ))}
                <input
                  type="color"
                  aria-label="Custom role color"
                  className={base.colorInput}
                  value={selected.color ?? '#99aab5'}
                  onChange={e => update({ color: e.target.value })}
                />
              </div>
            </div>
            <label className={styles.toggleRow}>
              <span>
                <span className={styles.toggleLabel}>Display role members separately</span>
                <span className={styles.help}>Show this role as its own section in the member list.</span>
              </span>
              <input
                type="checkbox"
                className={styles.toggle}
                checked={selected.hoist}
                onChange={e => update({ hoist: e.target.checked })}
              />
            </label>
            <Button
              variant="danger"
              onClick={() => {
                dispatch(deleteRole({ serverId: server.id, roleId: selected.id }))
                setSelectedId(null)
              }}
            >
              <span className={styles.buttonInner}>
                <Trash size={16} /> Delete Role
              </span>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default RolesSection
