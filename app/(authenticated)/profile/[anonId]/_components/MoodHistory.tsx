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
import { ScrollArea } from '@/components/ui/scroll-area';

const MoodHistory = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const numberOfDays = new Date(year, date.getMonth() + 1, 0).getDate();

  return (
    <Card className='w-125 h-max'>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
        <CardDescription>
          Track your emotional trends within this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <h1 className='font-semibold text-center text-base mb-3 bg-primary text-white py-1 rounded-md'>{`${month} ${year}`}</h1>
          <ScrollArea className='rounded-md border p-2'>
            <div className='flex flex-col gap-2  h-80'>
              {
                Array.from({ length: day }, (_, i) => i + 1).map((dayNum) => (
                  <div key={dayNum} className='flex items-center justify-around gap-5 py-3 bg-secondary/50 rounded-sm'>
                    <span className='w-25 font-semibold'>{dayNum}</span>
                    <div>
                      {/* Mood Image can be added here */}
                    </div>
                    <span>-</span>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default MoodHistory
