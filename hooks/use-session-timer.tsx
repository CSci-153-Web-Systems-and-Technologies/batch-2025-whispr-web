'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// in seconds
const WARNING_THRESHOLD = 15
const CRITICAL_THRESHOLD = 5

export function useSessionTimer(sessionId: string) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const hasEndedRef = useRef(false);

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
      if (!hasEndedRef.current) {
        hasEndedRef.current = true;
        
        const endSession = async () => {
            const res = await fetch('/api/chat/end', {
                method: 'POST',
                body: JSON.stringify({ sessionId }),
            });

            if (!res.ok) {
                toast.error('Failed to end chat session. Please contact the developer to prevent future issues.');
                return;
            }

            toast.success('Chat session has ended.');
            router.push('/home');
        };
        endSession();
      }
      return;
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