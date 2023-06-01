import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { setupStore } from '../store/store'
import { Layout } from 'antd'
import styles from '../styles/app.module.scss'
import Head from 'next/head'
import React from 'react'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar/Navbar';

const store = setupStore();

export default function App({
  Component,
  pageProps
}: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AEyeWitness</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
      </Head>

      <Layout className={styles.MainLayout}>
        <Provider store={store}>
          <Navbar />
          <div className={styles.app}>
            <div className={styles.appContainer}>
              <Component {...pageProps} />
            </div>
          </div>
        </Provider>
      </Layout>

    </>
  )
}
