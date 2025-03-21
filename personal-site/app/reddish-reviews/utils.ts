import fs from 'fs'
import path from 'path'

export type MovieMetaData = {
  mediaType: 'movie'
  title: string
  director: string
  release_year: number
  genres: string[]
  top_billed_actors: string[]
  criteria_grades: {
    storytelling: number
    characterDevelopment: number
    visualPresentation: number
  }
  overall_grade: number
}

export type TVShowMetaData = {
  mediaType: 'tv_show'
  title: string
  creator: string
  release_year: number
  genres: string[]
  top_billed_actors: string[]
  criteria_grades: {
    storytelling: number
    characterDevelopment: number
    visualPresentation: number
  }
  overall_grade: number
}

export type BookMetaData = {
  mediaType: 'book'
  title: string
  author: string
  publication_year: number
  genres: string[]
  publisher: string
  criteria_grades: {
    story: number
    characterDevelopment: number
    immersion: number
  }
  overall_grade: number
}

export type VideoGameMetaData = {
  mediaType: 'video_game'
  title: string
  developer: string
  release_year: number
  genres: string[]
  criteria_grades: {
    story: number
    gameplay: number
    visualPresentation: number
  }
  overall_grade: number
}

export type Metadata = MovieMetaData | TVShowMetaData | BookMetaData | VideoGameMetaData

function parseJSONFile(fileContent: string): { metadata: Metadata, content: any } {
  // Parse the entire file content as JSON
  const parsedData = JSON.parse(fileContent)

  // Extract metadata and content from the parsed JSON
  const metadata: Metadata = parsedData.metadata
  const content: any = parsedData.content

  return { metadata: metadata as Metadata, content }
}

function getMediaFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.json')
}

function readMediaFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseJSONFile(rawContent)
}

function getMediaData(dir) {
  let mediaFiles = getMediaFiles(dir)
  return mediaFiles.map((file) => {
    let { metadata, content } = readMediaFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

function calculateOverallGrade(criteriaGrades: Record<string, number>): number {
  const grades = Object.values(criteriaGrades)
  return Math.round(grades.reduce((acc, grade) => acc + grade, 0) / grades.length)
}

export function getMovies() {
  const mediaData = getMediaData(path.join(process.cwd(), 'app', 'reddish-reviews', 'movies', 'media'))

  return mediaData.map((data) => {
    const overallGrade = calculateOverallGrade(data.metadata.criteria_grades)
    return {
      metadata: { ...data.metadata, overall_grade: overallGrade } as MovieMetaData,
      slug: data.slug,
      content: data.content,
    }
  })
}

export function getVideoGames() {
  const mediaData = getMediaData(path.join(process.cwd(), 'app', 'reddish-reviews', 'video-games', 'media'))

  return mediaData.map((data) => {
    const overallGrade = calculateOverallGrade(data.metadata.criteria_grades)
    return {
      metadata: { ...data.metadata, overall_grade: overallGrade } as VideoGameMetaData,
      slug: data.slug,
      content: data.content,
    }
  })
}

export function getBooks() {
  const mediaData = getMediaData(path.join(process.cwd(), 'app', 'reddish-reviews', 'books', 'media'))

  return mediaData.map((data) => {
    const overallGrade = calculateOverallGrade(data.metadata.criteria_grades)
    return {
      metadata: { ...data.metadata, overall_grade: overallGrade } as BookMetaData,
      slug: data.slug,
      content: data.content,
    }
  })
}

export function getTVShows() {
  const mediaData = getMediaData(path.join(process.cwd(), 'app', 'reddish-reviews', 'tv-shows', 'media'))

  return mediaData.map((data) => {
    const overallGrade = calculateOverallGrade(data.metadata.criteria_grades)
    return {
      metadata: { ...data.metadata, overall_grade: overallGrade } as TVShowMetaData,
      slug: data.slug,
      content: data.content,
    }
  })
}