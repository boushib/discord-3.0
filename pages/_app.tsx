import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../styles/globals.sass'

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
)

export default App
