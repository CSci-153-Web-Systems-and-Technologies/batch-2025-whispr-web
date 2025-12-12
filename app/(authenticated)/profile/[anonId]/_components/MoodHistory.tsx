"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MoodHistoryProps {
  targetUserId: string | null;
}

const MoodHistory = ({targetUserId}: MoodHistoryProps) => {
  const [dailyMoods, setDailyMoods] = useState<Record<number, string>>({});
  
  const date = new Date();
  const currentDay = date.getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  useEffect(() => {
    const fetchMonthMoods = async () => {
      const supabase = createClient();
      let userId = targetUserId;

      if (!userId) return;

      const startOfMonth = new Date(year, date.getMonth(), 1).toISOString();
      const endOfMonth = new Date(year, date.getMonth() + 1, 0).toISOString();

      const { data } = await supabase
        .from('moods')
        .select('mood, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)
        .order('created_at', { ascending: true });

      if (data) {
        const moodMap: Record<number, string> = {};
        data.forEach((entry) => {
          const entryDate = new Date(entry.created_at);
          moodMap[entryDate.getDate()] = entry.mood;
        });
        setDailyMoods(moodMap);
      }
    };

    fetchMonthMoods();
  }, []);

  const daysArray = Array.from({ length: currentDay }, (_, i) => i + 1).reverse(); 

  return (
    <Card className='max-lg:flex-1 lg:w-125 h-max'>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
        <CardDescription>
          Track your emotional trends within this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <h1 className='font-semibold text-center text-base mb-3 bg-primary text-white py-1 rounded-md'>
            {`${monthName} ${year}`}
          </h1>
          
          <ScrollArea className='rounded-md border p-2 h-75 md:h-78 lg:h-[400px]'> 
            <div className='flex flex-col gap-2'>
              {
                daysArray.map((dayNum) => {
                  const mood = dailyMoods[dayNum];
                  const isLogged = !!mood; // Helper to check if data exists

                  return (
                    <div 
                      key={dayNum} 
                      className={`flex items-center justify-between px-6 py-3 rounded-sm transition-colors ${
                        isLogged 
                          ? 'bg-secondary/50'
                          : 'bg-gray-300 opacity-60'
                      }`}
                    >
                      <span className='w-10 font-semibold text-foreground'>
                        {dayNum}
                      </span>
                    
                      <div className='flex justify-center w-16'>
                        {mood ? (
                          <Image 
                            src={`/${mood.toLowerCase()}-feeling.svg`}
                            alt={`${mood} mood`}
                            width={35}
                            height={35}
                            className="drop-shadow-sm hover:scale-110 transition-transform"
                          />
                        ) : (
                          <span className="text-muted-foreground text-2xl">•</span> 
                        )}
                      </div>

                      <span className={`w-20 text-right text-sm ${isLogged ? 'font-medium text-primary' : 'text-black'}`}>
                        {mood || "No Data"}
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default MoodHistory