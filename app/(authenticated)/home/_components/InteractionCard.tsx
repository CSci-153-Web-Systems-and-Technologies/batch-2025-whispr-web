"use client"

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getCurrentLocation } from '@/lib/geolocation'
import type { UserRole } from '@/types'
import { Heart, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { WaitingDialog } from './WaitingDialog'


const MAX_ATTEMPTS = 10
const POLL_INTERVAL = 1500

const InteractionCard = () => {
  const router = useRouter()
  const [showWaitingDialog, setShowWaitingDialog] = useState(false)
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)
  const [isNearby, setIsNearby] = useState(true)
  const isNearbyRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => { isNearbyRef.current = isNearby }, [isNearby])

  const stopMatching = () => {
    abortControllerRef.current?.abort()
    setShowWaitingDialog(false)
    setPendingRole(null)
  }

  const startMatchingLoop = async (role: UserRole) => {
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal
    let attempts = 0

    try {
      while (attempts < MAX_ATTEMPTS) {
        if (signal.aborted) {
          await fetch('api/chat/match', {
            method: 'DELETE',
          })
          return
        }

        attempts++

        let locationData = null
        if (isNearbyRef.current) {
          try {
            const loc = await getCurrentLocation()
            locationData = { latitude: loc.lat, longitude: loc.lng }
          } catch (e) {
            console.error("Location error", e)
          }
        }

        const res = await fetch("/api/chat/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            role, 
            nearby: isNearbyRef.current,
            location: locationData 
          }),
          signal
        })

        const data = await res.json()

        if (data.status === "matched") {
          toast.success("Match found!")
          router.push(`/chat/${data.createdSessionId}`)
          return
        }

        if (data.status === "waiting") {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL))
          continue
        }

        if (data.status === "error") {
          toast.error(data.message || "Server error")
          stopMatching()
          return
        }
      }

      if (!signal.aborted) {
        toast.error("No match found yet. Try again later.")
        stopMatching()
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      console.error("Matching crashed:", err)
      toast.error("Something went wrong. Please try again.")
      stopMatching()
    }
  }

  const executeMatching = (role: UserRole) => {
    setShowWaitingDialog(true)
    startMatchingLoop(role)
  }

  const handleMatching = async (role: UserRole) => {
    setPendingRole(role)
    executeMatching(role)
  }

  return (
  <>
    <WaitingDialog 
      open={showWaitingDialog}
      role={pendingRole}
      onCancel={stopMatching}
    />

    <Card className='flex flex-1'>
      <CardHeader>
        <CardTitle>Choose your role</CardTitle>
        <CardDescription>
          Whether you need support or want to help others, we're here to connect you safely.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col w-full'> 
        <div className='flex flex-col sm:flex-row justify-center items-center gap-3 w-full'>
          <CardAction className='w-full sm:flex-1 '>
            <Button 
              className='w-full h-11 text-base' 
              onClick={() => handleMatching('venter')}
            >
              <Search />
              Venter
            </Button>
          </CardAction>
          <CardAction className='w-full sm:flex-1'>
            <Button 
              variant="secondary" 
              className='w-full h-11 text-base' 
              onClick={() => handleMatching('listener')}
            >
              <Heart fill='black' />
              Listener
            </Button>
          </CardAction>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-start space-x-2">
        <Switch 
            id="nearby-mode" 
            checked={isNearby}
            onCheckedChange={setIsNearby}
          />
          <Label htmlFor="nearby-mode">Enable Nearby Matching</Label>
      </CardFooter>
    </Card>
  </>
  )
}

export default InteractionCard