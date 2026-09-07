import type { MetadataRoute } from 'next'
import { absoluteUrl, isPublicSite } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    // Search and AI discovery crawlers can read the same public content.
    // Private pages remain crawlable so their noindex directive can be read.
    rules: isPublicSite
      ? { userAgent: '*', allow: '/', disallow: ['/api/'] }
      : { userAgent: '*', disallow: '/' },
    ...(isPublicSite ? { sitemap: absoluteUrl('/sitemap.xml') } : {}),
  }
}
