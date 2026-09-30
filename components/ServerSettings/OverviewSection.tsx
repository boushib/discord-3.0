'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { useAppDispatch } from '../../hooks'
import type { Server } from '../../models'
import { updateServer } from '../../store'
import { Button } from '../Modal'
import ServerIcon from '../ServerRail/ServerIcon'
import base from '../Settings/Settings.module.sass'
import styles from './ServerSettings.module.sass'

const BANNERS = ['#5865f2', '#7c3aed', '#db2777', '#16a34a', '#ea580c', '#0891b2', '#111827', '#b91c1c']

const OverviewSection = ({ server }: { server: Server }) => {
  const dispatch = useAppDispatch()
  const initial = { name: server.name, icon: server.icon ?? '', bannerColor: server.bannerColor ?? '#5865f2' }
  const [draft, setDraft] = useState(initial)
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial)

  return (
    <>
      <h1 className={base.title}>Server Overview</h1>
      <div className={styles.overview}>
        <div className={styles.iconPreview}>
          <ServerIcon key={draft.icon} server={{ name: draft.name || '?', icon: draft.icon || undefined }} />
        </div>
        <div className={styles.overviewFields}>
          <label className={base.field}>
            <span className={base.fieldLabel}>Server Name</span>
            <input value={draft.name} maxLength={100} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className={base.field}>
            <span className={base.fieldLabel}>Icon URL</span>
            <input
              value={draft.icon}
              placeholder="https://… (leave empty for initials)"
              onChange={e => setDraft({ ...draft, icon: e.target.value })}
            />
          </label>
        </div>
      </div>
      <div className={base.field}>
        <span className={base.fieldLabel}>Banner Color</span>
        <div className={base.swatches}>
          {BANNERS.map(color => (
            <button
              key={color}
              type="button"
              aria-label={`Banner ${color}`}
              className={classNames(base.swatch, draft.bannerColor === color && base.swatchActive)}
              style={{ backgroundColor: color }}
              onClick={() => setDraft({ ...draft, bannerColor: color })}
            />
          ))}
        </div>
      </div>

      {dirty && (
        <div className={base.unsaved}>
          <span>Careful — you have unsaved changes!</span>
          <Button variant="link" onClick={() => setDraft(initial)}>
            Reset
          </Button>
          <Button
            variant="success"
            disabled={!draft.name.trim()}
            onClick={() =>
              dispatch(
                updateServer({
                  serverId: server.id,
                  changes: { name: draft.name.trim(), icon: draft.icon.trim() || undefined, bannerColor: draft.bannerColor },
                })
              )
            }
          >
            Save Changes
          </Button>
        </div>
      )}
    </>
  )
}

export default OverviewSection
