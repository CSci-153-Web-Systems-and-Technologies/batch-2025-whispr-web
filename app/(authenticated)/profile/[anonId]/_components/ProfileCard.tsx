"use client"

import Loading from '@/app/loading'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { User } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { User as UserIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProfileCard = () => {
  const supabase = createClient();
  const params = useParams();
  const anonId = params.anonId;
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const {data, error} = await supabase
      .from('anon_users')
      .select('*')
      .eq('anon_id', anonId)
      .single();

      if(data && !error) {
        setUserProfile(
          {
            id: data.id,
            name: data.anon_id,
            listeningPts: data.listening_pts,
            ventingPts: data.venting_pts,
          }
        );
        setIsLoading(false);
      }
    }
    fetchUserProfile();
  }, []);


  return (
    <Card className='flex flex-1 justify-center rounded-r-none'>
      <CardContent className='flex flex-col items-center justify-center'>
        {
          isLoading || !userProfile ? 
            <Loading /> : (
            <>
              <Avatar className='flex items-center justify-center p-15 border-2 border-primary'>
                <AvatarFallback className='flex items-end bg-secondary font-medium w-max h-max'>
                  <UserIcon className='w-30 h-30 fill-primary text-primary mt-8.5'/>
                </AvatarFallback>
              </Avatar>
              <h1 className='text-xl font-semibold mt-5'>{userProfile?.name || 'AnonymousUser'}</h1>
              <div className='flex gap-5 mt-5'>
                <div className='flex flex-col items-center border rounded-lg shadow-md p-5'>
                  <span className='text-primary text-2xl font-semibold'>{userProfile?.listeningPts}</span>
                  <span className='text-muted-foreground text-sm'>Listening Points</span>
                </div>
                <div className='flex flex-col items-center border rounded-lg shadow-md p-5 '>
                  <span className='text-primary text-2xl font-semibold'>{userProfile?.ventingPts}</span>
                  <span className='text-muted-foreground text-sm'>Venting Points</span>
                </div>
              </div> 
            </>
          )
        }
      </CardContent>
    </Card>
  )
}

export default ProfileCard
