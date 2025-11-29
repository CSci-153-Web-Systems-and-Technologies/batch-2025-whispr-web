'use client'

import React, {useEffect, useState} from "react"
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";

export type CurrentUser = {
  id: string;
  name: string; // anon_id
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
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
        }
      } catch (error) {
        toast.error("Failed to fetch current user.");
      }
    }

    getCurrentUser();
  }, [supabase])


  return { currentUser };
}