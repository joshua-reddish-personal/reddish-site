export const dynamic = 'force-static';

import { baseUrl } from 'app/sitemap'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
