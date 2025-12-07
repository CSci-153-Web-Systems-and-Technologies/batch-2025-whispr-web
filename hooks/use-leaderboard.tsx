"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import type { LeaderboardUser } from "@/types"



export function useLeaderboard() {
  const [topListeners, setTopListeners] = useState<LeaderboardUser[]>([])
  const [topVenters, setTopVenters] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)

      // 1. Fetch Top Listeners
      const listenersQuery = supabase
        .from('anon_users')
        .select('anon_id, listening_pts')
        .gt('listening_pts', 0) // Optional: Hide users with 0 points
        .order('listening_pts', { ascending: false })
        .limit(3)

      // 2. Fetch Top Venters
      const ventersQuery = supabase
        .from('anon_users')
        .select('anon_id, venting_pts')
        .gt('venting_pts', 0)
        .order('venting_pts', { ascending: false })
        .limit(3)

      // Run both in parallel for speed
      const [listenersRes, ventersRes] = await Promise.all([
        listenersQuery, 
        ventersQuery
      ])

      if (listenersRes.data) {
        setTopListeners(listenersRes.data.map((u: any) => ({
          id: u.id,
          anonId: u.anon_id || 'Anonymous',
          points: u.listening_pts
        })))
      }

      if (ventersRes.data) {
        setTopVenters(ventersRes.data.map((u: any) => ({
          id: u.id,
          anonId: u.anon_id || 'Anonymous',
          points: u.venting_pts
        })))
      }

      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [])

  return { topListeners, topVenters, isLoading }
}