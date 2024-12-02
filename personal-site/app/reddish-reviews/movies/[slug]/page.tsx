import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import Header from 'app/components/header'
import { getMovies } from 'app/reddish-reviews/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let movies = getMovies()

  return movies.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let movie = getMovies().find((movie) => movie.slug === params.slug)
  if (!movie) {
    return
  }

  let {
    title,
    mediaType,
    // image,
  } = movie.metadata
  // let ogImage = image
  //   ? image
  //   : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    mediaType,
  }
}

export default function Movie({ params }) {
  let movie = getMovies().find((movie) => movie.slug === params.slug)

  if (!movie) {
    notFound()
  }

  return (
    <section>
    <Header></Header>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: movie.metadata.title,
            mediaType: movie.metadata.mediaType,
            // image: movie.metadata.image
            //   ? `${baseUrl}${movie.metadata.image}`
            //   : `/og?title=${encodeURIComponent(movie.metadata.title)}`,
            url: `${baseUrl}/reddish-reviews/movies/${movie.slug}`,
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {movie.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
      <article className="prose">
        <CustomMDX source={movie.content} />
      </article>
    </section>
  )
}
