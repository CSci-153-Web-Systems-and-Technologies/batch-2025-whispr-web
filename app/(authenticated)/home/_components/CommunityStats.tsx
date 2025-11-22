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

const CommunityStats = () => {
  return (
    <Card className='w-75 h-max sticky top-25'>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between gap-5'>
          <span className='text-muted-foreground'>Active Users Nearby</span>
          <span className='font-semibold'>0</span>
        </div>
        <div className='flex justify-between gap-5'>
          <span className='text-muted-foreground'>Your Listening Points</span>
          <span className='font-semibold'>0</span>
        </div>
        <div className='flex justify-between gap-5'>
          <span className='text-muted-foreground'>Your Venting Points</span>
          <span className='font-semibold'>0</span>
        </div>
        <div className='flex justify-between gap-5'>
          <span className='text-muted-foreground'>Your Streak</span>
          <span className='font-semibold'>0</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default CommunityStats
