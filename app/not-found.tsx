import Link from 'next/link'

const NotFound = () => (
  <div className="not-found">
    <h1>404</h1>
    <p>Wumpus looked everywhere but couldn’t find that page.</p>
    <Link href="/channels/@me">Take me home</Link>
  </div>
)

export default NotFound
