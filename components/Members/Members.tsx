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
    avatar:
      'https://cdn.discordapp.com/avatars/478649485048676383/9052050eaf681946581107dbdf357ffc.webp?size=64',
  },
  {
    id: 102,
    username: 'John',
    avatar:
      'https://cdn.discordapp.com/avatars/466047931070414858/a_11918b9d11826815818d2480d90a4b59.webp?size=64',
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
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 202,
    username: 'snortierFlamboyancies',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 203,
    username: 'coalshedDictier',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 204,
    username: 'doitkinPictorializing',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 205,
    username: 'distressfulnessesResumable',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 206,
    username: 'agreeabilityCleanup',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
  {
    id: 207,
    username: 'dolldomsPredischarges',
    avatar:
      'https://cdn.discordapp.com/avatars/729657918189994004/d0f34bbe089c033d7984beb92468b886.webp?size=64',
  },
]

const Members = () => (
  <div className={styles.members}>
    <div className={styles.members__label}>Team — {TEAM.length}</div>
    <div className={styles.members__team}>
      {TEAM.map(u => (
        <Member username={u.username} avatar={u.avatar} key={u.id} />
      ))}
    </div>
    <div className={styles.members__label}>
      Online — {ONLINE_MEMBERS.length}
    </div>
    {ONLINE_MEMBERS.map(u => (
      <Member username={u.username} avatar={u.avatar} key={u.id} />
    ))}
  </div>
)

export default Members
