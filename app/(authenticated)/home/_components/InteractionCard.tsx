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
import { Button } from '@/components/ui/button'
import { Heart, Search } from 'lucide-react'

const InteractionCard = () => {
  return (
    <Card className='w-160'>
      <CardHeader>
        <CardTitle>Choose your role</CardTitle>
        <CardDescription>
          Whether you need support or want to help others, we're here to connect you safely.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center items-center my-auto gap-3 w-full'>
        <CardAction className='flex-1'>
          <Button className='w-full h-11 text-base'>
            <Search />
            Venter
          </Button>
        </CardAction>
        <CardAction className='flex-1'>
          <Button variant="secondary" className='w-full h-11 text-base'>
            <Heart fill='black' />
            Listener
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  )
}

export default InteractionCard
