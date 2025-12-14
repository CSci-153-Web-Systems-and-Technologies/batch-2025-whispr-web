"use client"

import Loading from '@/app/loading'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ActivitySummary from './_components/ActivitySummary'
import MoodHistory from './_components/MoodHistory'
import ProfileCard from './_components/ProfileCard'
import UserFeed from './_components/UserFeed'

const page = () => {
  const supabase = createClient();
  const params = useParams();
  const anonId = Array.isArray(params.anonId) ? params.anonId[0] : params.anonId;
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
      const { data: user } = await supabase
        .from('anon_users')
        .select('id')
        .eq('anon_id', anonId)
        .single();

      if (user) {
        setUserId(user.id);
      }
      setIsLoading(false);
    }
    fetchUserId();
  }, [params.anonId]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Loading />
      </div>
    );
  }

  if(!userId || !anonId) return null;

  return (
    <div className='flex flex-col gap-5 p-6 mt-15 sm:p-15'>
      <div className='flex max-sm:flex-col w-full '>
        <ProfileCard />
        <ActivitySummary targetUserId={userId} />
      </div>
      <div className='flex max-lg:flex-col gap-5'>
        <MoodHistory targetUserId={userId}/>
        <UserFeed targetUserId={userId}/>
      </div>
    </div>
  )
}

export default page
