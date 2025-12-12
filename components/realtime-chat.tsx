'use client'

import { ChatMessageItem } from '@/components/chat-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { cn } from '@/lib/utils'
import { Lock, Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ExtendDialog from './ExtendDialog'
import LeaveChatDialog from './LeaveChatDialog'

interface RealtimeChatProps {
  roomName: string
  username: string
  senderId: string
  partnerName: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */

export const RealtimeChat = ({
  roomName,
  username,
  senderId,
  partnerName,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    senderId,
    username,
  })
  const [newMessage, setNewMessage] = useState('');

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

    return sortedMessages
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage]
  )

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased relative">
      <div>
        <ExtendDialog />
      </div>
      {/* Messages */}
      <div ref={containerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 relative`}>
        <div className={`flex items-center justify-center text-muted-foreground rounded-md border border-dashed border-black py-3 px-4 sm:w-max sm:mx-auto`}>
            <Lock className="inline size-10 sm:size-4 mr-2" />
            <span className='text-sm wrap-anywhere'>
              Your identity is completely anonymous and this conversation will be deleted once the session ends.
            </span>
          </div>
        {allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : null}
        <div className="space-y-1 px-2 sm:px-5">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.sender_id !== message.sender_id

            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  username={username}
                  partnerName={partnerName}
                  message={message}
                  isOwnMessage={message.sender_id === senderId}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>
      {/* Quick Actions */}
      <div className='flex items-center gap-3 bg-gray-100 border py-2 px-5'>
          <span className='text-sm font-medium '>Quick Actions</span>
          <LeaveChatDialog/>
      </div>
      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && newMessage.trim() ? 'w-[calc(100%-36px)]' : 'w-full'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
