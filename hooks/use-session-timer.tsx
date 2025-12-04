import { useContext } from 'react'
import { SessionTimerContext } from '@/context/SessionTimerContext'

export function useSessionTimer() {
  const context = useContext(SessionTimerContext)
  if (!context) {
    throw new Error('useSessionTimer must be used within a SessionTimerProvider')
  }
  return context
}