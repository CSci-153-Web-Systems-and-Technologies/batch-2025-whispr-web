import PostCard from '@/components/PostCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { usePostsQuery } from '@/hooks/use-posts-query';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface UserFeedProps {
  targetUserId: string; 
}

const UserFeed = ({targetUserId}: UserFeedProps) => {
  const supabase = createClient()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { posts, refetch } = usePostsQuery();

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
                  anonId={post.author_name} 
                  content={post.content} 
                  createdAt={post.created_at} 
                  likesCount={post.likesCount || 0}
                  initialIsLiked={post.isLikedByMe || false}
                  canManagePost={post.canManagePost}
                  onPostChange={refetch}
                />
              )
            })
        }
        
      </CardContent>
    </Card>
  )
}

export default UserFeed
