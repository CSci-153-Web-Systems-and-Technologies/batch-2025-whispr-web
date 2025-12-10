import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentLocation } from "@/lib/geolocation"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

interface PostDialogProps {
  children: React.ReactNode
  dialogType: 'add' | 'edit' | 'delete'
  postId?: string;
  initialContent?: string | undefined;
  onSuccess?: () => void
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PostDialog = ({children, dialogType, postId, initialContent, onSuccess, open, onOpenChange}: PostDialogProps) => {
  const [content, setContent] = useState(initialContent || "")
  const [isLoading, setIsLoading] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const router = useRouter();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    }
  };

  const oldContent = initialContent || "";

  const getDialogHeader = () => {
    const header = {
      title: '',
      description: ''
    }

    switch (dialogType) {
      case 'add':
        header.title = 'Add New Post';
        header.description = 'Create a new post to share your thoughts and feelings.';
        break;
      case 'edit':
        header.title = 'Edit Post';
        header.description = 'Make changes to your existing post.';
        break;
      case 'delete':
        header.title = 'Are you sure you want to delete this post?';
        header.description = 'This action cannot be undone. This will permanently delete your post.';
        break;
      default:
        break;
    }

    return header;
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
        let res;
        let location;
        if (dialogType === 'add') {
          try {
            const loc = await getCurrentLocation();
            location = { latitude: loc.lat, longitude: loc.lng };
          } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
            return;
          }

          res = await fetch('/api/post/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content, location }),
          });
        } else if (dialogType === 'edit') {
            if (content === oldContent) {
                toast.error('No changes made to the post.');
                setIsLoading(false);
                return;
            }

            res = await fetch('/api/post/edit', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: postId, content }),
            });
        } else if (dialogType === 'delete') {
            res = await fetch('/api/post/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: postId }),
            });
        }

        if (res && !res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Something went wrong');
        }

        toast.success(`Post ${dialogType === 'add' ? 'created' : dialogType === 'edit' ? 'updated' : 'deleted'} successfully`)
        setIsOpen(false);
        setContent("");
        if (onSuccess) onSuccess();
        router.refresh();
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !isLoading) {
        handleSubmit();
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {<DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogHeader().title}</DialogTitle>
          <DialogDescription>{getDialogHeader().description}</DialogDescription>
        </DialogHeader>
        
        {dialogType !== 'delete' && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Textarea
                  placeholder={content ? "Share what's on your mind anonymously..." : "" }
                  className='rounded-md min-h-30 max-h-50 resize-none overflow-y-auto whitespace-pre-wrap flex-1'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                />
            </div>
          </div>
        )}

        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
                onClick={handleSubmit} 
                disabled={isLoading || (dialogType !== 'delete' && !content.trim())}
                variant={dialogType === 'delete' ? "destructive" : "default"}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dialogType === 'add' ? 'Post' : dialogType === 'edit' ? 'Save Changes' : 'Delete'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PostDialog
