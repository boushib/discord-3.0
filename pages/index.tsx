import Head from 'next/head'
import Server from '../components/Server'
import Sidebar from '../components/Sidebar'

const Home = () => (
  <>
    <Head>
      <title>Discord 3.0</title>
    </Head>
    <div className="app">
      <Sidebar />
      <Server />
    </div>
  </>
)

export default Home
