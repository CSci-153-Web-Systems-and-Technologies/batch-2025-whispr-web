import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, partner, rating } = await req.json();

    if (!sessionId || !partner?.id || typeof rating !== 'number') {
      return NextResponse.json({ error: "Missing required fields: sessionId, partner.id, or rating" }, { status: 400 });
    }

    if (user.id === partner.id) {
       return NextResponse.json({ error: "You cannot rate yourself." }, { status: 400 });
    }

    const ratingField = partner.role === 'venter' ? 'venting_pts' : 'listening_pts';
    
    // Fetch current data
    const { data: partnerData, error: fetchError } = await supabase
      .from("anon_users")
      .select(ratingField) 
      .eq("id", partner.id)
      .single();

    if (fetchError || !partnerData) {
      return NextResponse.json({ error: "Partner user profile not found." }, { status: 404 });
    }

    const currentScore = (partnerData as Record<string, number>)[ratingField] || 0;
    const newPoints = currentScore + rating;

    const { error: updateError } = await supabase
      .from("anon_users") 
      .update({
        [ratingField]: newPoints
      })
      .eq("id", partner.id);

    if (updateError) {
      throw new Error(updateError.message);
    } 

    const { error: feedbackDeleteError } = await supabase
      .from("feedback_permissions")
      .delete()
      .eq("user_id", user.id)
      .eq("partner_id", partner.id)
      .eq("session_id", sessionId);

    if(feedbackDeleteError) {
      throw new Error(feedbackDeleteError.message);
    }

    return NextResponse.json({
      message: "Feedback submitted successfully.",
      status: 200
    });

  } catch (error: any) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
        { error: error.message || "Internal Server Error" }, 
        { status: 500 }
    );
  }
}