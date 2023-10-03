type AddressString = `0x${string}` | undefined

interface Token {
  id: AddressString
  name: string
  symbol: string
  decimals: string
}

interface Pool {
  id: AddressString
  feeTier: string
  feesUSD: string
  liquidity: string
  token0Price: string
  token1Price: string
}

interface SwapHistory {
  id: string
  amount0: string
  amount1: string
  timestamp: string
  token0: Token
  token1: Token
}
