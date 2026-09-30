'use client'

import { useSelector } from '../../hooks'
import styles from './Sidebar.module.sass'
import SidebarIcon from './SidebarIcon'

const Sidebar = () => {
  const order = useSelector(s => s.servers.order)
  return (
    <nav className={styles.sidebar}>
      <SidebarIcon id="@me" name="Direct Messages" kind="home" />
      {order.map(id => (
        <SidebarIcon id={id} key={id} kind="server" />
      ))}
      <SidebarIcon id="add" name="Add a Server" kind="add" />
      <SidebarIcon id="explore" name="Explore Discoverable Servers" kind="explore" />
    </nav>
  )
}

export default Sidebar
