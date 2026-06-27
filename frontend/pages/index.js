import dynamic from 'next/dynamic'
import Head from 'next/head'

const Chat = dynamic(() => import('../components/Chat'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Krishna-2.0 | Nitigya's Study Partner</title>
        <meta name="description" content="Personalized UPSC study companion for Nitigya" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <Chat />
      </main>
    </>
  )
}
