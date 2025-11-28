"use client"

import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Heart, MoreVertical, Pencil, Trash } from 'lucide-react'

interface PostCardProps {
  anonId?: string;
  content?: string;
  createdAt?: string;
  likesCount?: number;
  distance?: number;
  canManagePost?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  anonId,
  content,
  createdAt,
  likesCount,
  distance,
  canManagePost,
  onEdit,
  onDelete,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount || 0);

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1);
  }

  return (
    <Card onDoubleClick={handleLike}>
      <CardHeader className='flex justify-between items-center'>
        <div className='flex items-center'>
          <Avatar className='w-10 h-10 mr-4'>
            <AvatarFallback className='bg-secondary font-medium'>LI</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-1'>
            <CardTitle className='font-semibold'>AnonymousUser</CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              Nov 11, 2025 • 2:30 PM • 1.0km away
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canManagePost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className='cursor-pointer' asChild>
                  <Button variant="ghost" className=" flex justify-start w-full group hover:bg-primary! hover:text-white!">
                    <Pencil className="mr-2 h-4 w-4 group-hover:fill-white group-hover:text-white text-"/> Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className='cursor-pointer text-destructive' asChild>
                  <Button variant="ghost" className="flex justify-start w-full group hover:bg-destructive! hover:text-black! hover:ring-destructive/50!">
                    <Trash className="mr-2 h-4 w-4 group-hover:fill-black group-hover:text-black text-"/> Delete
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus nulla gravida orci.
      </CardContent>
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
