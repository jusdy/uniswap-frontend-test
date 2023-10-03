import gql from 'graphql-tag'

export const GET_TOKEN_LIST = gql`
  query getTokenList($filter: String = "") {
    tokens(
      where: {
        or: [
          { name_contains_nocase: $filter }
          { symbol_contains_nocase: $filter }
        ]
      }
      first: 100
      orderBy: txCount
      orderDirection: desc
    ) {
      id
      name
      symbol
      decimals
    }
  }
`

export const GET_POOL = gql`
  query getPool($token0: String, $token1: String) {
    pools(where: { token0_: { id: $token0 }, token1_: { id: $token1 } }) {
      id
      feesUSD
      feeTier
      liquidity
      token0Price
      token1Price
    }
  }
`

export const GET_SWAP_HISTORY = gql`
  query getSwapHistory($address: String) {
    swaps(
      where: { origin: $address }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
      amount0
      amount1
      timestamp
    }
  }
`
