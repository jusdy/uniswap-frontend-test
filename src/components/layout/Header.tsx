import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <div className="z-50 flex justify-center flex-shrink-0 w-full h-20 bg-indigo-900 backdrop:blur-sm bg-opacity-80">
      <div className="flex items-center justify-between w-full px-4 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">Test</h1>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
