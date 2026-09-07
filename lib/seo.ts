import type { Metadata } from 'next'

export const SITE_NAME = 'Santa Switch'
export const SITE_DESCRIPTION = 'Organise a free Secret Santa gift exchange online. Draw names, exclude couples, and email assignments. No sign-up needed to generate pairings.'

// Set the public custom domain, never a preview deployment URL.
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const parsedUrl = new URL(configuredUrl)
if (!['http:', 'https:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password || parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be a full origin, for example https://your-domain.com, without a path or query.')
}
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error('Set NEXT_PUBLIC_SITE_URL to your production domain before building. Canonicals must not point to localhost or a preview URL.')
}
export const SITE_URL = parsedUrl.origin
export const isPublicSite = !['localhost', '127.0.0.1'].includes(new URL(SITE_URL).hostname)
  && process.env.VERCEL_ENV !== 'preview'

export function absoluteUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString()
}

export function pageMetadata({ title, description, path }: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Santa Switch — free Secret Santa generator' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteUrl('/opengraph-image')],
    },
  }
}

export const privateMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}
