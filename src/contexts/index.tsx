import { FC, PropsWithChildren } from 'react'
import TokenListContextProvider from './TokenListContext'

const ContextsProvider: FC<PropsWithChildren> = ({ children }) => {
  return <TokenListContextProvider>{children}</TokenListContextProvider>
}

export default ContextsProvider
