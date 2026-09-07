import type { MetadataRoute } from 'next'
import { absoluteUrl, isPublicSite } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return []
  return ['/', '/secret-santa-rules', '/secret-santa-for-work', '/secret-santa-gift-ideas']
    .map((path) => ({ url: absoluteUrl(path) }))
}
