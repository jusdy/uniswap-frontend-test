import { SWAP_ROUTER_ADDRESS } from '@/config'
import { useSigner, useContract, erc20ABI, useAccount } from 'wagmi'
import { abi as UniswapRouterAbi } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import { useCallback, useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

export const useSwap = (
  token0: AddressString,
  token1: AddressString,
  amount: BigNumber
) => {
  const [balance, setBalance] = useState<BigNumber>()
  const [allowance, setAllowance] = useState<BigNumber>()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const fromTokenContract = useContract({
    address: token0,
    abi: erc20ABI,
    signerOrProvider: signer,
  })

  const swapRouterContract = useContract({
    address: SWAP_ROUTER_ADDRESS,
    abi: UniswapRouterAbi,
    signerOrProvider: signer,
  })

  const approve = useCallback(async () => {
    if (!fromTokenContract) {
      throw Error('Invalid token: from')
    }

    return await fromTokenContract.approve(SWAP_ROUTER_ADDRESS, amount)
  }, [amount, fromTokenContract])

  const swapInputSingle = useCallback(
    async (fee: string) => {
      if (!token0 || !token1) {
        throw Error('Invalid tokens')
      }
      if (!swapRouterContract) {
        return
      }

      const params = {
        tokenIn: token0,
        tokenOut: token1,
        fee: fee,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 30,
        amountIn: amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      }

      const gasLimit =
        await swapRouterContract.estimateGas.exactInputSingle(params)

      return await swapRouterContract.exactInputSingle(params, {
        gasLimit: gasLimit,
      })
    },
    [address, amount, swapRouterContract, token0, token1]
  )

  useEffect(() => {
    if (!fromTokenContract || !address) {
      return
    }

    ;(async () => {
      setBalance(await fromTokenContract.balanceOf(address))
    })()
  }, [address, fromTokenContract])

  useEffect(() => {
    if (!fromTokenContract || !address) {
      return
    }

    ;(async () => {
      setAllowance(
        await fromTokenContract.allowance(address, SWAP_ROUTER_ADDRESS)
      )
    })()
  }, [address, fromTokenContract])

  return {
    balance,
    allowance,
    approve,
    swapInputSingle,
  }
}
