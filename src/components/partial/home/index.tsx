import { useAccount } from 'wagmi'
import { Tab } from '@headlessui/react'
import classNames from 'classnames'
import Swap from './swap'
import SwapHistory from './history'

const tabMenu = {
  Swap: <Swap />,
  'Swap History': <SwapHistory />,
}

const Home = () => {
  const { isConnected } = useAccount()

  return (
    <main
      className={`flex flex-col lg:flex-row justify-between gap-x-2 gap-y-5 flex-1 items-center mx-auto p-2 py-10`}
    >
      {isConnected ? (
        <div className="w-full px-2 py-8 sm:px-0 flex flex-col items-center gap-2">
          <Tab.Group>
            <Tab.List className="w-full flex space-x-1 rounded-xl bg-blue-900/20 p-1 max-w-md">
              {Object.keys(tabMenu).map((title) => (
                <Tab
                  key={title}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow'
                        : 'hover:bg-white/[0.12] hover:text-white text-white'
                    )
                  }
                >
                  {title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="flex-1 flex justify-center items-center">
              {Object.values(tabMenu).map((widget, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  {widget}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : (
        <p className="w-full text-center text-xl text-white">
          Please connect your wallet
        </p>
      )}
    </main>
  )
}

export default Home
