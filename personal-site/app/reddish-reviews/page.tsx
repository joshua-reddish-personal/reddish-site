import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'reddish-reviews',
  description: 'Welcome to reddish-reviews!',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">reddish-reviews</h1>
      <BlogPosts />
    </section>
  )
}
