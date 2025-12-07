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

  const { role } = await req.json();

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
    { 
      user_id: user.id,
      role: role,
    },
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

  const [u1, u2] = waiting;

  // Guard: ensure we have two distinct user ids
  if (!u1.user_id || !u2.user_id || u1.user_id === u2.user_id) {
    return NextResponse.json({ status: "waiting" });
  }

  const isU1First = u1.user_id < u2.user_id;
  const userA = isU1First ? u1 : u2;
  const userB = isU1First ? u2 : u1;

  // 4. Try to create session with consistent ordering
  const { data: createdSession, error: sessionError } = await supabase
    .from("chat_sessions")
    .insert({
      user_a: userA.user_id,
      user_b: userB.user_id,
      user_a_role: userA.role,
      user_b_role: userB.role,
      expires_at: new Date(Date.now() + 60 * 1000 * 10).toISOString(),
      is_active: true,
    })
    .select("id")
    .single();

  // 5. Clean up queue for both users (do this even if insert failed)
  await supabase.from("waiting_queue").delete().in("user_id", [userA.user_id, userB.user_id]);

  // 6. If insert failed (likely duplicate), fetch the existing session
  if (sessionError) {
    console.log("Session creation failed, fetching existing.");
    
    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("user_a", userA.user_id)
      .eq("user_b", userB.user_id) 
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json({
        status: "matched",
        createdSessionId: existingSession.id,
      });
    }

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