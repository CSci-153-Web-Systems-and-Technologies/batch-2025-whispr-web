import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { sessionId } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .select();

  if (error || !data || data.length === 0) {
    console.error("Error ending session:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }

  const deletedSession = data[0];

  const { error: feedbackError } = await supabase
    .from("feedback_permissions")
    .insert([
      {
        user_id: deletedSession.user_a,
        partner_id: deletedSession.user_b,
        session_id: deletedSession.id,
      },
      {
        user_id: deletedSession.user_b,
        partner_id: deletedSession.user_a,
        session_id: deletedSession.id,
      }
    ]);

  if(feedbackError) {
    return NextResponse.json({ error: "Failed to create feedback permission" }, { status: 500 });
  }


  // Calculate Session Duration
  const startTime = new Date(deletedSession.created_at).getTime();
  const endTime = new Date().getTime();
  const durationInSeconds = Math.floor((endTime - startTime) / 1000);

  const { error: historyError } = await supabase
    .from("session_history")
    .insert({
      session_id: deletedSession.id,
      user_a: deletedSession.user_a,
      user_b: deletedSession.user_b,
      user_a_role: deletedSession.user_a_role, 
      user_b_role: deletedSession.user_b_role,
      duration_seconds: durationInSeconds,
    });

  if (historyError) {
    console.error("Failed to save history:", historyError);
    return NextResponse.json({ error: "Failed to save session history" }, { status: 500 });
  }

  return NextResponse.json({ message: "Session ended." }, { status: 200 });
}