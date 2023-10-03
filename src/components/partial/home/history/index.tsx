import { GET_SWAP_HISTORY } from '@/config/subgraphQueries'
import { useSubgraphData } from '@/hooks/useSubgraphData'
import { useAccount } from 'wagmi'

const SwapHistory = () => {
  const { address } = useAccount()
  const { data } = useSubgraphData(GET_SWAP_HISTORY, {
    address: address?.toLowerCase(),
  })

  return (
    <div className='lg:h-[calc(100vh-160px)] h-fit lg:overflow-auto overflow-hidden scrollbar'>
      <table className="border-collapse table-auto flex-1 text-sm hidden lg:block ml-10">
        <thead>
          <tr className='text-white text-left text-lg'>
            <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 ">
              Date
            </th>
            <th className="border-b font-medium p-4 pt-0 pb-3">
              Input Token
            </th>
            <th className="border-b font-medium p-4 pt-0 pb-3">
              Output Token
            </th>
            <th className="border-b font-medium p-4 pt-0 pb-3">
              Input Amount
            </th>
            <th className="border-b font-medium p-4 pr-8 pt-0 pb-3">
              Output Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent dark:bg-slate-800 text-gray-200 text-base">
          {(data?.swaps ?? []).map((swap: SwapHistory) => (
            <tr key={swap.id}>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8">
                {new Date(+swap.timestamp * 1000).toLocaleDateString()}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4">
                {+swap.amount0 > 0
                  ? `${swap.token0.name} (${swap.token0.symbol})`
                  : `${swap.token1.name} (${swap.token1.symbol})`}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4">
                {+swap.amount0 < 0
                  ? `${swap.token0.name} (${swap.token0.symbol})`
                  : `${swap.token1.name} (${swap.token1.symbol})`}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4">
                {+swap.amount0 > 0
                  ? `${(+swap.amount0).toFixed(4)}`
                  : `${(+swap.amount1).toFixed(4)}`}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8">
                {+swap.amount0 < 0
                  ? `${(-swap.amount0).toFixed(4)}`
                  : `${(-swap.amount1).toFixed(4)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col mx-auto items-center gap-2 lg:hidden">
        {(data?.swaps ?? []).map((swap: SwapHistory) => (
          <div
            key={swap.id}
            className="max-w-md mx-auto rounded-md p-8 bg-black backdrop-blur-md bg-opacity-20"
          >
            <div className="grid grid-cols-2 gap-1 items-center">
              <label className="text-white text-left">Date</label>
              <div className="py-2 px-4 text-gray-200">
                {new Date(+swap.timestamp * 1000).toLocaleDateString()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 items-center">
              <label className="text-white text-left">Input Token</label>
              <div className="py-2 px-4 text-gray-200">
                {+swap.amount0 > 0
                  ? `${swap.token0.name} (${swap.token0.symbol})`
                  : `${swap.token1.name} (${swap.token1.symbol})`}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 items-center">
              <label className="text-white text-left">Output Token</label>
              <div className="py-2 px-4 text-gray-200">
                {+swap.amount0 < 0
                  ? `${swap.token0.name} (${swap.token0.symbol})`
                  : `${swap.token1.name} (${swap.token1.symbol})`}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 items-center">
              <label className="text-white text-left">Input Amount</label>
              <div className="py-2 px-4 text-gray-200">
                {+swap.amount0 > 0
                  ? `${(+swap.amount0).toFixed(4)}`
                  : `${(+swap.amount1).toFixed(4)}`}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 items-center">
              <label className="text-white text-left">Output Amount</label>
              <div className="py-2 px-4 text-gray-200">
                {+swap.amount0 < 0
                  ? `${(-swap.amount0).toFixed(4)}`
                  : `${(-swap.amount1).toFixed(4)}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SwapHistory
