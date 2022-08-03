import { SERVERS } from '../../constants'
import styles from './Sidebar.module.sass'
import SidebarIcon from './SidebarIcon'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      {SERVERS.map(server => (
        <SidebarIcon server={server} key={server.id} />
      ))}
    </div>
  )
}

export default Sidebar
