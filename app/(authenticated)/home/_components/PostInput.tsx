"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Textarea } from '@/components/ui/textarea'
import { Send, User } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const PostInput = () => {
  const [postContent, setPostContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/post',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: postContent.trim() }),
    })

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error submitting post:", errorData.error);
      toast.error('Error submitting post. Please try again.');
      return;
    }
    toast.success('Post submitted!');
    setPostContent("");
  }

  return (
    <form onSubmit={handleSubmit}>
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
              className='rounded-3xl min-h-10 max-h-50 resize-none overflow-y-auto whitespace-pre-wrap flex-1'
              value={postContent}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' className='ml-auto rounded-full' disabled={postContent.trim() === ""}>
            <Send className='w-5! h-5!'/>
            Share
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default PostInput
