import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1. AUTHENTICATION
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, nearby, location } = await req.json();

  try {
    // 2. CHECK EXISTING SESSION (RPC)
    // Always check this first. If they refreshed the page, they might already have a chat.
    const { data: existingSessionId, error: checkError } = await supabase
      .rpc('check_my_session', { p_user_id: user.id });

    if (checkError) throw checkError;

    if (existingSessionId) {
      return NextResponse.json({ 
        status: "matched", 
        createdSessionId: existingSessionId 
      });
    }

    // JOIN / UPDATE QUEUE (RPC)
    const lat = location ? location.latitude : 0;
    const long = location ? location.longitude : 0;

    // If no location provided, force nearby matching off to prevent errors
    const safeNearby = location ? nearby : false; 

    const { error: joinError } = await supabase.rpc('join_queue', {
      p_user_id: user.id,
      p_role: role,
      p_lat: lat,
      p_long: long,
      p_enable_nearby_matching: safeNearby
    });

    if (joinError) throw joinError;

    // ATTEMPT MATCH (RPC)
    const { data: matchResult, error: matchError } = await supabase
      .rpc('match_users', { 
        p_user_id: user.id,
        p_radius_meters: 10000
      });

    if (matchError) throw matchError;

    // matchResult is an array (RPC returns table). Take the first row.
    const match = matchResult && matchResult[0];

    if (match && match.session_id) {
      return NextResponse.json({ 
        status: "matched", 
        createdSessionId: match.session_id 
      });
    }

    return NextResponse.json({ status: "waiting" });

  } catch (err: any) {
    console.error("Match API Error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("waiting_queue").delete().eq("user_id", user.id);
  }
  return NextResponse.json({ success: true });
}