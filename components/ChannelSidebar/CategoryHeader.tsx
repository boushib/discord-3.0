import classNames from 'classnames'
import { ChevronDown, Plus } from 'lucide-react'
import Tooltip from '../Tooltip'
import styles from './ChannelSidebar.module.sass'

interface Props {
  name: string
  collapsed: boolean
  onToggle: () => void
  onCreate: () => void
}

const CategoryHeader = ({ name, collapsed, onToggle, onCreate }: Props) => (
  <div className={styles.category}>
    <button
      type="button"
      className={styles.categoryToggle}
      onClick={onToggle}
      aria-expanded={!collapsed}
    >
      <ChevronDown
        size={12}
        strokeWidth={3}
        className={classNames(styles.chevron, collapsed && styles.chevronCollapsed)}
      />
      <span>{name}</span>
    </button>
    <Tooltip label="Create Channel">
      <button type="button" className={styles.categoryAdd} onClick={onCreate} aria-label="Create Channel">
        <Plus size={18} />
      </button>
    </Tooltip>
  </div>
)

export default CategoryHeader
