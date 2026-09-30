'use client'

import classNames from 'classnames'
import { Check, Sparkles } from 'lucide-react'
import { useAppDispatch, useSelector } from '../../hooks'
import { updateProfile } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import MobileNavButton from '../MobileNavButton'
import styles from './Store.module.sass'

const PLANS = [
  {
    id: 'basic',
    name: 'Nitro Basic',
    price: '$2.99',
    perks: ['Custom emoji anywhere', '50 MB uploads', 'Nitro badge on your profile'],
  },
  {
    id: 'nitro',
    name: 'Nitro',
    price: '$9.99',
    perks: [
      'Everything in Basic',
      '500 MB uploads',
      'HD video and screen share',
      'Animated avatar & profile themes',
      '2 server boosts',
    ],
  },
]

const NitroPage = () => {
  const dispatch = useAppDispatch()
  const me = useSelector(selectCurrentUser)

  return (
    <div className={`${styles.page} scroller`}>
      <div className={styles.mobileBar}>
        <MobileNavButton />
      </div>
      <section className={classNames(styles.hero, styles.nitroHero)}>
        <Sparkles size={40} />
        <h1>Unleash more fun with Nitro</h1>
        <p>Subscribe to upgrade your emoji, personalize your profile, share bigger files and more.</p>
        {me.premium && <div className={styles.active}>💎 Your Nitro subscription is active</div>}
      </section>
      <div className={styles.plans}>
        {PLANS.map(plan => (
          <article key={plan.id} className={classNames(styles.plan, plan.id === 'nitro' && styles.planFeatured)}>
            {plan.id === 'nitro' && <span className={styles.popular}>Most popular</span>}
            <h2>{plan.name}</h2>
            <div className={styles.price}>
              {plan.price}
              <span>/ month</span>
            </div>
            <ul>
              {plan.perks.map(perk => (
                <li key={perk}>
                  <Check size={16} /> {perk}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.subscribe}
              onClick={() => dispatch(updateProfile({ premium: !me.premium }))}
            >
              {me.premium ? 'Cancel Subscription' : 'Subscribe'}
            </button>
          </article>
        ))}
      </div>
      <p className={styles.note}>This is a demo: subscribing only adds a Nitro badge to your profile. No payment is taken.</p>
    </div>
  )
}

export default NitroPage
