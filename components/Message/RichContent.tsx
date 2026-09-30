'use client'

import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import type { Message } from '../../models'
import { claimGift } from '../../store'
import styles from './Message.module.sass'

const IMAGE_URL = /^https?:\/\/\S+\.(gif|png|jpe?g|webp)(\?\S*)?$/i

/** A message that's only an image link (e.g. a GIF) renders as the image */
export const isImageLink = (content: string) => IMAGE_URL.test(content.trim())

export const ImageEmbed = ({ url }: { url: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote images
  <img src={url} alt="" className={styles.embedImage} loading="lazy" />
)

export const StickerView = ({ sticker }: { sticker: NonNullable<Message['sticker']> }) => (
  <div className={styles.sticker} title={sticker.name} role="img" aria-label={`Sticker: ${sticker.name}`}>
    {sticker.emoji}
  </div>
)

export const GiftEmbed = ({ message }: { message: Message }) => {
  const dispatch = useAppDispatch()
  const gift = message.gift!
  const claimer = useSelector(s => (gift.claimedBy ? s.users.byId[gift.claimedBy] : undefined))
  const sentByMe = message.authorId === CURRENT_USER_ID

  return (
    <div className={styles.gift}>
      <div className={styles.giftTitle}>
        {sentByMe ? 'You sent a gift' : 'You’ve been gifted a subscription!'}
      </div>
      <div className={styles.giftBody}>
        <span className={styles.giftIcon}>{gift.plan === 'Nitro' ? '💎' : '✨'}</span>
        <div>
          <div className={styles.giftPlan}>{gift.plan}</div>
          <div className={styles.giftDuration}>{gift.months === 12 ? '1 year' : '1 month'}</div>
        </div>
        {claimer ? (
          <span className={styles.giftClaimed}>Claimed by {claimer.displayName}</span>
        ) : sentByMe ? (
          <span className={styles.giftWaiting}>Waiting to be claimed…</span>
        ) : (
          <button
            type="button"
            className={styles.giftClaim}
            onClick={() =>
              dispatch(claimGift({ channelId: message.channelId, messageId: message.id, userId: CURRENT_USER_ID }))
            }
          >
            Claim
          </button>
        )}
      </div>
    </div>
  )
}
