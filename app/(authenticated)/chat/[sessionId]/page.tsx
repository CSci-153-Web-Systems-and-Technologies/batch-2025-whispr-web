"use client"

import { RealtimeChat } from '@/components/realtime-chat'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useChatPartner } from '@/hooks/use-chat-partner';
import { get } from 'http';

interface ChatPageProps {
  params: Promise<{
    sessionId: string;
  }>
}

export default function ChatPage({params}: ChatPageProps) {
  const supabase = createClient();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');

  const { currentUser } = useCurrentUser();
  const { partner } = useChatPartner(sessionId, currentUser?.id || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  

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
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

        if (data) setMessages(data);
    }

    fetchMessages();

    // const getPartner = async () => {
    //   if(!sessionId) return;
    //   const {partner} = useChatPartner(sessionId, currentUser?.id || "");
    //   if(partner) partnerName = partner.name;
    // }
    // getPartner(); 

  }, [sessionId]);

  if (!currentUser || !partner) return null;

  return (
    <div className='flex flex-1 h-screen border pt-20'>

      <RealtimeChat 
        roomName={sessionId} 
        senderId={currentUser.id} 
        username={currentUser.name}
        partnerName={partner.name}
      />
    </div>
  )
}
