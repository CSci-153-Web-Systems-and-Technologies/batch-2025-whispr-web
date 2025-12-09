"use client"

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

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: user } = await supabase
        .from('anon_users')
        .select('id')
        .eq('anon_id', anonId)
        .single();

      if (user) {
        setUserId(user.id);
      }
    }
    fetchUserId();
  }, [params.anonId]);

  if(!userId || !anonId) return;

  return (
    <div className='flex flex-col gap-5 pt-25 p-15'>
      <div className='flex w-full '>
        <ProfileCard />
        <ActivitySummary targetUserId={userId} />
      </div>
      <div className='flex gap-5'>
        <MoodHistory targetUserId={userId}/>
        <UserFeed targetUserId={userId}/>
      </div>
    </div>
  )
}

export default page
