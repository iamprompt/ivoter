import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Link href={`/test`}>next</Link>
    </div>
  )
}

export default Home
