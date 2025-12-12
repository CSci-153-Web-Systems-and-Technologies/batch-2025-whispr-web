"use client"

import Loading from '@/app/loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Stats = {
  listenedMinutes: number | null;
  ventedMinutes: number | null;
  todaysMood: string | null;
  highestMoodStreak: number | null;
}

interface ActivitySummaryProps {
  targetUserId: string;
}

const ActivitySummary = ({targetUserId}: ActivitySummaryProps) => {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({
    listenedMinutes: 0,
    ventedMinutes: 0,
    todaysMood: null,
    highestMoodStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      const activityReq = supabase.rpc('get_user_activity_stats', {
        target_user_id: targetUserId
      });

      const streakReq = supabase.rpc('get_mood_streaks', {
        target_user_id: targetUserId
      });

      const moodReq = supabase
        .from('moods')
        .select('mood, created_at')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const [activityRes, streakRes, moodRes] = await Promise.all([
        activityReq, 
        streakReq, 
        moodReq
      ]);

      let todaysMood = "No data";
      
      if (moodRes.data) {
        const moodDate = new Date(moodRes.data.created_at).toDateString();
        const todayDate = new Date().toDateString();

        if (moodDate === todayDate) {
          todaysMood = moodRes.data.mood;
        }
      }

      if (activityRes.data && streakRes.data) {
        setStats({
          listenedMinutes: activityRes.data.listening_minutes ?? 0,
          ventedMinutes: activityRes.data.venting_minutes ?? 0,
          todaysMood: todaysMood,
          highestMoodStreak: streakRes.data.longest_streak ?? 0, 
        });
      }

      setIsLoading(false);
    }
    fetchStats();
  }, [targetUserId]);

  return (
    <Card className='flex-1 h-max max-sm:rounded-t-none sm:rounded-l-none sm:border-l-0'>
        {
          isLoading || !stats ? 
            <Loading /> : (
              <>
                <CardHeader>
                  <CardTitle className='text-lg'>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                  <div className='flex gap-5 items-center'>
                    <div className='flex items-center justify-center  bg-secondary rounded-full p-2 w-max'>
                      <Image 
                        width={30} height={30}
                        alt='Ear icon'
                        src="/ear-icon.svg"
                        
                      />
                    </div>
                    <p>
                      Listened for a total of <span className='font-semibold text-primary'>{stats?.listenedMinutes?.toFixed(1)}</span> minutes.
                    </p>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
                      <Image 
                        width={30} height={30}
                        alt='Ear icon'
                        src="/speech-balloon.svg"
                        
                      />
                    </div>
                    <p>
                      Vented for a total of <span className='font-semibold text-primary'>{stats?.ventedMinutes?.toFixed(1)}</span> minutes.
                    </p>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
                      <Image 
                        width={30} height={30}
                        alt='Ear icon'
                        src="/neutral-feeling.svg"
                        
                      />
                    </div>
                    <p>
                      {
                        stats?.todaysMood  === "No data" || !stats?.todaysMood ?
                        <>No mood logged today.</> :
                        <>Today's mood is <span className='font-semibold text-primary'>{stats?.todaysMood}</span>.</>
                      }
                    </p>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
                      <Image 
                        width={30} height={30}
                        alt='Ear icon'
                        src="/fire.svg"
                        
                      />
                    </div>
                    <p>
                      Highest mood streak is <span className='font-semibold text-primary'>{stats?.highestMoodStreak}</span>.
                    </p>
                  </div>
                </CardContent>
              </>
            )
        }
    </Card>
  )
}

export default ActivitySummary
