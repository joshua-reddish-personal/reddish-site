import { MediaList } from 'app/components/media'
import MediaTable from 'app/components/mediaTable'

export const metadata = {
  title: 'reddish-reviews: Movies',
  description: 'Welcome to reddish-reviews!',
}

export default function Page() {
  return (
    <section>
     <MediaTable></MediaTable>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">reddish-reviews: tv shows</h1>
      <MediaList mediaType="tv-shows" />
    </section>
  )
}
