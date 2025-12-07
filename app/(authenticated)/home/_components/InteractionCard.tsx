"use client"

import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Heart, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UserRole } from '@/types'


const MAX_ATTEMPTS = 10
const POLL_INTERVAL = 1500

const InteractionCard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleMatching = async (role: UserRole) => {
    setIsLoading(true)
    let toastId: string | number | undefined
    let attempts = 0

    try {
      toastId = toast.loading("Finding someone to chat with...")

      while (attempts < MAX_ATTEMPTS) {
        attempts++

        const res = await fetch("/api/chat/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        })

        const data = await res.json()

        if (data.status === "matched") {
          toast.dismiss(toastId)
          toast.success("Match found!")
          router.push(`/chat/${data.createdSessionId}`)
          return
        }

        if (data.status === "waiting") {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL))
          continue
        }

        if (data.status === "error") {
          toast.dismiss(toastId)
          toast.error(data.message || "Server error")
          return
        }
      }

      toast.dismiss(toastId)
      toast.error("No match found yet. Try again later.")
    } catch (err) {
      console.error("Matching crashed:", err)
      if (toastId) toast.dismiss(toastId)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-160'>
      <CardHeader>
        <CardTitle>Choose your role</CardTitle>
        <CardDescription>
          Whether you need support or want to help others, we're here to connect you safely.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center items-center my-auto gap-3 w-full'>
        <CardAction className='flex-1'>
          <Button 
            className='w-full h-11 text-base' 
            onClick={() => handleMatching('venter')}
            disabled={isLoading}
          >
            <Search />
            Venter
          </Button>
        </CardAction>
        <CardAction className='flex-1'>
          <Button 
            variant="secondary" 
            className='w-full h-11 text-base' 
            onClick={() => handleMatching('listener')}
            disabled={isLoading}
          >
            <Heart fill='black' />
            Listener
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  )
}

export default InteractionCard