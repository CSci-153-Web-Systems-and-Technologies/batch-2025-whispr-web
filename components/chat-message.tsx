import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import CustomAvatar from './CustomAvatar'

interface ChatMessageItemProps {
  username: string
  partnerName: string
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ username, partnerName, message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex items-end gap-3 mt-5 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <div className="shrink-0">
          <CustomAvatar name={isOwnMessage ? username : partnerName} />
        </div>
      )}
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-1', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium'}>{message.username}</span>
            <span className={`text-foreground/50 text-xs}`}>
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        {/* Message Content */}
        <div
          className={cn(
            'py-2 px-4 rounded-xl text-sm w-fit',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-gray-300 text-foreground'
          )}
        >
          {message.content}
        </div>
      </div>
      {isOwnMessage && (
        <div className="shrink-0">
          <CustomAvatar name={username} isOwner={isOwnMessage} />
        </div>
      )}
    </div>
  )
}
