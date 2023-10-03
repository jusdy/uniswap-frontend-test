import dynamic from 'next/dynamic'

const Home = dynamic(() => import('@/components/partial/home'), {
  ssr: false,
})

export default function HomePage() {
  return <Home />
}
