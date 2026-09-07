import { privateMetadata } from '@/lib/seo'

export const metadata = { ...privateMetadata, title: 'Your Secret Santa pairings' }

export default function ViewLayout({ children }: { children: React.ReactNode }) {
  return children
}
