import '../styles/globals.scss'

import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import store from '../app/store'

import 'bootstrap/dist/css/bootstrap.css'
import Layout from "../app/components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
