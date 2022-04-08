import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Link href={`/`}>home</Link>
    </div>
  )
}

export default Home
