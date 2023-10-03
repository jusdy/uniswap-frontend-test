import type { AppProps } from 'next/app'

import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from '@rainbow-me/rainbowkit'

import Layout from '@/components/layout'
import Toast from '@/components/Toast'

import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import ContextsProvider from '@/contexts'

//create provider
const { chains, provider } = configureChains([goerli], [publicProvider()])

//connectors
const { connectors } = getDefaultWallets({
  chains,
  projectId: '300b1d3efb0acc3f2eafe5ba5cc52a5a',
  appName: 'IotaOrigin',
})

//create client
const wagmiClient = createClient({
  provider,
  connectors,
  autoConnect: true,
})

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={midnightTheme({
          accentColor: '#181818',
          accentColorForeground: 'white',
        })}
        modalSize="compact"
      >
        <ContextsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toast />
        </ContextsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
