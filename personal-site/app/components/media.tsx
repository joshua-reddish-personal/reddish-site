import Link from 'next/link'
import { getBooks, getMovies, getVideoGames, getTVShows } from 'app/reddish-reviews/utils'

const mediaTypeToFunctionMap = {
  movies: getMovies,
  books: getBooks,
  videoGames: getVideoGames,
  tvShows: getTVShows,
}

type MediaType = 'movies' | 'books' | 'videoGames' | 'tvShows'

export function MediaList({ mediaType }: { mediaType: MediaType }) {
  const fetchFunction = mediaTypeToFunctionMap[mediaType]

  if (!fetchFunction) {
    throw new Error(`Invalid media type: ${mediaType}`)
  }

  const allMedia = fetchFunction()

  return (
    <div>
      {allMedia
        .sort((a, b) => {
          if (a.metadata.title.toLowerCase() < b.metadata.title.toLowerCase()) {
            return -1
          }
          if (a.metadata.title.toLowerCase() > b.metadata.title.toLowerCase()) {
            return 1
          }
          return 0
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/reddish-reviews/${mediaType}/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
