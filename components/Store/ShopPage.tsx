'use client'

import classNames from 'classnames'
import { DECORATIONS } from '../../constants/shop'
import { useAppDispatch, useSelector } from '../../hooks'
import { updateProfile } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import Avatar from '../Avatar'
import MobileNavButton from '../MobileNavButton'
import styles from './Store.module.sass'

const ShopPage = () => {
  const dispatch = useAppDispatch()
  const me = useSelector(selectCurrentUser)
  const owned = me.ownedDecorations ?? []

  return (
    <div className={`${styles.page} scroller`}>
      <div className={styles.mobileBar}>
        <MobileNavButton />
      </div>
      <section className={classNames(styles.hero, styles.shopHero)}>
        <h1>Shop</h1>
        <p>Avatar decorations that follow you everywhere: messages, member lists and profiles.</p>
      </section>
      <div className={styles.items}>
        {DECORATIONS.map(item => {
          const isOwned = owned.includes(item.id)
          const equipped = me.decoration === item.id
          return (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemPreview}>
                <Avatar user={{ ...me, decoration: item.id }} size={80} />
              </div>
              <h3>{item.name}</h3>
              <div className={styles.itemPrice}>{isOwned ? 'Owned' : `$${item.price.toFixed(2)}`}</div>
              <button
                type="button"
                className={classNames(styles.buy, equipped && styles.equipped)}
                onClick={() =>
                  dispatch(
                    updateProfile({
                      ownedDecorations: isOwned ? owned : [...owned, item.id],
                      decoration: equipped ? undefined : item.id,
                    })
                  )
                }
              >
                {equipped ? 'Unequip' : isOwned ? 'Equip' : 'Buy & Equip'}
              </button>
            </article>
          )
        })}
      </div>
      <p className={styles.note}>Demo store: purchases are free and saved in this browser.</p>
    </div>
  )
}

export default ShopPage
