import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://uniapply.in'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/profile/', '/api/'], // Protect user data routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
