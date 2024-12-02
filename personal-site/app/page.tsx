// import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {`Welcome to My Page \u{1F44B}`}
      </h1>
      <p className="mb-4">
        {`Hi, I'm Joshua Reddish, and this is my personal page!`}
      </p>

      <p className="mb-4">
        {`I am a DevOps Engineer, and I specialize in Infrastructure as Code and Serverless Application Architectures. I am also learning about front-end development, which is why I created this page using Next.js!`}
      </p>

      <p className="mb-4">
        {`I have also created reddish-reviews, a curated collection of my favorite media! Feel free to explore the reddish-reviews tab to discover some great recommendations!`}
      </p>
    </section>
  )
}
