'use client'

import classNames from 'classnames'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DISCOVERABLE, DISCOVERY_CATEGORIES, type DiscoveryCategory } from '../../constants/discovery'
import { useAppDispatch, useSelector } from '../../hooks'
import { serverHref } from '../../lib/routes'
import { joinServer } from '../../store'
import MobileNavButton from '../MobileNavButton'
import ServerIcon from '../ServerRail/ServerIcon'
import styles from './Discovery.module.sass'

const compact = new Intl.NumberFormat(undefined, { notation: 'compact' })

const Discovery = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const joined = useSelector(s => s.servers.byId)
  const [category, setCategory] = useState<DiscoveryCategory | 'home'>('home')
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results = DISCOVERABLE.filter(
    d =>
      (category === 'home' || d.category === category) &&
      (!q || `${d.server.name} ${d.description}`.toLowerCase().includes(q))
  )

  return (
    <div className={styles.page}>
      <nav className={styles.sidebar} data-panel="nav">
        <h2 className={styles.sidebarTitle}>Discover</h2>
        {DISCOVERY_CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            className={classNames(styles.category, category === c.id && styles.categoryActive)}
            onClick={() => setCategory(c.id)}
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </nav>
      <main className={`${styles.main} scroller`} data-panel="content">
        <div className={styles.mobileBar}>
          <MobileNavButton />
        </div>
        <section className={styles.hero}>
          <h1>Find your community on Discord</h1>
          <p>From gaming, to music, to learning, there’s a place for you.</p>
          <label className={styles.search}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Explore communities" />
            <Search size={20} />
          </label>
        </section>
        <h2 className={styles.heading}>
          {q ? `Results for “${query}”` : category === 'home' ? 'Featured communities' : DISCOVERY_CATEGORIES.find(c => c.id === category)?.label}
        </h2>
        <div className={styles.grid}>
          {results.map(({ server, description, members, online }) => {
            const isJoined = !!joined[server.id]
            return (
              <article key={server.id} className={styles.card}>
                <div className={styles.banner} style={{ backgroundColor: server.bannerColor }} />
                <div className={styles.icon}>
                  <ServerIcon server={server} />
                </div>
                <div className={styles.body}>
                  <h3>{server.name}</h3>
                  <p>{description}</p>
                  <div className={styles.stats}>
                    <span className={styles.online} /> {compact.format(online)} Online
                    <span className={styles.members} /> {compact.format(members)} Members
                  </div>
                  <button
                    type="button"
                    className={classNames(styles.join, isJoined && styles.joined)}
                    onClick={() => {
                      if (!isJoined) dispatch(joinServer(server))
                      router.push(serverHref(server.id))
                    }}
                  >
                    {isJoined ? 'Joined — Open' : 'Join Server'}
                  </button>
                </div>
              </article>
            )
          })}
          {results.length === 0 && <p className={styles.empty}>No communities match that search.</p>}
        </div>
      </main>
    </div>
  )
}

export default Discovery
