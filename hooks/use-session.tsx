import { useContext } from 'react'
import { SessionContext } from '@/context/SessionContext'

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionTimer must be used within a SessionTimerProvider')
  }
  return context
}