import { QUOTER_ADDRESS } from '@/config'
import { BigNumber } from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi as QuoterAbi } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { useState, useEffect, useRef } from 'react'

export const useQuoterInput = (
  token0: AddressString,
  token1: AddressString,
  fee: string | undefined,
  amount: BigNumber | undefined
) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const [expectAmount, setExpectAmount] = useState<BigNumber>()
  const { data: signer } = useSigner()
  const quoterContract = useContract({
    address: QUOTER_ADDRESS,
    abi: QuoterAbi,
    signerOrProvider: signer,
  })

  useEffect(() => {
    if (!amount) {
      return
    }

    if (!quoterContract || !token0 || !token1 || !fee || amount.eq(0)) {
      return
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(async () => {
      setExpectAmount(
        await quoterContract.callStatic.quoteExactInputSingle(
          token0,
          token1,
          fee,
          amount,
          0
        )
      )
    }, 300)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [amount, fee, quoterContract, token0, token1])

  return expectAmount
}
