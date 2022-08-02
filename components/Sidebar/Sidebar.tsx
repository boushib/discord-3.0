import { useState } from 'react'
import styles from './Sidebar.module.sass'
import SidebarIcon from './SidebarIcon'

const SERVERS = [
  {
    id: 'd47c81f1-ae9a-4bb2-9dba-0ab56ae39458',
    name: 'Home',
    isPrimary: true,
  },
  {
    id: '1838bc7e-adf2-4462-9e08-471e6a3e8f37',
    name: 'Dapper Community',
    image:
      'https://cdn.discordapp.com/icons/943191925727567882/a_33c85fdf14a13b79a5bcb51e4ff78a63.webp?size=240"',
  },
  {
    id: 'bdb765bd-70b3-4bd6-a5d5-5a385c27b5bd',
    name: 'NBA Top Shot',
    image:
      'https://cdn.discordapp.com/icons/606111887876292622/a_9f046f4d8fbc8d744152c54f63f439cf.webp?size=240',
  },
  {
    id: '4326bb7a-4d18-4378-a4a4-9f3cf61dc353',
    name: 'NFL All Day',
    image:
      'https://cdn.discordapp.com/icons/885605337925828618/68c787625b073ac1bb2f2496025bff05.webp?size=240',
  },
  {
    id: 'f4ef7495-d728-4c34-9c54-06204db0220a',
    name: 'Eternal',
    image:
      'https://cdn.discordapp.com/icons/831590473595879446/436041d69db87eac7c5a18384b0bc7ff.webp?size=240',
  },
  {
    id: '1e0dddd7-5213-4893-bf47-84fe9228a055',
    name: "Assassin's Creed",
    image:
      'https://cdn.discordapp.com/icons/215838530889318401/761c4e7c15397b59b227168a6f692075.webp?size=240',
  },
  {
    id: 'f475fb60-ce9b-46c3-84fc-da1239e246ec',
    name: 'Rocket League',
    image:
      'https://external-preview.redd.it/fF3j2lwIwYWKKJJhyvdl_Oa_iYJtgVNV4jilcYrQiBE.jpg?auto=webp&s=e2b17d9eb8c59afc8c65b01dc0138f9fb4ae41ea',
  },
  {
    id: 'c47388ce-2ce5-44b9-af21-84f6bdb3e4ca',
    name: 'Add Server',
    icon: 'add',
  },
  {
    id: 'e60e0a04-cad0-4014-9201-a1d5898eafcd',
    name: 'Explore Public Servers',
    icon: 'explore',
  },
  {
    id: '040d8f27-2236-4059-9d8f-e23c0ad989f9',
    name: 'Download Apps',
    icon: 'download',
  },
]

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState(SERVERS[0].id)
  return (
    <div className={styles.sidebar}>
      {SERVERS.map(s => (
        <SidebarIcon
          image={s.image}
          icon={s.icon}
          isActive={s.id === currentTab}
          isPrimary={s.isPrimary}
          key={s.id}
        />
      ))}
    </div>
  )
}

export default Sidebar
