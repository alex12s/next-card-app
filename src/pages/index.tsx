import type { NextPage } from 'next'
import Head from 'next/head'

import Counter from '../features/counter/Counter'
import styles from '../styles/Home.module.css'
import CardForm from "../features/card/CardForm";

const IndexPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        Here will be navigation
      </header>
      <CardForm />
      <footer>
        Footer
      </footer>
    </div>
  )
}

export default IndexPage
