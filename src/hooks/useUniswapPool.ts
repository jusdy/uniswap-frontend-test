import { useSubgraphData } from '@/hooks/useSubgraphData'
import { GET_POOL } from '../config/subgraphQueries'

export const useUniswapPool = (
  token0: AddressString,
  token1: AddressString
) => {
  const { data: pData, isLoading: pIsLoading } = useSubgraphData(GET_POOL, {
    token0,
    token1,
  })
  const { data: nData, isLoading: nIsLoading } = useSubgraphData(GET_POOL, {
    token0: token1,
    token1: token0,
  })

  return {
    data: [
      ...(pData?.pools ?? []),
      ...(nData?.pools?.map((pool: Pool) => ({
        ...pool,
        token0Price: pool.token1Price,
        token1Price: pool.token0Price,
      })) ?? []),
    ] as Pool[],
    isLoading: pIsLoading && nIsLoading,
  }
}
