"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Logout = () => {
  const router = useRouter();

  const handleSignout = async () => {
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Signed out successfully');
      router.push('/login');
    } else {
      toast.error('Failed to sign out. Please try again.');
    }
  }

  return (
    <div className="flex items-center justify-center p-5 w-full min-h-screen">
      <Card className="w-full sm:w-130">
        <CardHeader>
          <CardTitle>Ready to head out?</CardTitle>
          <CardDescription>
            We're here whenever you need to talk or listen again. Take care of yourself.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-3">
          <Link href="/home" className="flex-1">
            <Button variant="secondary" className="w-full">Cancel</Button>
          </Link>
          <Button variant='destructive' className="text-black flex-1" onClick={handleSignout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Logout;