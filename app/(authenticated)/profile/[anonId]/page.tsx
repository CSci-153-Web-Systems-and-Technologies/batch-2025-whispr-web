import React, { Activity } from 'react'
import ProfileCard from './_components/ProfileCard'
import ActivitySummary from './_components/ActivitySummary'
import MoodHistory from './_components/MoodHistory'
import UserFeed from './_components/UserFeed'

const page = () => {
  return (
    <div className='flex flex-col gap-5 pt-25 p-15'>
      <div className='flex w-full '>
        <ProfileCard />
        <ActivitySummary />
      </div>
      <div className='flex gap-5'>
        <MoodHistory />
        <UserFeed />
      </div>
    </div>
  )
}

export default page
