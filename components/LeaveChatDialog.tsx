import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { DialogClose } from "@radix-ui/react-dialog";

const LeaveChatDialog = ({sessionId}: {sessionId: string}) => {
  const router = useRouter();

  const handleLeaveChat = async () => {
    try {
      const res = await fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId }),
      })
      if (!res.ok) throw new Error('Failed to end session')
      router.replace('/home')
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' className='text-black'>
          <LogOut className='size-4'/>
          Leave Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave?</DialogTitle>
          <DialogDescription>
            {`You’re about to leave this chat. Your current session will end and you won’t be able to return.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleLeaveChat} className="text-black">Leave Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveChatDialog
