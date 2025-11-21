"use client"

import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

const PostCard = () => {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <Card onDoubleClick={handleLike}>
      <CardHeader className='flex justify-between items-center'>
        <div className='flex items-center'>
          <Avatar className='w-10 h-10 mr-4'>
            <AvatarFallback className='bg-secondary font-medium'>LI</AvatarFallback>
          </Avatar>
          <CardTitle>Lorem Ipsum</CardTitle>
        </div>
        <span className='text-muted-foreground text text-sm'>1.0km away</span>
      </CardHeader>
      <CardContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus nulla gravida orci.
      </CardContent>
      <CardFooter>
        <CardAction className='flex items-center'>
          <Button variant="ghost" onClick={handleLike} className='hover:bg-transparent hover:text-destructive hover:scale-105'>
            <Heart fill={isLiked ? "red" : "none"} stroke={isLiked ? "none" : "black"} className='h-6! w-6!'/>
          </Button>
          <span className='text-sm'>0 likes</span>
        </CardAction>
      </CardFooter>
    </Card>
  )
}

export default PostCard
