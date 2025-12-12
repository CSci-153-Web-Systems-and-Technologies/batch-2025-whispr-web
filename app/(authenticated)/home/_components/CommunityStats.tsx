"use client"

import Loading from '@/app/loading'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useCurrentUser } from '@/hooks/use-current-user'
import { useLeaderboard } from '@/hooks/use-leaderboard'
import { useOnlineCount } from '@/hooks/use-online-count'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

const CommunityStats = () => {
  const supabase = createClient();
  const [streakCount, setStreakCount] = useState(0);
  
  const onlineCount = useOnlineCount();
  const {currentUser} = useCurrentUser();
  const { topListeners, topVenters, isLoading } = useLeaderboard();

  useEffect(() => {
    if(!currentUser) return;
    const fetchStreakData = async () => {
        const { data: streakData, error: streakError } = await supabase.rpc('get_mood_streaks', {
          target_user_id: currentUser?.id
        });
        if (streakData && !streakError) {
          setStreakCount(streakData.current_streak); 
        }
    }
    fetchStreakData();
  }, [currentUser]);

  return (
    <div className='flex flex-col max-md:flex-1 md:w-75 gap-4 relative top-0 md:sticky tsm:top-25'>
      <Card className='w-full h-max'>
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
            <span className='font-semibold'>{currentUser?.listeningPts || 0}</span>
          </div>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Your Venting Points</span>
            <span className='font-semibold'>{currentUser?.ventingPts || 0}</span>
          </div>
          <div className='flex justify-between gap-5'>
            <span className='text-muted-foreground'>Your Streak</span>
            <span className='font-semibold'>{streakCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className='w-full h-max'>
        <CardHeader>
          <CardTitle>Top Listener</CardTitle>
          <CardDescription>Honoring the kind souls who lend a listening ear.</CardDescription>
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <Loading />
            ) : topListeners.length === 0 ? (
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

      <Card className='w-full h-max'>
        <CardHeader>
          <CardTitle>Top Venter</CardTitle>
          <CardDescription>Recognizing the courage to be open and vulnerable.</CardDescription>
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <Loading />
            ) : topVenters.length === 0 ? (
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
