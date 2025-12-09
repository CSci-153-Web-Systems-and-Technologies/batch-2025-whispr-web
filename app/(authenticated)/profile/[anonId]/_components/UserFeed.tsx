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
import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client';
import { usePostsQuery } from '@/hooks/use-posts-query';

interface UserFeedProps {
  targetUserId?: string; 
  anonId?: string;
}

const UserFeed = ({targetUserId, anonId}: UserFeedProps) => {
  const supabase = createClient()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { posts } = usePostsQuery();

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const { data: {user} } = await supabase.auth.getUser();
      if(user) setCurrentUserId(user.id);
    }
    fetchCurrentUserId();
  }, []);

  if (!targetUserId || !currentUserId) return;

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
        <CardDescription>Posts you've made recently</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {
          posts
            .filter(post => post.author_id === targetUserId)
            .map(post => {
              return (
                <PostCard 
                  key={post.id}
                  id={post.id} 
                  anonId={anonId} 
                  content={post.content} 
                  createdAt={post.created_at} 
                  likesCount={post.likesCount || 0}
                  initialIsLiked={post.isLikedByMe || false}
                  canManagePost={targetUserId === currentUserId}
                />
              )
            })
        }
        
      </CardContent>
    </Card>
  )
}

export default UserFeed
