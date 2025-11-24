import React from 'react'
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

const UserFeed = () => {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
        <CardDescription>Posts you've made recently</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <PostCard canManagePost={true}/>
        <PostCard canManagePost={true}/>
        <PostCard canManagePost={true}/>
        <PostCard canManagePost={true}/>
      </CardContent>
    </Card>
  )
}

export default UserFeed
