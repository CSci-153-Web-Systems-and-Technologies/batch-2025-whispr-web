"use client"

import PostDialog from '@/components/PostDialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Textarea } from '@/components/ui/textarea'
import { User } from 'lucide-react'
import React, { useState } from 'react'

interface PostInputProps {
  onPostChange?: () => void;
}

const PostInput = ({ onPostChange }: PostInputProps) => {
  const [postContent, setPostContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  }

  return (
    <form>
      <Card>
        <CardContent>
          <div className='flex gap-4'>
            <Avatar className='w-10 h-10'>
              <AvatarFallback className='bg-secondary'>
                <User fill='black' size={25}/>
              </AvatarFallback>
            </Avatar>

            <PostDialog dialogType='add' onSuccess={onPostChange}>
                <Textarea 
                placeholder="Share what's on your mind anonymously..." 
                className='rounded-3xl min-h-10 max-h-50 resize-none overflow-y-auto whitespace-pre-wrap flex-1'
                value={postContent}
                onChange={handleChange}
                readOnly
              />
            </PostDialog>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default PostInput
