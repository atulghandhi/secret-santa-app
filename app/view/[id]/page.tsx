'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { SnowEffect } from '@/components/snow-effect'
import { Sparkles } from '@/components/sparkles'
import { Gift, ArrowLeft, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Participant {
  id: string
  name: string
  email: string | null
}

interface Pairing {
  id: string
  giver_id: string
  receiver_id: string
  email_sent: boolean
  giver?: Participant
  receiver?: Participant
}

interface SecretSantaList {
  id: string
  name: string
  created_at: string
  user_id: string | null
}

export default function ViewListPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [list, setList] = useState<SecretSantaList | null>(null)
  const [pairings, setPairings] = useState<Pairing[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [revealedPairings, setRevealedPairings] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      await loadListData()
    }

    loadData()
  }, [listId, supabase.auth])

  const loadListData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load list details
      const { data: listData, error: listError } = await supabase
        .from('secret_santa_lists')
        .select('*')
        .eq('id', listId)
        .single()

      if (listError) throw listError
      setList(listData)

      // Load participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('list_id', listId)

      if (participantsError) throw participantsError
      setParticipants(participantsData || [])

      // Load pairings
      const { data: pairingsData, error: pairingsError } = await supabase
        .from('pairings')
        .select('*')
        .eq('list_id', listId)

      if (pairingsError) throw pairingsError

      // Map participants to pairings
      const participantsMap = new Map(participantsData?.map(p => [p.id, p]))
      const enrichedPairings = (pairingsData || []).map(pairing => ({
        ...pairing,
        giver: participantsMap.get(pairing.giver_id),
        receiver: participantsMap.get(pairing.receiver_id)
      }))

      setPairings(enrichedPairings)
    } catch (err) {
      console.error('Error loading list:', err)
      setError('Failed to load list details')
    } finally {
      setLoading(false)
    }
  }

  const togglePairingReveal = (pairingId: string) => {
    setRevealedPairings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pairingId)) {
        newSet.delete(pairingId)
      } else {
        newSet.add(pairingId)
      }
      return newSet
    })
  }

  const revealAll = () => {
    setRevealedPairings(new Set(pairings.map(p => p.id)))
  }

  const hideAll = () => {
    setRevealedPairings(new Set())
  }

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <SnowEffect />
        <Header user={user} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (error || !list) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <SnowEffect />
        <Header user={user} />
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="frosted-glass border-white/30 max-w-md mx-auto">
            <CardContent className="py-8">
              <Gift className="w-16 h-16 mx-auto text-destructive/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">List Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || 'This Secret Santa list does not exist or you do not have permission to view it.'}
              </p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      <Header user={user} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href={user ? '/history' : '/'}>
            <Button variant="ghost" className="mb-6 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Sparkles />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
                {list.name}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {participants.length} participants
            </p>
          </div>

          {/* Pairings */}
          {pairings.length === 0 ? (
            <Card className="frosted-glass border-white/30">
              <CardContent className="py-12 text-center">
                <Gift className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Pairings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  This list does not have any pairings generated yet.
                </p>
                <Link href={`/?list=${list.id}`}>
                  <Button className="christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground">
                    Generate Pairings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Control buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={revealAll}
                  className="hover:bg-white/50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal All
                </Button>
                <Button 
                  variant="outline" 
                  onClick={hideAll}
                  className="hover:bg-white/50"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide All
                </Button>
              </div>

              {/* Pairings list */}
              <div className="grid gap-4">
                {pairings.map((pairing, index) => {
                  const isRevealed = revealedPairings.has(pairing.id)
                  return (
                    <Card 
                      key={pairing.id}
                      className="frosted-glass border-white/30 animate-bounce-in overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="py-4 px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Giver */}
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">Giver</p>
                              <p className="font-semibold text-foreground">
                                {pairing.giver?.name || 'Unknown'}
                              </p>
                            </div>

                            {/* Arrow */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                              <ArrowRight className="w-5 h-5 text-primary" />
                            </div>

                            {/* Receiver */}
                            <div className="flex-1 text-right">
                              <p className="text-sm text-muted-foreground">Gives to</p>
                              <p className={`font-semibold transition-all duration-300 ${isRevealed ? 'text-foreground' : 'blur-md select-none'}`}>
                                {pairing.receiver?.name || 'Unknown'}
                              </p>
                            </div>
                          </div>

                          {/* Reveal button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePairingReveal(pairing.id)}
                            className="ml-4 hover:bg-white/50"
                          >
                            {isRevealed ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 mt-8">
                <Link href={`/?list=${list.id}`}>
                  <Button 
                    variant="outline"
                    className="hover:bg-white/50"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Edit & Respin
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
