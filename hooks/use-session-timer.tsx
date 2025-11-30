'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// in seconds
const WARNING_THRESHOLD = 15
const CRITICAL_THRESHOLD = 5

export function useSessionTimer(sessionId: string) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  // Fetch expiration time
  useEffect(() => {
    const fetchExpiration = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('expires_at')
        .eq('id', sessionId)
        .single()

      if (!data || error) return

      const expiresAt = new Date(data.expires_at).getTime()
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setSecondsLeft(diff)
    }

    fetchExpiration()
  }, [sessionId, supabase])

  // Countdown timer
  useEffect(() => {
    if (secondsLeft === null) return

    if (secondsLeft <= 0) {
      router.push('/home')
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev && prev > 0 ? prev - 1 : prev))
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft, router])

  return {
    secondsLeft,
    showWarning: secondsLeft !== null && secondsLeft <= WARNING_THRESHOLD,
    isCritical: secondsLeft !== null && secondsLeft <= CRITICAL_THRESHOLD,
  }
}