'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

const WARNING_THRESHOLD = 15
const CRITICAL_THRESHOLD = 5

export interface SessionTimerContextType {
  secondsLeft: number | null
  showWarning: boolean
  showExtendDialog: boolean 
  isCritical: boolean
  dismissWarning: () => void
  resetWarning: () => void
}

export const SessionTimerContext = createContext<SessionTimerContextType | null>(null)

export function SessionTimerProvider({ 
  children, 
}: { 
  children: ReactNode,
}) {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)
  
  const [isDismissed, setIsDismissed] = useState(false)

  const supabase = createClient()
  const router = useRouter()
  const hasEndedRef = useRef(false)

  // Check Dismissed State from Local Storage
  useEffect(() => {
    if (!sessionId) return
    
    const storageKey = `session_warning_dismissed_${sessionId}`
    const storedValue = localStorage.getItem(storageKey)
    
    if (storedValue === 'true') setIsDismissed(true);
  }, [sessionId])

  // Fetch Expiration
  useEffect(() => {
    if (!sessionId) {
      setSecondsLeft(null)
      return
    }
    
    const fetchExpiration = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('expires_at')
        .eq('id', sessionId)
        .single()

      if (!data || error) return

      const expiresAt = new Date(data.expires_at).getTime()
      setExpiryTimestamp(expiresAt)
    }
    fetchExpiration()
  }, [sessionId, supabase])

  // Timer Logic
  useEffect(() => {
    if (!expiryTimestamp) return

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expiryTimestamp - now) / 1000))
      
      setSecondsLeft(diff)

      if (diff <= 0) {
        if (!hasEndedRef.current) {
          hasEndedRef.current = true
          
          const endSession = async () => {
            setSecondsLeft(0) 
            try {
              const res = await fetch('/api/chat/end', {
                method: 'POST',
                body: JSON.stringify({ sessionId }),
              })
              if (!res.ok) throw new Error('Failed to end session')
              toast.success('Chat session has ended.')
              router.push('/home')
            } catch (error) {
              console.error(error)
            }
          }
          endSession()
        }
      }
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiryTimestamp, router, sessionId])

  const dismissWarning = () => {
    setIsDismissed(true)
    localStorage.setItem(`session_warning_dismissed_${sessionId}`, 'true')
  }

  const resetWarning = () => {
    setIsDismissed(false)
    localStorage.removeItem(`session_warning_dismissed_${sessionId}`)
  }

  const showWarning = 
    secondsLeft !== null && 
    secondsLeft <= WARNING_THRESHOLD

  const showExtendDialog = showWarning && !isDismissed

  const value = {
    secondsLeft,
    showWarning,
    showExtendDialog,
    isCritical: secondsLeft !== null && secondsLeft <= CRITICAL_THRESHOLD,
    dismissWarning,
    resetWarning
  }

  return (
    <SessionTimerContext.Provider value={value}>
      {children}
    </SessionTimerContext.Provider>
  )
}
