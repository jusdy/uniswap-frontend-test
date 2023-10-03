import { GET_TOKEN_LIST } from '@/config/subgraphQueries'
import { useSubgraphData } from '@/hooks/useSubgraphData'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'

interface ContextType {
  tokenList: Token[]
  isLoading: boolean
}
export const TokenListContext = createContext<ContextType>({
  tokenList: [],
  isLoading: false,
})

const TokenListContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [tokenList, setTokenList] = useState<Token[]>([])

  const { data, isLoading } = useSubgraphData(GET_TOKEN_LIST)

  // Set up the timeout.
  useEffect(() => {
    if (data?.tokens) {
      setTokenList(data?.tokens)
    }
  }, [data])

  return (
    <TokenListContext.Provider value={{ tokenList, isLoading }}>
      {children}
    </TokenListContext.Provider>
  )
}

export default TokenListContextProvider
