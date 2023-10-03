import { useAccount } from 'wagmi'
import Swap from './swap'
import SwapHistory from './history'

const Home = () => {
  const { isConnected } = useAccount()

  return (
    <main
      className={`flex flex-col lg:flex-row justify-between gap-x-2 gap-y-5 flex-1 items-center mx-auto p-2 py-10`}
    >
      {isConnected ? (
        <>
          <Swap />
          <SwapHistory />
        </>
      ) : (
        <p className="w-full text-center text-xl text-white">
          Please connect your wallet
        </p>
      )}
    </main>
  )
}

export default Home
