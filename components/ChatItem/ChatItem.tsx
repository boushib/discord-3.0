import DEFAULT_AVATAR from '../../assets/img/discord.png'
import styles from './ChatItem.module.sass'

// const DEFAULT_AVATAR =
//   'https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png'

const ChatItem = () => (
  <div className={styles['chat-item']}>
    <div
      className={styles['chat-item__avatar']}
      style={{ backgroundImage: `url('${DEFAULT_AVATAR.src}')` }}
    ></div>
    <div>
      <div className={styles['chat-item__header']}>
        <div className={styles['chat-item__username']}>IronMan</div>
        <div className={styles['chat-item__time']}>Today at 7:09 PM</div>
      </div>
      <div className={styles['chat-item__message']}>
        Does anyone remember if they are postponing the Legendary Rookie
        Revelation drop, or did the scrap it all together?
      </div>
    </div>
  </div>
)

export default ChatItem
