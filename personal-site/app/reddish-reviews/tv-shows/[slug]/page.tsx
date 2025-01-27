import { notFound } from 'next/navigation'
import MediaTable from 'app/components/mediaTable'
import { getTVShows } from 'app/reddish-reviews/utils'


export async function generateStaticParams() {
  let tvshows = getTVShows()

  return tvshows.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let tvshow = getTVShows().find((tvshow) => tvshow.slug === params.slug)
  if (!tvshow) {
    return
  }

  let {
    title,
    mediaType,
    creator,
    release_year,
    genres, 
    criteria_grades,
  } = tvshow.metadata

  return {
    title,
    mediaType,
    creator,
    release_year,
    genres,
    criteria_grades,
  }
}

export default function TVShow({ params }) {
  let tvshow = getTVShows().find((tvshow) => tvshow.slug === params.slug)

  if (!tvshow) {
    notFound()
  }

  const criteriaGrades = Object.values(tvshow.metadata.criteria_grades);
  const overall_grade = Math.round(criteriaGrades.reduce((acc, grade) => acc + grade, 0) / criteriaGrades.length);

  return (
    <section>
   <MediaTable></MediaTable>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-4">
        {tvshow.metadata.title} ({tvshow.metadata.release_year})
      </h1>
      <h2 className="releaseYear font-semibold text-2xl tracking-tighter mb-4">
        Creator: {tvshow.metadata.creator}
      </h2>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Genres:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {tvshow.metadata.genres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>
      <h3 className="title font-semibold text-2xl tracking-tighter mb-4">
        Criteria Grades:
      </h3>
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(tvshow.metadata.criteria_grades).map(([criteria, grade], index) => (
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
