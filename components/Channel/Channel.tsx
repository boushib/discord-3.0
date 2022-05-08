import MessageBox from '../MessageBox/MessageBox'
import ChannelBody from './ChannelBody'
import ChannelHeader from './ChannelHeader'
import styles from './Channel.module.sass'

const Channel = () => (
  <div className={styles.channel}>
    <ChannelHeader />
    <ChannelBody />
    <MessageBox />
  </div>
)

export default Channel
