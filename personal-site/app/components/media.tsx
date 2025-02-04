import Link from 'next/link'
import { getBooks, getMovies, getVideoGames, getTVShows } from 'app/reddish-reviews/utils'

const mediaTypeToFunctionMap = {
  movies: getMovies,
  books: getBooks,
  'video-games': getVideoGames,
  'tv-shows': getTVShows,
}

type MediaType = 'movies' | 'books' | 'video-games' | 'tv-shows'

export function MediaList({ mediaType }: { mediaType: MediaType }) {
  const fetchFunction = mediaTypeToFunctionMap[mediaType]

  if (!fetchFunction) {
    throw new Error(`Invalid media type: ${mediaType}`)
  }

  const allMedia = fetchFunction()

  return (
    <div>
      {allMedia
        .sort((a, b) => b.metadata.overall_grade - a.metadata.overall_grade)
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/reddish-reviews/${mediaType}/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                - {post.metadata.title} - {post.metadata.overall_grade}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}