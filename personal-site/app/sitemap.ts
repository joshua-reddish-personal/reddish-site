// import { getBlogPosts, getMovies } from 'app/reddish-reviews/utils'

// TO DO: Set the base URL for the site
export const baseUrl = 'https://joshua.reddish.me'

// export default async function sitemap() {
//   let blogs = getBlogPosts().map((post) => ({
//     url: `${baseUrl}/reddish-reviews/${post.slug}`,
//     lastModified: post.metadata.publishedAt,
//   }))

//   let movies = getMovies().map((movie) => ({
//     url: `${baseUrl}/reddish-reviews/movies/${movie.slug}`,
//     lastModified: movie.metadata.publishedAt,
//   }))

//   let routes = ['', '/reddish-reviews'].map((route) => ({
//     url: `${baseUrl}${route}`,
//     lastModified: new Date().toISOString().split('T')[0],
//   }))

//   return [...routes, ...blogs, ...movies]
// }
