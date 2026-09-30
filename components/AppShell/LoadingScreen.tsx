import { LOADING_TIPS } from '../../constants'
import DiscordIcon from '../../icons/Discord'
import styles from './LoadingScreen.module.sass'

const LoadingScreen = () => (
  <div className={styles.loading}>
    <div className={styles.logo}>
      <DiscordIcon width={64} height={46} />
    </div>
    <div className={styles.label}>Did you know</div>
    <p className={styles.tip}>{LOADING_TIPS[0]}</p>
  </div>
)

export default LoadingScreen
