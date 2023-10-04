import { FC, PropsWithChildren } from 'react'
import Header from './Header'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-bl from-emerald-700 via-blue-900 to-pink-500">
      <Header />
      <div className="flex items-stretch flex-row flex-1 justify-center w-full max-w-7xl">
        {children}
      </div>
    </div>
  )
}

export default Layout
