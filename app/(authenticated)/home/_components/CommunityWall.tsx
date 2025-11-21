import React from 'react'
import PostCard from './PostCard'

const CommunityWall = () => {
  return (
    <div className='flex flex-col flex-1 rounded-xl mt-8 mb-8 shadow-md'>
      <div className='flex items-center justify-between bg-secondary rounded-t-xl py-4 px-8'>
        <span>Community Feed</span>
        <span className='bg-primary text-white text-sm py-2 px-5 rounded-full'>Nearby</span>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  )
}

export default CommunityWall
