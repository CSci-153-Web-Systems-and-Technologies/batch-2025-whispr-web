"use client" 

import Loading from "@/app/loading";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MoodCheckCard = () => {

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMoodData = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }
      
      const { data: streakData, error: streakError } = await supabase.rpc('get_mood_streaks', {
        target_user_id: user.id
      });

      if (streakData && !streakError) {
        setStreakCount(streakData.current_streak); 
      }

      const { data: moodData } = await supabase
        .from('moods')
        .select('mood, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!moodData || moodData.length === 0) {
        setIsLoading(false);
        return;
      };

      const lastEntryDate = new Date(moodData[0].created_at).toDateString();
      const today = new Date().toDateString();

      if (lastEntryDate === today) {
        setSelectedMood(moodData[0].mood);
      }

      setIsLoading(false);
  } 

  useEffect(() => {
    fetchMoodData();
  }, []);
  
  const handleCheckIn = async (mood: string) => {
    setSelectedMood(mood);
    setIsLoading(true);
    const res = await fetch('/api/mood-checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mood }),
    })

    if (res.ok) {
      toast.success('Mood check-in recorded successfully');
      fetchMoodData(); 
    } else {
      toast.error('Failed to save mood');
      setSelectedMood(null); 
      setIsLoading(false);
    }
  }

  if (selectedMood) {
    return (
      <Card className='flex flex-1 '>
        <CardHeader>
          <CardTitle className="text-primary">Check-in Complete!</CardTitle>
          <CardDescription>
            Remember, your feelings are valid. We're here when you need us.
          </CardDescription>
          <CardContent className="flex items-center justify-evenly mt-4 h-25">
            {
              isLoading ? (
                <Loading />
              ) :
              <>
                <div className="flex max-sm:flex-col items-center gap-1 sm:gap-3">
                <Image
                  src={`${selectedMood.toLowerCase()}-feeling.svg`}
                  width={50} height={50}
                  alt={`${selectedMood} Feeling`}
                />
                <span className="font-medium sm-lg sm:text-2xl">{selectedMood}</span>
              </div>
              <Separator orientation="vertical"/>
              <div className="flex items-center gap-3">
                <Image
                  src='fire.svg'
                  width={50} height={50}
                  alt='streak icon'
                />
                <span className="font-medium text-2xl">{streakCount}</span>
              </div>
            </>
            }
          </CardContent>
      </CardHeader>
      </Card>
          
    );
  }

  return (
    <Card className='flex flex-1'>
      <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>
            Track your mood throughout the day by logging how you feel.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap justify-center items-center'>
          {
            isLoading ? (
              <Loading />
            ) : 
            <>
              <CardAction>
                <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105' onClick={() => handleCheckIn('Neutral')}>
                  <Image
                    src="neutral-feeling.svg"
                    width={50} height={50}
                    alt='Neutral Feeling'
                  />
                  Neutral
                </Button>
              </CardAction>
              <CardAction>
                <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105' onClick={() => handleCheckIn('Happy')}>
                  <Image
                    src="happy-feeling.svg"
                    width={50} height={50}
                    alt='Happy Feeling'
                  />
                  Happy
                </Button>
              </CardAction>
              <CardAction>
                <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105' onClick={() => handleCheckIn('Sad')}>
                  <Image
                    src="sad-feeling.svg"
                    width={50} height={50}
                    alt='Sad Feeling'
                  />
                  Sad
                </Button>
              </CardAction>
              <CardAction>
                <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105' onClick={() => handleCheckIn('Anxious')}>
                  <Image
                    src="anxious-feeling.svg"
                    width={50} height={50}
                    alt='Anxious Feeling'
                  />
                  Anxious
                </Button>
              </CardAction>
              <CardAction>
                <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105' onClick={() => handleCheckIn('Frustated')}>
                  <Image
                    src="frustated-feeling.svg"
                    width={50} height={50}
                    alt='Frustated Feeling'
                  />
                  Frustated
                </Button>
              </CardAction>
            </>
          }
        </CardContent>
    </Card>
  )
}

export default MoodCheckCard
