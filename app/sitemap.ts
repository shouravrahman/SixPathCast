import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://<your-domain>'; // You'll need to change this

  // In the future, you can fetch dynamic routes (e.g., blog posts)
  // from your database and add them here.

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Add more static routes here
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    // },
  ]
}
