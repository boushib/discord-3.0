'use client'

import { useState } from 'react'
import { initials } from '../../lib/initials'
import type { Server } from '../../models'
import styles from './ServerRail.module.sass'

const ServerIcon = ({ server }: { server: Pick<Server, 'name' | 'icon' | 'iconPosition'> }) => {
  const [failed, setFailed] = useState(false)
  if (server.icon && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary server icon URLs
      <img
        src={server.icon}
        alt=""
        className={styles.image}
        style={server.iconPosition ? { objectPosition: server.iconPosition } : undefined}
        onError={() => setFailed(true)}
      />
    )
  }
  const text = initials(server.name)
  return (
    <span className={styles.initials} style={{ fontSize: text.length > 3 ? 12 : 16 }}>
      {text}
    </span>
  )
}

export default ServerIcon
