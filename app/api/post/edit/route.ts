import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, content } = await request.json();

    if (!id || !content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: "Content exceeds 500 characters" }, { status: 400 });
    }

    // Verify ownership
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ content: content.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
