import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import MediaTable from 'app/components/mediaTable'
import { getVideoGames } from 'app/reddish-reviews/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let videoGames = getVideoGames()

  return videoGames.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let videoGame = getVideoGames().find((videoGame) => videoGame.slug === params.slug)
  if (!videoGame) {
    return
  }

  let {
    title,
    mediaType,
    // image,
  } = videoGame.metadata
  // let ogImage = image
  //   ? image
  //   : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    mediaType,
  }
}

export default function VideoGame({ params }) {
  let videoGame = getVideoGames().find((videoGame) => videoGame.slug === params.slug)

  if (!videoGame) {
    notFound()
  }

  return (
    <section>
   <MediaTable></MediaTable>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: videoGame.metadata.title,
            mediaType: videoGame.metadata.mediaType,
            // image: videoGame.metadata.image
            //   ? `${baseUrl}${videoGame.metadata.image}`
            //   : `/og?title=${encodeURIComponent(videoGame.metadata.title)}`,
            url: `${baseUrl}/reddish-reviews/video-games/${videoGame.slug}`,
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {videoGame.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
      <article className="prose">
        <CustomMDX source={videoGame.content} />
      </article>
    </section>
  )
}
