"use client"

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useOnlineCount } from '@/hooks/use-online-count'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createClient } from '@/utils/supabase/client'
import { useLeaderboard } from '@/hooks/use-leaderboard'

const CommunityStats = () => {
  const supabase = createClient();
  const [streakCount, setStreakCount] = useState(0);
  const onlineCount = useOnlineCount();
  const {currentUser} = useCurrentUser();
  const { topListeners, topVenters } = useLeaderboard();

  useEffect(() => {
      const fetchStreakData = async () => {
          const { data: streakData, error: streakError } = await supabase.rpc('get_mood_streaks');
          if (streakData && !streakError) {
            setStreakCount(streakData.current_streak); 
          }
      }
      fetchStreakData();
  }, [streakCount]);

  if(!currentUser) return null;

  return (
    <div className='flex flex-col gap-4 sticky top-25'>
      <Card className='w-75 h-max'>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Active Users Nearby</span>
            <span className='font-semibold'>{onlineCount}</span>
          </div>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Your Listening Points</span>
            <span className='font-semibold'>{currentUser.listeningPts}</span>
          </div>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Your Venting Points</span>
            <span className='font-semibold'>{currentUser.ventingPts}</span>
          </div>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Your Streak</span>
            <span className='font-semibold'>{streakCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className='w-75 h-max'>
        <CardHeader>
          <CardTitle>Top Listener</CardTitle>
          <CardDescription>Honoring the kind souls who lend a listening ear.</CardDescription>
        </CardHeader>
        <CardContent>
          {
            topListeners.length === 0 ? (
              <p className='text-center text-muted-foreground'>No data available</p>
            ) : 
              topListeners.map((user, index) => (
                <div key={user.id} className='flex justify-between gap-5'>
                  <span>{index+1}</span>
                  <span>{user.anonId}</span>
                  <span className='font-semibold'>{user.points}</span>
                </div>
              )
            )
          }
        </CardContent>
      </Card>

      <Card className='w-75 h-max'>
        <CardHeader>
          <CardTitle>Top Venter</CardTitle>
          <CardDescription>Recognizing the courage to be open and vulnerable.</CardDescription>
        </CardHeader>
        <CardContent>
          {
            topVenters.length === 0 ? (
              <p className='text-center text-muted-foreground'>No data available</p>
            ) : 
              topVenters.map((user, index) => (
                <div key={user.id} className='flex justify-between gap-5'>
                  <span>{index+1}</span>
                  <span>{user.anonId}</span>
                  <span className='font-semibold'>{user.points}</span>
                </div>
              )
            )
          }
        </CardContent>
      </Card>
    </div>
    
  )
}

export default CommunityStats
