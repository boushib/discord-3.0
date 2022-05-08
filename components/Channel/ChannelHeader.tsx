import ChannelIcon from '../../icons/Channel'
import InboxIcon from '../../icons/Inbox'
import InfoIcon from '../../icons/Info'
import MembersIcon from '../../icons/Members'
import styles from './Channel.module.sass'

const ChannelHeader = () => (
  <div className={styles.channel__header}>
    <div className={styles.channel__header__name}>
      <ChannelIcon /> 🌵 General
    </div>
    <div className={styles.channel__header__tail}>
      <MembersIcon />
      <InboxIcon />
      <InfoIcon />
    </div>
  </div>
)

export default ChannelHeader
