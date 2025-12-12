'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ChatHeader from '@/components/ChatHeader'

export function HeaderWrapper() {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith('/chat/')
  const sessionId = isChatPage ? pathname.split('/chat/')[1] : null

  return isChatPage && sessionId ? (
    <ChatHeader sessionId={sessionId} />
  ) : (
    <Navbar />
  )
}