import CommunityStats from './_components/CommunityStats'
import CommunityWall from './_components/CommunityWall'
import InteractionCard from './_components/InteractionCard'
import MoodCheckCard from './_components/MoodCheckCard'

const page = () => {
  return (
    <div className='flex flex-col pt-22 px-6 lg:px-20'>
      <div className='flex flex-col sm:flex-row justify-center gap-5 h-max w-full'>
        <MoodCheckCard />
        <InteractionCard />
      </div>

      <div className='flex flex-col-reverse md:flex-row gap-5 relative my-4 sm:my-8'>
        <CommunityWall />
        <CommunityStats />
      </div>
      
      {/* <PostCard /> */}
    </div>
  )
}

export default page
