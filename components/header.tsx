'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
  user: SupabaseUser | null
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="frosted-glass sticky top-0 z-40 border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Santa Switch home"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors animate-float">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="font-bold text-xl text-foreground">Santa Switch</span>
            <p className="text-xs text-muted-foreground hidden sm:block">Spread the holiday joy!</p>
          </div>
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 frosted-glass">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="frosted-glass">
                <DropdownMenuItem className="text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild className="rounded-xl christmas-btn frosted-glass">
              <Link href="/auth/login">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
