import { GET_TOKEN_LIST } from '@/config/subgraphQueries'
import { useSubgraphData } from './useSubgraphData'

export const useTokenList = (filter: string) => {
  const { data, isLoading } = useSubgraphData(GET_TOKEN_LIST, {
    filter: filter,
  })

  return {
    tokens: (data?.tokens ?? []) as Token[],
    isLoading,
  }
}
