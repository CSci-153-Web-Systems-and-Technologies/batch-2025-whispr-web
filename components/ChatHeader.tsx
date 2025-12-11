"use client"

import { useChatPartner } from '@/hooks/use-chat-partner'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useSession } from '@/hooks/use-session'
import { formatTime } from '@/lib/format-time'
import { Clock, MessageSquareMore } from 'lucide-react'
import CustomAvatar from './CustomAvatar'

const ChatHeader = ({ sessionId }: { sessionId: string }) => {
  const { currentUser } = useCurrentUser()
  const { partner } = useChatPartner(sessionId, currentUser?.id || "")
  const { secondsLeft, showWarning, isCritical } = useSession();

  const getDistanceInKm = (meters: number | undefined) => {
    if (!meters || isNaN(meters)) return null;
    return (meters / 1000).toFixed(1);
  }

  if (!currentUser || !partner) null;

  return (
    <nav className='flex items-center justify-between h-20 px-5 sm:px-10 shadow-md fixed top-0 left-0 right-0 z-10 bg-white'>
      {/* Partner Info */}
      <div className='flex items-center gap-3'>
        <CustomAvatar name={partner?.name} />
        <div className='flex flex-col gap-1'>
          <span className='font-medium text-base'>{partner?.name}</span>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 aspect-square bg-primary rounded-full'></div>
            <span className='text-muted-foreground text-xs'>{getDistanceInKm(partner?.distance)}km away</span>
          </div>
        </div>
      </div>

      {/* User Role */}
      <div className='flex items-center gap-2 bg-primary px-4 py-2 rounded-full text-white max-sm:hidden'>
        <MessageSquareMore className='h-4 w-4 ' />
        <span className='font-normal text-sm'>
          {`You're ${currentUser?.role === 'venter' ? 'Venting' : 'Listening'}`}
        </span>
      </div>

      {/* Session Timer */}
      <div 
        className={`flex items-center justify-center px-5 py-2 w-28 font-semibold rounded-full text-sm transition-colors ${
          isCritical 
            ? 'bg-destructive text-destructive-foreground' 
            : showWarning 
            ? 'bg-warning' 
            : 'bg-secondary'
        }`}
      >
        <Clock className='mr-2 h-4 w-4' strokeWidth={3}/>
        {secondsLeft !== null ? formatTime(secondsLeft) : "Loading..."}
      </div>
    </nav>
  )
}

export default ChatHeader