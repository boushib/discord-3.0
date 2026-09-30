import Member from './Member'
import styles from './Members.module.sass'

const TEAM = [
  {
    id: 100,
    username: 'Mustapha',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 101,
    username: 'Luke',
    avatar: '',
  },
  {
    id: 102,
    username: 'John',
    avatar: '',
  },
]

const ONLINE_MEMBERS = [
  {
    id: 200,
    username: 'pubertalHoutings',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 201,
    username: 'chutneesNonpsychiatric',
    avatar: '',
  },
  {
    id: 202,
    username: 'snortierFlamboyancies',
    avatar: '',
  },
  {
    id: 203,
    username: 'coalshedDictier',
    avatar: '',
  },
  {
    id: 204,
    username: 'doitkinPictorializing',
    avatar: '',
  },
  {
    id: 205,
    username: 'distressfulnessesResumable',
    avatar: '',
  },
  {
    id: 206,
    username: 'agreeabilityCleanup',
    avatar: '',
  },
  {
    id: 207,
    username: 'dolldomsPredischarges',
    avatar: '',
  },
]

const Members = () => (
  <div className={styles.members}>
    <div className={styles.members__label}>Team — {TEAM.length}</div>
    <div className={styles.members__team}>
      {TEAM.map(u => (
        <Member id={u.id} username={u.username} avatar={u.avatar} key={u.id} />
      ))}
    </div>
    <div className={styles.members__label}>
      Online — {ONLINE_MEMBERS.length}
    </div>
    {ONLINE_MEMBERS.map(u => (
      <Member id={u.id} username={u.username} avatar={u.avatar} key={u.id} />
    ))}
  </div>
)

export default Members
