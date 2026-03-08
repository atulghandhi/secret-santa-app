import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-pastel-blue/30 via-background to-pastel-pink/20" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-destructive/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="frosted-glass rounded-3xl p-8 text-center animate-bounce-in">
          {/* Error icon */}
          <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Oops! Something Went Wrong
          </h1>
          
          <p className="text-muted-foreground mb-4">
            {"We encountered an error during authentication. Don't worry, even Santa's workshop has hiccups sometimes!"}
          </p>

          {params?.error && (
            <div className="bg-destructive/5 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-destructive font-mono">
                Error: {params.error}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-semibold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full h-12 rounded-xl">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
