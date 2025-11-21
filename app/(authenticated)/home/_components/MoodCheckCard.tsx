import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const MoodCheckCard = () => {
  return (
    <Card className='flex w-160'>
      <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>
            Track your mood throughout the day by logging how you feel.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center items-center'>
          <CardAction>
            <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105'>
              <Image
                src="neutral-feeling.svg"
                width={50} height={50}
                alt='Neutral Feeling'
              />
              Neutral
            </Button>
          </CardAction>
          <CardAction>
            <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105'>
              <Image
                src="happy-feeling.svg"
                width={50} height={50}
                alt='Neutral Feeling'
              />
              Happy
            </Button>
          </CardAction>
          <CardAction>
            <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105'>
              <Image
                src="sad-feeling.svg"
                width={50} height={50}
                alt='Neutral Feeling'
              />
              Sad
            </Button>
          </CardAction>
          <CardAction>
            <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105'>
              <Image
                src="anxious-feeling.svg"
                width={50} height={50}
                alt='Neutral Feeling'
              />
              Anxious
            </Button>
          </CardAction>
          <CardAction>
            <Button variant="ghost" className='flex flex-col h-max hover:bg-transparent! hover:text-primary hover:scale-105'>
              <Image
                src="frustated-feeling.svg"
                width={50} height={50}
                alt='Neutral Feeling'
              />
              Frustated
            </Button>
          </CardAction>
        </CardContent>
    </Card>
  )
}

export default MoodCheckCard
