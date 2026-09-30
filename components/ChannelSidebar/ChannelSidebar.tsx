'use client'

import { useParams } from 'next/navigation'
import { useAppDispatch, useSelector } from '../../hooks'
import { openModal, toggleCategory } from '../../store'
import UserPanel from '../UserPanel'
import VoicePanel from '../UserPanel/VoicePanel'
import CategoryHeader from './CategoryHeader'
import ChannelItem from './ChannelItem'
import ServerHeader from './ServerHeader'
import styles from './ChannelSidebar.module.sass'

const ChannelSidebar = ({ serverId }: { serverId: string }) => {
  const dispatch = useAppDispatch()
  const server = useSelector(s => s.servers.byId[serverId])
  const collapsed = useSelector(s => s.prefs.collapsedCategories)
  const { channelId } = useParams<{ channelId?: string }>()

  if (!server) return <aside className={styles.sidebar} data-panel="nav" />

  const sections = [
    { category: null, channels: server.channels.filter(c => c.categoryId === null) },
    ...server.categories.map(category => ({
      category,
      channels: server.channels.filter(c => c.categoryId === category.id),
    })),
  ]

  return (
    <aside className={styles.sidebar} aria-label={`${server.name} channels`} data-panel="nav">
      <ServerHeader server={server} />
      <div className={`${styles.scroller} scroller`}>
        {sections.map(({ category, channels }) => {
          if (!category && !channels.length) return null
          const isCollapsed = category !== null && collapsed.includes(category.id)
          return (
            <section key={category?.id ?? 'uncategorized'} className={styles.section}>
              {category && (
                <CategoryHeader
                  name={category.name}
                  collapsed={isCollapsed}
                  onToggle={() => dispatch(toggleCategory(category.id))}
                  onCreate={() =>
                    dispatch(openModal({ type: 'createChannel', serverId, categoryId: category.id }))
                  }
                />
              )}
              {channels
                .filter(c => !isCollapsed || c.id === channelId)
                .map(channel => (
                  <ChannelItem
                    key={channel.id}
                    server={server}
                    channel={channel}
                    active={channel.id === channelId}
                  />
                ))}
            </section>
          )
        })}
      </div>
      <VoicePanel />
      <UserPanel />
    </aside>
  )
}

export default ChannelSidebar
