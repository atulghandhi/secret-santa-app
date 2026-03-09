'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { SnowEffect } from '@/components/snow-effect'
import { Sparkles } from '@/components/sparkles'
import { Gift, Calendar, Users, ArrowLeft, Trash2, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface SecretSantaList {
  id: string
  name: string
  created_at: string
  updated_at: string
  participant_count?: number
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [lists, setLists] = useState<SecretSantaList[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/history')
        return
      }
      setUser(user)
      await loadLists(user.id)
    }

    checkAuth()
  }, [router, supabase.auth])

  const loadLists = async (userId: string) => {
    setLoading(true)
    try {
      const { data: listsData, error } = await supabase
        .from('secret_santa_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get participant counts for each list
      const listsWithCounts = await Promise.all(
        (listsData || []).map(async (list) => {
          const { count } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true })
            .eq('list_id', list.id)

          return {
            ...list,
            participant_count: count || 0
          }
        })
      )

      setLists(listsWithCounts)
    } catch (error) {
      console.error('Error loading lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('secret_santa_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error

      setLists(lists.filter(l => l.id !== listId))
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      <Header user={user} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Sparkles />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Your Secret Santa History
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              View and manage your past Secret Santa lists
            </p>
          </div>

          {/* Lists */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : lists.length === 0 ? (
            <Card className="frosted-glass border-white/30">
              <CardContent className="py-16 text-center">
                <Gift className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No lists yet</h3>
                <p className="text-muted-foreground mb-6">
                  You have not created any Secret Santa lists yet.
                </p>
                <Link href="/">
                  <Button className="christmas-btn bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Your First List
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {lists.map((list, index) => (
                <Card 
                  key={list.id} 
                  className="frosted-glass border-white/30 animate-bounce-in hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary" />
                          {list.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(list.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {list.participant_count} participants
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/?list=${list.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-secondary/50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit & Respin
                        </Button>
                      </Link>
                      <Link href={`/view/${list.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-secondary/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Pairings
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteList(list.id)}
                        className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
