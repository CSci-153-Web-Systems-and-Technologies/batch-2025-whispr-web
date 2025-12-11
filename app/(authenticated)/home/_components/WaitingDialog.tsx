"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getInitials } from "@/lib/get-initials"
import { UserRole } from "@/types"

interface WaitingDialogProps {
  open: boolean
  role: UserRole | null
  onCancel: () => void
}

export function WaitingDialog({
  open,
  role,
  onCancel,
}: WaitingDialogProps) {
  const { currentUser } = useCurrentUser()
  const initials = getInitials(currentUser?.name)

  const title = role === 'venter' ? "Finding Someone to Listen" : "Finding Someone to Talk To"
  const description = role === 'venter' 
    ? "Searching for nearby community members who have a caring ear..."
    : "Searching for community members who need a listening ear..."
  
  const badgeText = role === 'venter' ? "You're Venting" : "You're Listening"

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent className="w-130 flex flex-col items-center text-center">
        <div className={`px-4 py-1 rounded-full text-white text-sm font-medium mb-4 bg-primary`}>
          {badgeText}
        </div>

        <DialogHeader className="items-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center justify-between gap-12 mt-10 w-full'>
          <div className="py-8 relative flex items-center justify-center h-20 w-20">
           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.75_0.15_120)] opacity-75 duration-1000" />
            <span className="absolute inline-flex h-[80%] w-[80%] animate-ping rounded-full bg-[oklch(0.6512_0.1623_132.25)] opacity-75 [animation-delay:300ms]" />
            <div className={`relative w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10`}>
              {initials}
            </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full sm:max-w-[200px]"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
