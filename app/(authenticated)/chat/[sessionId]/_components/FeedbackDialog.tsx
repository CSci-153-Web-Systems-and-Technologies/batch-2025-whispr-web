import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Slider } from '@/components/ui/slider';
import { useSession } from '@/hooks/use-session';
import { User } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const RATING_DESCRIPTIONS = {
  venter: [
    "Unhelpful and distant.",
    "Tried, but missed the mark.",
    "Okay, but inconsistent.",
    "Good; felt heard and respected.",
    "Amazing support; felt truly safe."
  ],
  listener: [
    "Disconnected and hard to follow.",
    "Unclear and guarded.",
    "Decent, but not smooth.",
    "Clear, open, and easy to support.",
    "Deeply connected and expressive."
  ],
};

const FeedbackDialog = ({
  sessionId,
  userRole, 
  partner
}: {
  sessionId: string
  userRole: 'venter' | 'listener' | null
  partner: User
}) => {
  const router = useRouter();
  const {endSession} = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingDesc = (): string => {
    if (!partner.role) return "";
    const sliderIndex = Math.round((sliderValue[0] / 100) * (RATING_DESCRIPTIONS[partner.role].length - 1));
    return RATING_DESCRIPTIONS[partner.role][sliderIndex];
  }

  const [sliderValue, setSliderValue] = useState<number[]>([50]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  const submitFeedback = async () => {
    if (isSubmitting) return; // Prevent double-clicks
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          partner: partner,
          rating: sliderValue[0] / 10
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to Submit Feedback');
      }
      
      toast.success("Feedback submitted!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      if (!isSubmitting) await endSession();
      router.replace('/home');
      setIsSubmitting(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <Card className='sm:w-130 py-10 shadow-lg'>
        <CardHeader className='flex flex-col justify-center items-center text-center'>
          <div className='flex items-center justify-center bg-secondary p-2 w-max rounded-full'>
            <Image 
              src={userRole === 'venter' ? '/speech-balloon.svg' : '/ear-img.svg'}
              width={40} height={40}
              alt='role-icon'
            />
          </div>
          <CardTitle className='text-xl'>Rate Your Partner</CardTitle>
          <CardDescription>
            Help us understand how your partner made you feel.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col justify-center items-center text-center gap-5'>
          <span className='font-medium'>How well did your partner make you feel trusted?</span>
          <div className='flex flex-col items-center gap-3 text-primary'>
            <span className='text-sm'>
              {`${ratingDesc()} (${sliderValue[0]}%)`}
            </span>
            <Slider value={sliderValue} max={100} step={10} className='w-75' onValueChange={handleSliderChange}/>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center mt-3'>
          <Button className='w-90' onClick={submitFeedback}>Confirm</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FeedbackDialog;
