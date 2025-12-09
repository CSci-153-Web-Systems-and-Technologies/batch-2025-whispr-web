import CommunityStats from './_components/CommunityStats'
import CommunityWall from './_components/CommunityWall'
import InteractionCard from './_components/InteractionCard'
import MoodCheckCard from './_components/MoodCheckCard'

const page = () => {
  return (
    <div className='fle flex-col pt-22 p-8'>
      <div className='flex justify-center gap-5 h-max w-full'>
        <MoodCheckCard />
        <InteractionCard />
      </div>

      <div className='flex gap-5 px-18  mt-8 mb-8 relative'>
        <CommunityWall />
        <CommunityStats />
      </div>
      
      {/* <PostCard /> */}
    </div>
  )
}

export default page
