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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PostInput = () => {
  const [postContent, setPostContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  }

  return (
    <Card>
      <CardContent>
        <div className='flex gap-4'>
          <Avatar className='w-10 h-10'>
            <AvatarFallback className='bg-secondary'>
              <User fill='black' size={25}/>
            </AvatarFallback>
          </Avatar>
          
          <Textarea 
            placeholder="Share what's on your mind anonymously..." 
            className='rounded-3xl min-h-10 max-h-50 resize-none overflow-y-auto'
            value={postContent}
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className='ml-auto rounded-full' disabled={postContent.trim() === ""}>
          <Send className='w-5! h-5!'/>
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PostInput
