// api/chat/extend/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const EXTENSION_DURATION = 3 * 60 * 1000; 

export async function POST(req: Request) {
  const supabase = await createClient();
  const { sessionId, action } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the current session
  const { data: session, error: fetchError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Verify user is part of this session
  if (session.user_a !== user.id && session.user_b !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isUserA = session.user_a === user.id;
  const userExtendField = isUserA ? "user_a_wants_extend" : "user_b_wants_extend";

  // Handle decline action
  if (action === 'decline') {
    const { error: updateError } = await supabase
      .from("chat_sessions")
      .update({ 
        [userExtendField]: false,
        extension_declined: true
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Error updating session:", updateError);
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Extension declined",
      declined: true
    }, { status: 200 });
  }

  // Handle extend action
  const { data: updatedSession, error: updateError } = await supabase
    .from("chat_sessions")
    .update({ 
      [userExtendField]: true
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (updateError || !updatedSession) {
    console.error("Error updating session:", updateError);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }

  // Check if both users want to extend
  const bothWantExtend = updatedSession.user_a_wants_extend && updatedSession.user_b_wants_extend;

  if (bothWantExtend) {
    // Both users agreed - extend the session by adding time to current expiry
    const currentExpiresAt = new Date(updatedSession.expires_at).getTime();
    const now = Date.now();
    
    const baseTime = Math.max(currentExpiresAt, now);
    const newExpiresAt = new Date(baseTime + EXTENSION_DURATION);

    const { error: extendError } = await supabase
      .from("chat_sessions")
      .update({ 
        expires_at: newExpiresAt.toISOString(),
        user_a_wants_extend: false,
        user_b_wants_extend: false,
        extension_declined: false
      })
      .eq("id", sessionId);

    if (extendError) {
      console.error("Error extending session:", extendError);
      return NextResponse.json({ error: "Failed to extend session" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Session extended",
      extended: true,
      expiresAt: newExpiresAt.toISOString()
    }, { status: 200 });
  }

  // Only one user wants to extend so far
  return NextResponse.json({ 
    message: "Waiting for other user",
    extended: false,
    waitingForOther: true
  }, { status: 200 });
}