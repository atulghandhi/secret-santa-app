import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { SecretSantaForm } from '@/components/secret-santa-form'
import { SnowEffect } from '@/components/snow-effect'
import { Sparkles } from '@/components/sparkles'
import { Gift, Heart, TreePine, Star } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pastel-blue/30 via-background to-pastel-pink/20" />
        
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-christmas-red/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-christmas-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-pastel-pink/10 rounded-full blur-3xl" />
      </div>

      {/* Snow and sparkles */}
      <SnowEffect />
      <Sparkles count={15} />

      {/* Header */}
      <Header user={user} />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Hero section */}
        <div className="text-center mb-12 animate-bounce-in">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 animate-float">
            <Gift className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 text-balance">
            Secret Santa
            <span className="text-primary block sm:inline"> Gift Exchange</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Create magical gift exchanges with your friends and family. 
            Add participants, set exclusions, and let the holiday magic begin!
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium">
              <Heart className="w-4 h-4 text-christmas-red" />
              Easy to use
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium">
              <TreePine className="w-4 h-4 text-christmas-green" />
              Set exclusions
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium">
              <Star className="w-4 h-4 text-gold" />
              Send emails
            </span>
          </div>

          {/* Guest mode notice */}
          {!user && (
            <p className="mt-6 text-sm text-muted-foreground">
              Using guest mode. <a href="/auth/login" className="text-primary hover:underline font-medium">Sign in</a> to save your lists!
            </p>
          )}
        </div>

        {/* Secret Santa Form */}
        <SecretSantaForm user={user} />

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 text-sm text-muted-foreground">
          <p>Made with <Heart className="w-4 h-4 inline text-christmas-red" /> for the holiday season</p>
          <p className="mt-2 text-xs">Happy Holidays!</p>
        </footer>
      </main>
    </div>
  )
}
