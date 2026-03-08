import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-pastel-blue/30 via-background to-pastel-pink/20" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-christmas-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="frosted-glass rounded-3xl p-8 text-center animate-bounce-in">
          {/* Success icon */}
          <div className="inline-flex items-center justify-center p-4 bg-christmas-green/10 rounded-full mb-6 animate-float">
            <div className="relative">
              <Mail className="w-10 h-10 text-christmas-green" />
              <CheckCircle className="w-5 h-5 text-christmas-green absolute -bottom-1 -right-1 bg-background rounded-full" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check Your Email!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {"We've sent you a confirmation email. Please click the link in the email to verify your account and start spreading holiday cheer!"}
          </p>

          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-semibold">
                Go to Login
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full h-12 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            {"Didn't receive the email? Check your spam folder or try signing up again."}
          </p>
        </div>
      </div>
    </div>
  )
}
