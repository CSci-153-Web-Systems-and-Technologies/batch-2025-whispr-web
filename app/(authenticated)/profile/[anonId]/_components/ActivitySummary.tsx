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
import Image from 'next/image'

const ActivitySummary = () => {
  return (
    <Card className='flex-1 h-max rounded-l-none border-l-0'>
      <CardHeader>
        <CardTitle className='text-lg'>Activity Summary</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        <div className='flex gap-5 items-center'>
          <div className='flex items-center justify-center  bg-secondary rounded-full p-2 w-max'>
            <Image 
              width={30} height={30}
              alt='Ear icon'
              src="/ear-icon.svg"
              
            />
          </div>
          <p>
            Listened for a total of <span className='font-semibold text-primary'>0</span> minutes.
          </p>
        </div>
        <div className='flex gap-5 items-center'>
          <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
            <Image 
              width={30} height={30}
              alt='Ear icon'
              src="/speech-balloon.svg"
              
            />
          </div>
          <p>
            Vented for a total of <span className='font-semibold text-primary'>0</span> minutes.
          </p>
        </div>
        <div className='flex gap-5 items-center'>
          <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
            <Image 
              width={30} height={30}
              alt='Ear icon'
              src="/neutral-feeling.svg"
              
            />
          </div>
          <p>
            Today's mood is <span className='font-semibold text-primary'>sad</span>
          </p>
        </div>
        <div className='flex gap-5 items-center'>
          <div className='flex items-center justify-center bg-secondary rounded-full p-2 w-max'>
            <Image 
              width={30} height={30}
              alt='Ear icon'
              src="/fire.svg"
              
            />
          </div>
          <p>
            Highest mood streak is <span className='font-semibold text-primary'>0</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivitySummary
