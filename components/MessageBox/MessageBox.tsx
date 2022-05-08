import AttachIcon from '../../icons/Attach'
import EmojiIcon from '../../icons/Emoji'
import GIFIcon from '../../icons/GIF'
import GiftIcon from '../../icons/Gift'
import StickerIcon from '../../icons/Sticker'
import styles from './MessageBox.module.sass'

const MessageBox = () => (
  <div className={styles['message-box']}>
    <div className={styles['message-box__input']}>
      <AttachIcon />
      <input type="text" placeholder="Message #general" />
      <GiftIcon />
      <GIFIcon />
      <StickerIcon />
      <EmojiIcon />
    </div>
  </div>
)

export default MessageBox
