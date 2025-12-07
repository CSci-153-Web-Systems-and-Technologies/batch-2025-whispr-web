'use client'

import React, {useEffect, useState} from "react"
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import type { User } from "@/types";
import { useParams } from "next/navigation";




export function useCurrentUser(){
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();
  const params = useParams();
  const sessionId = params.sessionId as string | undefined;

  useEffect(() => {
    const fetchFullUserData = async () => {
      if (!sessionId) return;

      try {
        // 1. Get the Auth User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 2. Get the Anon Profile
        const { data: anonData } = await supabase
          .from('anon_users')
          .select('anon_id')
          .eq('id', user.id)
          .single();

        if (!anonData) return;

        let userData: User = { 
            id: user.id, 
            name: anonData.anon_id ,
            role: null
        };

        const { data: sessionData } = await supabase
          .from('chat_sessions')
          .select('user_a, user_b, user_a_role, user_b_role')
          .eq('id', sessionId)
          .single();

        if (sessionData) {
          if (sessionData.user_a === user.id) {
            userData.role = sessionData.user_a_role;
          } else if (sessionData.user_b === user.id) {
            userData.role = sessionData.user_b_role;
          }
        }

        // 4. Update State ONCE
        setCurrentUser(userData);

      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data.");
      }
    };

    fetchFullUserData();
  }, [sessionId, supabase]);

  return { currentUser };
}