'use client'

import React, { createContext, useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

const WARNING_THRESHOLD = 15
const CRITICAL_THRESHOLD = 5

export interface SessionContextType {
  sessionId: string
  secondsLeft: number | null
  showWarning: boolean
  showExtendDialog: boolean 
  showFeedbackDialog: boolean // logic updated
  isCritical: boolean
  isWaitingForOther: boolean
  dismissWarning: () => void
  resetWarning: () => void
  setIsWaitingForOther: (value: boolean) => void
  setIsFeedbackOpen: React.Dispatch<React.SetStateAction<boolean>>
  endSession: () => Promise<void> // Exposed for your "Leave Chat" button
}

export const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const sessionId = params.sessionId as string
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isWaitingForOther, setIsWaitingForOther] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false) // New State

  const hasEndedRef = useRef(false)
  const currentSessionIdRef = useRef<string>('')

  const endSession = useCallback(async () => {
    if (!sessionId) return
    
    setSecondsLeft(0)
    hasEndedRef.current = true

    setIsFeedbackOpen(true) 
    localStorage.removeItem(`session_warning_dismissed_${sessionId}`)

    try {
      await fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }, [sessionId])

  // Intercept Browser Back Button
  useEffect(() => {
    if (!sessionId || isFeedbackOpen) return

    window.history.pushState(null, '', window.location.href)

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault() 
      window.history.pushState(null, '', window.location.href)

      endSession()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [sessionId, isFeedbackOpen, endSession])

  // Reset all state when session changes
  useEffect(() => {
    hasEndedRef.current = false
    setExpiryTimestamp(null)
    setSecondsLeft(null)
    setIsWaitingForOther(false)
    setIsFeedbackOpen(false)
    
    if (!sessionId) {
      currentSessionIdRef.current = ''
      return
    }

    currentSessionIdRef.current = sessionId
    const storageKey = `session_warning_dismissed_${sessionId}`
    setIsDismissed(localStorage.getItem(storageKey) === 'true')
  }, [sessionId])

  // Fetch session expiration data
  useEffect(() => {
    if (!sessionId) return

    let isMounted = true
    
    const fetchExpiration = async () => {
      if (currentSessionIdRef.current !== sessionId) return

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('expires_at, user_a_wants_extend, user_b_wants_extend, user_a, user_b')
        .eq('id', sessionId)
        .single()

      if (!isMounted || currentSessionIdRef.current !== sessionId || error || !data) return

      setExpiryTimestamp(new Date(data.expires_at).getTime())

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const isUserA = data.user_a === user.id
      const currentUserWants = isUserA ? data.user_a_wants_extend : data.user_b_wants_extend
      const otherUserWants = isUserA ? data.user_b_wants_extend : data.user_a_wants_extend
      
      setIsWaitingForOther(currentUserWants && !otherUserWants)
    }
    
    fetchExpiration()
    return () => { isMounted = false }
  }, [sessionId, supabase])

  // Handle realtime updates
  useEffect(() => {
    if (!sessionId) return

    let isSubscribed = true

    const handleUpdate = async (payload: any) => {
      if (!isSubscribed || currentSessionIdRef.current !== sessionId) return

      const newData = payload.new

      // Get current user info
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isSubscribed || currentSessionIdRef.current !== sessionId) return

      const isUserA = newData.user_a === user.id
      const currentUserWants = isUserA ? newData.user_a_wants_extend : newData.user_b_wants_extend
      const otherUserWants = isUserA ? newData.user_b_wants_extend : newData.user_a_wants_extend

      // Handle extension decline - check if OTHER user declined
      if (newData.extension_declined && !otherUserWants) {
        if (currentUserWants || isWaitingForOther) {
          toast.error('Your partner declined the extension')
          setIsWaitingForOther(false)
          dismissWarning()
        }
        return
      }

      if (!currentUserWants && isWaitingForOther) {
        setIsWaitingForOther(false)
        return
      }

      // Handle session extension
      if (newData.expires_at) {
        const newExpiresAt = new Date(newData.expires_at).getTime()
        if (expiryTimestamp && newExpiresAt > expiryTimestamp) {
          setExpiryTimestamp(newExpiresAt)
          setIsWaitingForOther(false)
          resetWarning()
          toast.success('Session extended by 3 minutes!')
        }
      }
    }

    const handleDelete = () => {
      if (!isSubscribed || currentSessionIdRef.current !== sessionId) return
      
      // If partner deleted/ended session, show feedback instead of immediate redirect
      toast.info('Session ended')
      setIsFeedbackOpen(true)
      localStorage.removeItem(`session_warning_dismissed_${sessionId}`)
    }

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `id=eq.${sessionId}`
      }, handleUpdate)
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `id=eq.${sessionId}`
      }, handleDelete)
      .subscribe()

    return () => {
      isSubscribed = false
      supabase.removeChannel(channel)
    }
  }, [sessionId, supabase, router, expiryTimestamp, isWaitingForOther])

  // Timer countdown
  useEffect(() => {
    if (!expiryTimestamp || !sessionId) return

    const effectSessionId = sessionId
    const effectExpiryTimestamp = expiryTimestamp

    const tick = () => {
      if (currentSessionIdRef.current !== effectSessionId) return

      const diff = Math.max(0, Math.floor((effectExpiryTimestamp - Date.now()) / 1000))
      setSecondsLeft(diff)

      if (diff <= 0 && !hasEndedRef.current && currentSessionIdRef.current === effectSessionId) {
        endSession()
      }
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [expiryTimestamp, sessionId, endSession])

  const dismissWarning = () => {
    setIsDismissed(true)
    setIsWaitingForOther(false)
    localStorage.setItem(`session_warning_dismissed_${sessionId}`, 'true')
  }

  const resetWarning = () => {
    setIsDismissed(false)
    setIsWaitingForOther(false)
    localStorage.removeItem(`session_warning_dismissed_${sessionId}`)
  }

  const showWarning = secondsLeft !== null && secondsLeft <= WARNING_THRESHOLD
  const showExtendDialog = showWarning && !isDismissed
  
  const showFeedbackDialog = (secondsLeft !== null && secondsLeft === 0) || isFeedbackOpen

  const value = {
    sessionId,
    secondsLeft,
    showWarning,
    showExtendDialog,
    showFeedbackDialog,
    isCritical: secondsLeft !== null && secondsLeft <= CRITICAL_THRESHOLD,
    isWaitingForOther,
    dismissWarning,
    resetWarning,
    setIsWaitingForOther,
    setIsFeedbackOpen,
    endSession
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}