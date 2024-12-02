import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import Header from 'app/components/header'
import { getBooks } from 'app/reddish-reviews/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let books = getBooks()

  return books.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let book = getBooks().find((book) => book.slug === params.slug)
  if (!book) {
    return
  }

  let {
    title,
    mediaType,
    // image,
  } = book.metadata
  // let ogImage = image
  //   ? image
  //   : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    mediaType,
  }
}

export default function Book({ params }) {
  let book = getBooks().find((book) => book.slug === params.slug)

  if (!book) {
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
            headline: book.metadata.title,
            mediaType: book.metadata.mediaType,
            // image: book.metadata.image
            //   ? `${baseUrl}${book.metadata.image}`
            //   : `/og?title=${encodeURIComponent(book.metadata.title)}`,
            url: `${baseUrl}/reddish-reviews/books/${book.slug}`,
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {book.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
      <article className="prose">
        <CustomMDX source={book.content} />
      </article>
    </section>
  )
}
