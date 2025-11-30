'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from './use-current-user'

export function useChatPartner(sessionId: string, currentUserId: string) {
  const [partner, setPartner] = useState<User>({ id: '', name: '' })
  const supabase = createClient()

  useEffect(() => {
    if (!sessionId || !currentUserId) return

    const getPartner = async () => {
      try {
        // Get all participants in this session
        const { data: participants } = await supabase
          .from('chat_sessions')
          .select('user_a, user_b')
          .eq('id', sessionId)
          .single()

        if (!participants) {
          return
        }

        // Find the partner (the one who is NOT the current user)
        const partnerId = participants.user_a === currentUserId 
          ? participants.user_b 
          : participants.user_a;

        // Get partner's anon name
        const { data: user } = await supabase
          .from('anon_users')
          .select('anon_id')
          .eq('id', partnerId)
          .single()

        if (user) {
          setPartner({ id: partnerId, name: user.anon_id })
        }
      } catch (error) {
        console.error('Error fetching chat partner:', error)
      } finally {
      }
    }

    getPartner()
  }, [sessionId, currentUserId, supabase])

  return { partner }
}