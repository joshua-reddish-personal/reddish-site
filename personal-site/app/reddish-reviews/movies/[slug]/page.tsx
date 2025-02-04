import { notFound } from 'next/navigation'
import MediaTable from 'app/components/mediaTable'
import { getMovies } from 'app/reddish-reviews/utils'


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
    director,
    release_year,
    genres, 
    criteria_grades,
  } = movie.metadata

  return {
    title,
    mediaType,
    director,
    release_year,
    genres,
    criteria_grades,
  }
}

export default function Movie({ params }) {
  let movie = getMovies().find((movie) => movie.slug === params.slug)

  if (!movie) {
    notFound()
  }

  return (
    <section>
   <MediaTable></MediaTable>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-4">
        {movie.metadata.title} ({movie.metadata.release_year})
      </h1>
      <h2 className="releaseYear font-semibold text-2xl tracking-tighter mb-4">
        Director: {movie.metadata.director}
      </h2>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Genres:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {movie.metadata.genres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Criteria Grades:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(movie.metadata.criteria_grades).map(([criteria, grade], index) => (
          <li key={index}>
            {criteria}: {grade}
          </li>
        ))}
      </ul>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Overall Grade: {movie.metadata.overall_grade}
      </h3>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
    </section>
  )
}
