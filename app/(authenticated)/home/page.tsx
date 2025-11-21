import React from 'react'
import MoodCheckCard from './_components/MoodCheckCard'
import { Inter } from 'next/font/google'
import InteractionCard from './_components/InteractionCard'

const page = () => {
  return (
    <div className='fle flex-col pt-22 p-8'>
      <div className='flex justify-center gap-5 h-max w-full'>
        <MoodCheckCard />
        <InteractionCard />
      </div>
    </div>
  )
}

export default page
