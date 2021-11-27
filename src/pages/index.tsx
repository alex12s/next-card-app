import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link'

import styles from '../styles/Home.module.css';
import CardForm from '../features/card/CardForm';
import CardList from '../features/card/CardList';

const IndexPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NextJS Card App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
          Here will be navigation
          <Link href="/list"><a>Card list</a></Link>
      </header>
      <CardForm />
      <footer>Footer</footer>
    </div>
  );
};

export default IndexPage;
