import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import type { User } from '@supabase/supabase-js'
import { pageMetadata, privateMetadata, absoluteUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import { SecretSantaContent } from '@/components/secret-santa-content'
import { SiteFooter } from '@/components/site-footer'
import { loadListById } from '@/lib/supabase/lists'
import { Header } from '@/components/header'
import { SecretSantaForm } from '@/components/secret-santa-form'
import { SnowEffect } from '@/components/snow-effect'
import { Sparkles } from '@/components/sparkles'
import { Gift, Heart, TreePine, Star } from 'lucide-react'

interface HomePageProps {
  searchParams: Promise<{ list?: string }>
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams
  return {
    ...pageMetadata({ title: 'Free Secret Santa Generator — Draw Names Online', description: SITE_DESCRIPTION, path: '/' }),
    ...('list' in params ? privateMetadata : {}),
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const cookieStore = await cookies()
  const hasSession = cookieStore.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name))
  const supabase = hasSession ? await createClient() : null
  let user: User | null = null
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    user = data.user
  }

  const initialList = resolvedSearchParams.list && user && supabase
    ? await loadListById(supabase, resolvedSearchParams.list)
    : null

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', '@id': absoluteUrl('/#website'), name: SITE_NAME, url: absoluteUrl(), inLanguage: 'en-GB' },
          {
            '@type': 'WebApplication', '@id': absoluteUrl('/#generator'),
            name: 'Santa Switch Secret Santa Generator', url: absoluteUrl(), description: SITE_DESCRIPTION,
            applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript for the name draw.',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            featureList: ['Random Secret Santa name draw', 'Mutual participant exclusions', 'Email assignments', 'Guest mode', 'Saved participant lists with an account'],
            isPartOf: { '@id': absoluteUrl('/#website') },
          },
        ],
      }} />
      <a href="#generator" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3">Skip to the Secret Santa generator</a>
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 animate-float">
            <Gift className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 text-balance">
            Free Secret Santa
            <span className="text-primary block"> Generator</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Draw names for your Secret Santa gift exchange online. Add friends, family or colleagues,
            set exclusions, and email each person their assignment. Start without signing up.
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
        <section id="generator" aria-label="Secret Santa name generator" className="scroll-mt-28">
          <div data-nosnippet>
            <SecretSantaForm user={user} initialList={initialList} />
          </div>
        </section>

        <SecretSantaContent />
        <SiteFooter />
      </main>
    </div>
  )
}
