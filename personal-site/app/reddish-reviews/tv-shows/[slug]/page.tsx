import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import MediaTable from 'app/components/mediaTable'
import { getTVShows } from 'app/reddish-reviews/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let tvShows = getTVShows()

  return tvShows.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let tvShow = getTVShows().find((tvShow) => tvShow.slug === params.slug)
  if (!tvShow) {
    return
  }

  let {
    title,
    mediaType,
    // image,
  } = tvShow.metadata
  // let ogImage = image
  //   ? image
  //   : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    mediaType,
  }
}

export default function TVShow({ params }) {
  let tvShow = getTVShows().find((tvShow) => tvShow.slug === params.slug)

  if (!tvShow) {
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
            headline: tvShow.metadata.title,
            mediaType: tvShow.metadata.mediaType,
            // image: tvShow.metadata.image
            //   ? `${baseUrl}${tvShow.metadata.image}`
            //   : `/og?title=${encodeURIComponent(tvShow.metadata.title)}`,
            url: `${baseUrl}/reddish-reviews/tv-shows/${tvShow.slug}`,
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {tvShow.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
      <article className="prose">
        <CustomMDX source={tvShow.content} />
      </article>
    </section>
  )
}
