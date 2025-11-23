import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ProfileRedirectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from("anon_users")
    .select("anon_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.anon_id) {
    redirect('/register');
  }

  redirect(`/profile/${profile.anon_id}`);
}