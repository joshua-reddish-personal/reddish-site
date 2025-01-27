import MediaTable from 'app/components/mediaTable'
import { getBooks } from 'app/reddish-reviews/utils'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  let movies = getBooks()

  return movies.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let movie = getBooks().find((movie) => movie.slug === params.slug)
  if (!movie) {
    return
  }

  let {
    title,
    mediaType,
    author,
    publication_year,
    genres, 
    criteria_grades,
  } = movie.metadata

  return {
    title,
    mediaType,
    author,
    publication_year,
    genres,
    criteria_grades,
  }
}

export default function Book({ params }) {
  let book = getBooks().find((book) => book.slug === params.slug)

  if (!book) {
    notFound()
  }

  const criteriaGrades = Object.values(book.metadata.criteria_grades);
  const overall_grade = Math.round(criteriaGrades.reduce((acc, grade) => acc + grade, 0) / criteriaGrades.length);

  return (
    <section>
   <MediaTable></MediaTable>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-4">
        {book.metadata.title} ({book.metadata.publication_year})
      </h1>
      <h2 className="releaseYear font-semibold text-2xl tracking-tighter mb-4">
        Director: {book.metadata.author}
      </h2>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Genres:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {book.metadata.genres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Criteria Grades:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(book.metadata.criteria_grades).map(([criteria, grade], index) => (
          <li key={index}>
            {criteria}: {grade}
          </li>
        ))}
      </ul>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Overall Grade: {overall_grade}
      </h3>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      </div>
    </section>
  )
}
