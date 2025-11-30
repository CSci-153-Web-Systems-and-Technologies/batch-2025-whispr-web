import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { sessionId } = await req.json();

  const { error} = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)

  if (error) {
    console.error("Error ending session:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  } 

  return NextResponse.json({ message: "Session ended." }, { status: 200 });
}