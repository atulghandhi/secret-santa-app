import { updateSession } from '@/lib/supabase/proxy'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Anonymous visitors and crawlers do not need a remote auth round trip.
  const hasSession = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name))
  if (!hasSession) return NextResponse.next()
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/', '/auth/:path*', '/history/:path*', '/view/:path*',
  ],
}
