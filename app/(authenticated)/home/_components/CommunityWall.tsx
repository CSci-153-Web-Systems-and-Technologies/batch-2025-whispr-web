"use client"

import Loading from '@/app/loading'
import PostCard from '@/components/PostCard'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"
import { usePostsQuery } from '@/hooks/use-posts-query'
import { Post } from '@/types'
import { MessageCircleDashed } from 'lucide-react'
import PostInput from './PostInput'

const CommunityWall = () => {
  const { posts, isLoading, refetch } = usePostsQuery();


  return (
    <div className='flex flex-col flex-1 rounded-xl shadow-md'>
      <div className='flex items-center justify-between bg-secondary rounded-t-xl py-4 px-8'>
        <span>Community Feed</span>
        <span className='flex items-center gap-2 text-sm py-2 px-5 rounded-full'>
          <div className='w-3 h-3 aspect-square bg-primary rounded-full'></div>
          Nearby
        </span>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <PostInput onPostChange={refetch} />
        {
          isLoading ? (
            <div className='py-10'>
              <Loading />
            </div>
          ) : posts.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className='bg-gray-200'>
                  <MessageCircleDashed />
                </EmptyMedia>
                <EmptyTitle>It's quiet here...</EmptyTitle>
                <EmptyDescription>
                  Be the first to break the silence. Share your thoughts anonymously.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            posts.map((post: Post) => (
              <PostCard 
                key={post.id} 
                id={post.id}
                initialIsLiked={post.isLikedByMe}
                likesCount={post.likesCount}
                anonId={post.author_name} 
                content={post.content} 
                createdAt={post.created_at}
                onPostChange={refetch}
                canManagePost={post.canManagePost}
                distance={post.distance}
              />
            ))
          )
        }
      </div>
    </div>
  )
}

export default CommunityWall
