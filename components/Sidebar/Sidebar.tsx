import styles from './Sidebar.module.sass'
import SidebarIcon from './SidebarIcon'

const SERVERS = [
  { id: 1, name: 'Home', image: '' },
  {
    id: 2,
    name: 'Dapper Community',
    image:
      'https://cdn.discordapp.com/icons/943191925727567882/a_33c85fdf14a13b79a5bcb51e4ff78a63.webp?size=240"',
  },
  {
    id: 3,
    name: 'NBA Top Shot',
    image:
      'https://cdn.discordapp.com/icons/606111887876292622/a_9f046f4d8fbc8d744152c54f63f439cf.webp?size=240',
  },
  {
    id: 4,
    name: 'NFL All Day',
    image:
      'https://cdn.discordapp.com/icons/885605337925828618/68c787625b073ac1bb2f2496025bff05.webp?size=240',
  },
  {
    id: 5,
    name: 'Eternal',
    image:
      'https://cdn.discordapp.com/icons/831590473595879446/436041d69db87eac7c5a18384b0bc7ff.webp?size=240',
  },
  {
    id: 6,
    name: "Assassin's Creed",
    image:
      'https://cdn.discordapp.com/icons/215838530889318401/761c4e7c15397b59b227168a6f692075.webp?size=240',
  },
  {
    id: 7,
    name: 'Rocket League',
    image:
      'https://cdn.discordapp.com/icons/152517096104919042/bee2a0be2a8dd1328bd926cfd1c9a0c2.webp?size=240',
  },
]

const Sidebar = () => (
  <div className={styles.sidebar}>
    {SERVERS.map(s => (
      <SidebarIcon
        image={s.image}
        isActive={s.id === 1}
        isPrimary={s.id === 1}
        key={s.id}
      />
    ))}
  </div>
)

export default Sidebar
