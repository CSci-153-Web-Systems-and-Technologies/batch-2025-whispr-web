import { useSession } from '@/hooks/use-session';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const ExtendDialog = () => {
  const { 
    sessionId, 
    showExtendDialog, 
    dismissWarning, 
    resetWarning,
    isWaitingForOther,
    setIsWaitingForOther
  } = useSession();
  
  const handleExtend = async () => {
    try {
      const res = await fetch('/api/chat/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'extend' }),
      });
      
      const data = await res.json();
      
      if (data.extended) {
        // Success handled by realtime subscription
        setIsWaitingForOther(false);
      } else if (data.waitingForOther) {
        setIsWaitingForOther(true);
        toast.info('Waiting for the other user to agree...');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to extend session');
    } finally {
      resetWarning();
    }
  }

  const handleDecline = async () => {
    try {
      const res = await fetch('/api/chat/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'decline' }),
      });
      
      if (res.ok) {
        setIsWaitingForOther(false);
        dismissWarning();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to decline extension');
    }
  }

  if (!showExtendDialog) return null;

  return (
    <div className="flex max-sm:flex-col items-center gap-3 bg-white p-5 -mt-1 border rounded-lg rounded-t-none mb-5">
      <div className='flex flex-col flex-1'>
        <span className='font-medium text-base'>
          {isWaitingForOther ? 'Waiting for response...' : 'Extend this session?'}
        </span>
        <span className='text-sm text-muted-foreground'>
          {isWaitingForOther 
            ? 'The other user needs to agree to extend the session. Session will end if they decline or time runs out.'
            : `Your 10-minute chat is ending. If both of you choose to extend, you'll get another 10 minutes. If not, the session will close automatically.`
          }
        </span>
      </div>
      <div className='flex gap-3 flex-1 justify-end max-sm:w-full max-sm:mt-3'>
        {!isWaitingForOther  &&
          <>
            <Button variant='secondary' size='lg' onClick={handleDecline} className='max-sm:flex-1'>
              <X className='h-4 w-4'/>
              Decline
            </Button>
            <Button size='lg' onClick={handleExtend} className='max-sm:flex-1'>
              <Check className='h-4 w-4'/>
              Extend Session
            </Button>
          </>
        }
      </div>
    </div>
  )
}

export default ExtendDialog