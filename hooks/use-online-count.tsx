"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export function useOnlineCount() {
  const [onlineCount, setOnlineCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('global_presence')

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        const uniqueUsers = Object.keys(newState).length
        setOnlineCount(uniqueUsers)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser()
          await channel.track({ 
            user_id: user?.id || 'anon', 
            online_at: new Date().toISOString() 
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return onlineCount
}