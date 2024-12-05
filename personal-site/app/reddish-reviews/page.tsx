import MediaTable from 'app/components/mediaTable'

export const metadata = {
  title: 'reddish-reviews',
  description: 'Welcome to reddish-reviews!',
}

export default function Page() {
  return (
    // TO DO: Instead of have this be a page, have it just be a side bar or top bar, that is always there and can be clicked through to chagne the content on the page
    <div>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">reddish-reviews</h1>
      <MediaTable>
        <section>
          <p>Welcome to reddish-reviews! Click on the links above to navigate to different media reviews.</p>
        </section>
      </MediaTable>
    </div>
  )
}
