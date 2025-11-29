import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Check if user already has an active session FIRST
  const { data: myExistingSession } = await supabase
    .from("chat_sessions")
    .select("id")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (myExistingSession) {
    await supabase.from("waiting_queue").delete().eq("user_id", user.id);
    return NextResponse.json({ 
      status: "matched", 
      createdSessionId: myExistingSession.id 
    });
  }

  // 2. Add user to waiting queue
  await supabase.from("waiting_queue").upsert(
    { user_id: user.id },
    { onConflict: "user_id" }
  );

  // 3. Check if there are 2 users waiting
  const { data: waiting } = await supabase
    .from("waiting_queue")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(2);

  if (!waiting || waiting.length < 2) {
    return NextResponse.json({ status: "waiting" });
  }

  const userA = waiting[0].user_id;
  const userB = waiting[1].user_id;

  // Guard: ensure we have two distinct user ids
  if (!userA || !userB || userA === userB) {
    return NextResponse.json({ status: "waiting" });
  }

  // 4. Try to create session with consistent ordering
  const { data: createdSession, error: sessionError } = await supabase
    .from("chat_sessions")
    .insert({
      user_a: userA < userB ? userA : userB, // Smaller ID first
      user_b: userA < userB ? userB : userA, // Larger ID second
      expires_at: new Date(Date.now() + 10 * 60000).toISOString(),
      is_active: true,
    })
    .select("id")
    .single();

  // 5. Clean up queue for both users (do this even if insert failed)
  await supabase.from("waiting_queue").delete().in("user_id", [userA, userB]);

  // 6. If insert failed (likely duplicate), fetch the existing session
  if (sessionError) {
    console.log("Session creation failed, fetching existing:", sessionError);
    
    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .or(`user_a.eq.${userA},user_b.eq.${userA}`)
      .or(`user_a.eq.${userB},user_b.eq.${userB}`)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json({
        status: "matched",
        createdSessionId: existingSession.id,
      });
    }

    // If we still can't find a session, return error
    return NextResponse.json(
      { status: "error", message: "Failed to create or find session" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "matched",
    createdSessionId: createdSession.id,
  });
}