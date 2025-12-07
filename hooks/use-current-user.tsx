'use client'

import React, {useEffect, useState} from "react"
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import type { UserRole } from "@/app/(authenticated)/home/_components/InteractionCard";


export type User = {
  id: string;
  name: string; // anon_id
  role?: UserRole;
}

export function useCurrentUser(sessionId?: string) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('anon_users')
            .select('anon_id')
            .eq('id', user.id)
            .single();

          if (data) {
            setCurrentUser({ id: user.id, name: data.anon_id });
          }

          if (sessionId) {
            const { data: session } = await supabase
              .from('chat_sessions')
              .select('user_a, user_b, user_a_role, user_b_role')
              .eq('id', sessionId)
              .single();

            if (session) {
              const role = session.user_a === user.id ? session.user_a_role : session.user_b_role;
              setCurrentUser(prev => prev ? { ...prev, role } : null);
            }
          }
        }
      } catch (error) {
        toast.error("Failed to fetch current user.");
      }
    }

    getCurrentUser();
  }, [supabase])


  return { currentUser };
}