import { privateMetadata } from '@/lib/seo'

export const metadata = { ...privateMetadata, title: 'Your saved lists' }

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
