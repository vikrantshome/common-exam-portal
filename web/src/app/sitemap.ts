import { MetadataRoute } from 'next';
import { EXAMS } from '@/lib/static-exams';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://uniapply.in'; // Replace with actual production URL

  // Static Pages
  const staticPages = [
    '',
    '/exams',
    '/login',
    '/signup',
    '/extension',
    '/pricing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Exam Pages
  const examPages = EXAMS.map((exam) => ({
    url: `${baseUrl}/exams/${exam.id}`,
    lastModified: new Date(), // ideally from DB updated_at
    changeFrequency: 'daily' as const,
    priority: 0.9, // High priority for landing pages
  }));

  return [...staticPages, ...examPages];
}
