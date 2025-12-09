"use client"

import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export function UseMessageQuery(sessionId: string) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

        if (data) setMessages(data);
    }
    fetchMessages();
  }, [sessionId]);
  
  if(!sessionId) {
    return { messages: [] };
  }

  return { messages };
}
