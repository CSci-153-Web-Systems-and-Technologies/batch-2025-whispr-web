import React from 'react'
import PostCard from '../../../../components/PostCard'
import PostInput from './PostInput'

const CommunityWall = () => {
  return (
    <div className='flex flex-col flex-1 rounded-xl shadow-md'>
      <div className='flex items-center justify-between bg-secondary rounded-t-xl py-4 px-8'>
        <span>Community Feed</span>
        <span className='flex items-center gap-2 text-sm py-2 px-5 rounded-full'>
          <div className='w-3 h-3 aspect-square bg-primary rounded-full'></div>
          Nearby
        </span>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <PostInput />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  )
}

export default CommunityWall
