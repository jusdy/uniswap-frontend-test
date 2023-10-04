import { useState, useEffect, useMemo, useCallback } from 'react'
import TokenSelect from '@/components/common/TokenSelect'
import {
  useUniswapPool,
  useSwap,
  useQuoterInput,
  useQuoterOutput,
} from '@/hooks'
import { utils } from 'ethers'
import toast from 'react-hot-toast'
import { shortenAddress } from '@/utils'

const Swap = () => {
  const [from, setFrom] = useState<Token>()
  const [to, setTo] = useState<Token>()
  const [fromAmount, setFromAmount] = useState<number>(0)
  const [toAmount, setToAmount] = useState<number>(0)
  const [waiting, setWaiting] = useState<boolean>(false)

  const fromAmountBigNumber = useMemo(() => {
    try {
      return utils.parseUnits(fromAmount.toString(), from?.decimals ?? 18)
    } catch (err) {
      return undefined
    }
  }, [fromAmount, from])

  const toAmountBigNumber = useMemo(() => {
    try {
      return utils.parseUnits(toAmount.toString(), to?.decimals ?? 18)
    } catch (err) {
      return undefined
    }
  }, [toAmount, to])

  const { balance, allowance, approve, swapInputSingle } = useSwap(
    from?.id,
    to?.id,
    fromAmountBigNumber
  )

  const formattedBalance = useMemo(
    () =>
      balance && from?.decimals
        ? +utils.formatUnits(balance, from?.decimals)
        : undefined,
    [balance, from?.decimals]
  )

  const { data: poolData } = useUniswapPool(from?.id, to?.id)

  const selectedPool = useMemo(() => {
    if (!poolData?.length || !from || !to) {
      return undefined
    }

    const poolList = poolData.map((pool) => ({
      ...pool,
      amount:
        ((fromAmount * (1000000 - +pool.feeTier)) / 1000000) *
        +pool.token1Price,
    }))

    return poolList.reduce((a, b) => (a.amount > b.amount ? a : b))
  }, [poolData, from, to, fromAmount])

  const expectedToAmount = useQuoterInput(
    from?.id,
    to?.id,
    selectedPool?.feeTier,
    fromAmountBigNumber
  )

  const expectedFromAmount = useQuoterOutput(
    from?.id,
    to?.id,
    selectedPool?.feeTier,
    toAmountBigNumber
  )

  const handleSwap = useCallback(async () => {
    if (!selectedPool) {
      return
    }

    let toastId
    try {
      toastId = toast.loading(`Swapping ${from?.symbol} for ${to?.symbol}`)
      setWaiting(true)

      const tx = await swapInputSingle(selectedPool?.feeTier)
      await tx.wait()
      toast.success('Token swap succeed!')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.reason ?? err?.message)
    } finally {
      toast.dismiss(toastId)
      setWaiting(false)
    }
  }, [selectedPool, from?.symbol, swapInputSingle, to?.symbol])

  const handleApprove = useCallback(async () => {
    if (!allowance || !fromAmountBigNumber) {
      return
    }

    if (allowance.gt(fromAmountBigNumber)) {
      return
    }

    let toastId
    try {
      toastId = toast.loading(`Approving ${from?.symbol} to Router`)
      setWaiting(true)

      const tx = await approve()
      await tx.wait()
      toast.success('Token approve succeed!')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.reason ?? err?.message)
    } finally {
      toast.dismiss(toastId)
      setWaiting(false)
    }
  }, [allowance, approve, from?.symbol, fromAmountBigNumber])

  useEffect(() => {
    if (!formattedBalance) {
      return
    }

    if (fromAmount > formattedBalance) {
      setFromAmount(formattedBalance)
    }
  }, [formattedBalance, fromAmount])

  useEffect(() => {
    if (expectedToAmount) {
      const formatted = +utils.formatUnits(expectedToAmount, to?.decimals ?? 18)
      if (Math.abs(formatted - toAmount) > 0.001) {
        setToAmount(+utils.formatUnits(expectedToAmount, to?.decimals ?? 18))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expectedToAmount, to?.decimals])

  useEffect(() => {
    if (expectedFromAmount) {
      const formatted = +utils.formatUnits(
        expectedFromAmount,
        from?.decimals ?? 18
      )
      if (Math.abs(formatted - fromAmount) > 0.001) {
        setFromAmount(
          +utils.formatUnits(expectedFromAmount, from?.decimals ?? 18)
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expectedFromAmount, from?.decimals])

  return (
    <div className="flex justify-center items-center lg:h-[calc(100vh-320px)]">
      <div className="max-w-md min-w-[350px] mx-auto rounded-md py-8 px-4 bg-black backdrop-blur-md bg-opacity-20">
        <div className="w-full flex flex-col gap-4">
          <TokenSelect label="from" onChange={setFrom} />
          <div className="w-full grid grid-cols-4 items-center overflow-visible gap-4">
            <div></div>
            <p className="col-span-3 text-sm text-gray-100">{`Available balance is ${
              formattedBalance?.toFixed(6) ?? '-'
            }`}</p>
          </div>
          <TokenSelect label="to" onChange={setTo} />
          <div className="w-full grid grid-cols-4 items-center overflow-visible gap-4">
            <label className="text-white uppercase text-right">Input</label>
            <div className="col-span-3 w-full relative">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(+e.target.value)}
                className="w-full rounded-lg border-none py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0"
              />
              <button
                type="button"
                disabled={!formattedBalance}
                onClick={() => setFromAmount(formattedBalance ?? 0)}
                className="absolute top-1/2 -translate-y-1/2 right-1 py-1 px-3 font-bold text-white text-xs uppercase bg-blue-400 rounded-md"
              >
                Max
              </button>
            </div>
          </div>
          <div className="w-full grid grid-cols-4 items-center overflow-visible gap-4">
            <label className="text-white uppercase text-right">Output</label>
            <div className="col-span-3 w-full">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(+e.target.value)}
                className="w-full rounded-lg border-none py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0"
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-4 items-center overflow-visible gap-4">
            <div></div>
            <p className="col-span-3 text-sm text-gray-100">
              {selectedPool
                ? `Pool address is ${shortenAddress(selectedPool.id)}`
                : 'Pool not found'}
            </p>
          </div>
          <button
            type="button"
            disabled={!allowance || waiting || !fromAmount || !toAmount}
            onClick={() =>
              allowance?.gte(fromAmountBigNumber ?? 0)
                ? handleSwap()
                : handleApprove()
            }
            className="disabled:bg-gray-300 bg-green-600 hover:bg-green-700 disabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center disabled:cursor-not-allowed"
          >
            <span className="w-full text-center">
              {fromAmount
                ? allowance?.gte(fromAmountBigNumber ?? 0)
                  ? 'Swap'
                  : 'Approve'
                : 'Invalid Amount'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Swap
