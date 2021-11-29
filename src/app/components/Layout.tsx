import React, { FC } from 'react';
import Link from 'next/link';

import styles from './Layout.module.scss';
import Head from 'next/head';

const Layout: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>NextJS Card App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.layout}>
        <header className="mb-3">
          <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/">
                      <a className="nav-link">Home</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/list">
                      <a className="nav-link">Card list</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
