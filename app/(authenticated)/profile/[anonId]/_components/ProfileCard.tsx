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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from 'lucide-react'

const ProfileCard = () => {
  return (
    <Card className='flex flex-1 justify-center rounded-r-none'>
      <CardContent className='flex flex-col items-center justify-center'>
        <Avatar className='flex items-center justify-center p-15 border-2 border-primary'>
          <AvatarFallback className='flex items-end bg-secondary font-medium w-max h-max'>
            <User className='w-30 h-30 fill-primary text-primary mt-8.5'/>
          </AvatarFallback>
        </Avatar>
        <h1 className='text-xl font-semibold mt-5'>AnonymousUser</h1>
        <div className='flex gap-5 mt-5'>
          <div className='flex flex-col items-center border rounded-lg shadow-md p-5'>
            <span className='text-primary text-2xl font-semibold'>0</span>
            <span className='text-muted-foreground text-sm'>Listening Points</span>
          </div>
          <div className='flex flex-col items-center border rounded-lg shadow-md p-5 '>
            <span className='text-primary text-2xl font-semibold'>0</span>
            <span className='text-muted-foreground text-sm'>Venting Points</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
