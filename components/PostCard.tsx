"use client"

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/utils/supabase/client'
import { Heart, MoreVertical, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import CustomAvatar from './CustomAvatar'
import PostDialog from './PostDialog'

interface PostCardProps {
  id: string;
  anonId?: string;
  content?: string;
  createdAt?: string;
  likesCount: number;
  distance?: number;
  canManagePost?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  initialIsLiked?: boolean;
  onPostChange?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id, 
  anonId,
  content,
  createdAt,
  initialIsLiked = false,
  likesCount,
  distance,
  canManagePost,
  onPostChange,
}) => {
  const supabase = createClient();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState<number>(likesCount ?? 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const profileURL = anonId ? `/profile/${anonId}`: '#';

  const getDate = () => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const getTime = () => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }); 
  }

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(newLikesCount);

    const { error } = await supabase.rpc('toggle_like', { 
      target_post_id: id 
    });

    if (error) {
      console.error(error);
      toast.error("Failed to update like");
      setIsLiked(!newIsLiked);
      setLikes(likes); 
    }
  }

  return (
    <Card onDoubleClick={handleLike}>
      <CardHeader className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Link href={profileURL}>
            <CustomAvatar name={anonId}/>
          </Link>
          <div className='flex flex-col gap-1'>
            <Link href={profileURL}>
              <CardTitle className='text-sm'>{anonId || 'Anonymous'}</CardTitle>
            </Link>
            <CardDescription className='text-xs text-muted-foreground'>
              {`${getDate()} • ${getTime()} `}
              {distance ? `• ${distance.toFixed(1)}m away` : ''}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canManagePost && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* EDIT BUTTON */}
                <PostDialog dialogType='edit' postId={id} initialContent={content} onSuccess={onPostChange} onOpenChange={(open) => !open && setDropdownOpen(false)}>
                  <DropdownMenuItem 
                    className='cursor-pointer' 
                    onSelect={(e) => e.preventDefault()} 
                    asChild
                  >
                    <Button variant="ghost" className="flex justify-start w-full group hover:bg-primary! hover:text-white!">
                      <Pencil className="mr-2 h-4 w-4 group-hover:fill-white group-hover:text-white"/> 
                      Edit
                    </Button>
                  </DropdownMenuItem>
                </PostDialog>

                {/* DELETE BUTTON */}
                <PostDialog dialogType='delete' postId={id} onSuccess={onPostChange} onOpenChange={(open) => !open && setDropdownOpen(false)}>
                  <DropdownMenuItem 
                    className='cursor-pointer text-destructive' 
                    onSelect={(e) => e.preventDefault()} 
                    asChild
                  >
                    <Button variant="ghost" className="flex justify-start w-full group hover:bg-destructive! hover:text-black! hover:ring-destructive/50!">
                      <Trash className="mr-2 h-4 w-4 group-hover:fill-black group-hover:text-black"/> 
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </PostDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className='whitespace-pre-wrap wrap-break-word'>{content}</CardContent>
      <CardFooter>
        <CardAction className='flex items-center'>
          <Button variant="ghost" onClick={handleLike} className='hover:bg-transparent hover:text-destructive hover:scale-105'>
            <Heart fill={isLiked ? "red" : "none"} stroke={isLiked ? "none" : "black"} className='h-6! w-6!'/>
          </Button>
          <span className='text-sm'>{likes} likes</span>
        </CardAction>
      </CardFooter>
    </Card>
  )
}

export default PostCard
