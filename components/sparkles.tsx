'use client'

import { useEffect, useState } from 'react'
import { Sparkle } from 'lucide-react'

interface SparkleItem {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export function Sparkles({ count = 20 }: { count?: number }) {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([])

  useEffect(() => {
    const items: SparkleItem[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 12 + Math.random() * 16,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    }))
    setSparkles(items)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <Sparkle 
            size={sparkle.size} 
            className="text-gold fill-gold/30"
          />
        </div>
      ))}
    </div>
  )
}
