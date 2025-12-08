"use client"

import { RealtimeChat } from '@/components/realtime-chat'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useChatPartner } from '@/hooks/use-chat-partner';
import { UseMessageQuery } from '@/hooks/use-message-query';
import FeedbackDialog from './_components/FeedbackDialog';
import { useSession } from '@/hooks/use-session';

interface ChatPageProps {
  params: Promise<{
    sessionId: string;
  }>
}

export default function ChatPage({params}: ChatPageProps) {
  const supabase = createClient();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const {showFeedbackDialog} = useSession()

  const { currentUser } = useCurrentUser();
  const { partner } = useChatPartner(sessionId, currentUser?.id || "");
  const { messages } = UseMessageQuery(sessionId);
  

  useEffect(() => {
    params.then(p => setSessionId(p.sessionId));
  }, [params]);

  // 2. Validate Session Existence in DB
  useEffect(() => {
    if (!sessionId) return;

    const validateSession = async () => { 
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('is_active', true) 
        .single();

      if (error || !data) {
        toast.error("Session not found or has expired.");
        router.replace('/home'); 
        return;
      }
    };

    validateSession();
  }, [sessionId, router, supabase]);

  useEffect(() => {
    if (!sessionId) return;
    sessionStorage.setItem('active_session', sessionId);

    const handleVisibilityChange = () => {
      // When tab becomes hidden and user is navigating away
      if (document.visibilityState === 'hidden') {
        const activeSession = sessionStorage.getItem('active_session');
        
        // Check if we're still on the chat page
        const isStillOnCurrentSession = window.location.pathname === `/chat/${sessionId}`;
        
        if (activeSession && !isStillOnCurrentSession) {
          // User navigated away - terminate session
          navigator.sendBeacon(
            '/api/chat/end',
            new Blob([JSON.stringify({ sessionId: activeSession })], {
              type: 'application/json'
            })
          );
          sessionStorage.removeItem('active_session');
        }
      }
    };

    // Handle browser back/forward navigation
    const handlePopState = async () => {
      const activeSession = sessionStorage.getItem('active_session');
      if (activeSession) {
        await fetch('/api/chat/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: activeSession }),
          keepalive: true
        });
        sessionStorage.removeItem('active_session');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [sessionId]);

  // Clean up on component unmount (navigation away)
  useEffect(() => {
    return () => {
      const activeSession = sessionStorage.getItem('active_session');
      if (activeSession === sessionId) {
        // Navigating away from chat page
        fetch('/api/chat/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true
        });
        sessionStorage.removeItem('active_session');
      }
    };
  }, [sessionId]);

  const handleMessage = async (messages: ChatMessage[]) => {
    if (!sessionId) return;

    const { data: sessionExists } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .maybeSingle();
      
    if (!sessionExists) {
      console.log('Session ended, skipping message storage');
      return;
    }

    const { error } = await supabase
      .from('chat_messages')
      .upsert(
        messages.map(msg => ({
          id: msg.id,
          session_id: sessionId,
          sender_id: msg.sender_id,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
        { onConflict: 'id' }
      );

    if (error) console.log('Error storing messages:', error);
  }

  if (!currentUser || !partner || !currentUser.role) return null;

  return (
    <div className='flex flex-1 h-screen border pt-20'>
      {showFeedbackDialog && 
        <FeedbackDialog 
          sessionId={sessionId}
          userRole={currentUser.role} 
          partner={partner}
        />
      }
    
      <RealtimeChat 
        roomName={sessionId} 
        senderId={currentUser.id} 
        username={currentUser.name}
        partnerName={partner.name}
        messages={messages}
        onMessage={handleMessage}
      />
    </div>
  )
}