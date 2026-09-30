'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import type { GiftPlan } from '../../constants/expressions'
import { useAppDispatch } from '../../hooks'
import { closeModal, sendMessage } from '../../store'
import { simulateGiftClaim } from '../../store/simulate'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const PLANS: { plan: GiftPlan; price: number; perks: string }[] = [
  { plan: 'Nitro', price: 9.99, perks: 'Custom emoji anywhere, HD streaming, bigger uploads' },
  { plan: 'Nitro Basic', price: 2.99, perks: 'Custom emoji anywhere, 50 MB uploads' },
]

const GiftModal = ({ channelId }: { channelId: string }) => {
  const dispatch = useAppDispatch()
  const [plan, setPlan] = useState<GiftPlan>('Nitro')
  const [months, setMonths] = useState(1)
  const close = () => dispatch(closeModal())
  const price = PLANS.find(p => p.plan === plan)!.price * (months === 12 ? 10 : 1)

  const send = () => {
    const action = dispatch(
      sendMessage({ channelId, authorId: CURRENT_USER_ID, content: '', gift: { plan, months } })
    )
    dispatch(simulateGiftClaim(channelId, action.payload.id))
    close()
  }

  return (
    <Modal
      title="Gift Nitro"
      subtitle="Pick a perk-packed gift for your friends. (It’s a demo — nobody gets charged.)"
      onClose={close}
      size="medium"
      footer={
        <>
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button onClick={send}>Send Gift · ${price.toFixed(2)}</Button>
        </>
      }
    >
      <div className={styles.types}>
        {PLANS.map(p => (
          <label key={p.plan} className={classNames(styles.type, plan === p.plan && styles.typeActive)}>
            <input type="radio" name="plan" className="sr-only" checked={plan === p.plan} onChange={() => setPlan(p.plan)} />
            <span className={styles.giftIcon}>{p.plan === 'Nitro' ? '💎' : '✨'}</span>
            <span className={styles.typeText}>
              <span className={styles.typeLabel}>{p.plan}</span>
              <span className={styles.typeDescription}>{p.perks}</span>
            </span>
            <span className={styles.radio} />
          </label>
        ))}
      </div>
      <span className={styles.label}>Duration</span>
      <div className={styles.segmented}>
        {[1, 12].map(m => (
          <button
            key={m}
            type="button"
            className={classNames(styles.segment, months === m && styles.segmentActive)}
            onClick={() => setMonths(m)}
          >
            {m === 1 ? '1 Month' : '1 Year'}
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default GiftModal
