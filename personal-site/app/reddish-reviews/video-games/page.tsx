import { MediaList } from 'app/components/media'
import Header from 'app/components/header'

export const metadata = {
  title: 'reddish-reviews: Movies',
  description: 'Welcome to reddish-reviews!',
}

export default function Page() {
  return (
    <section>
      <Header></Header>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">reddish-reviews: video games</h1>
      <MediaList mediaType="videoGames" />
    </section>
  )
}
