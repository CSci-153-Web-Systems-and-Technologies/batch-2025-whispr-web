import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by user ID
  const { allowed } = await checkRateLimit(user.id);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  try {
    const { content, location  } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
    }

    if (content.length > 500) {
       return NextResponse.json({ error: "Content exceeds 500 characters" }, { status: 400 });
    }

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json({ error: "Invalid or missing location data" }, { status: 400 });
    }

    const {error: createPostError} = await supabase.rpc('create_post', {
      p_content: content.trim(),
      p_author_id: user.id,
      p_long: location.longitude,
      p_lat: location.latitude
    })

    if (createPostError) {
      console.error("Database Error:", createPostError);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    return NextResponse.json({ message: "Post created successfully" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}