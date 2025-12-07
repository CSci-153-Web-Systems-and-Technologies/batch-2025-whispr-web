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
import { DialogClose } from "@radix-ui/react-dialog";
import { useSession } from "@/hooks/use-session";

const LeaveChatDialog = () => {
  const {setIsFeedbackOpen, endSession} = useSession();

  const handleLeaveChat = async () => {
    await endSession();
    setIsFeedbackOpen(true);
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
          <DialogClose asChild>
            <Button variant='destructive' onClick={handleLeaveChat} className="text-black">Leave Chat</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveChatDialog
