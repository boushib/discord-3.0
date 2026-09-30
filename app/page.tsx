import { redirect } from 'next/navigation'

const Home = () => redirect('/channels/@me')

export default Home
