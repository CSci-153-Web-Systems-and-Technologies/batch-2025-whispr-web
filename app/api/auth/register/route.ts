import { checkRegistrationLimit, getClientIp } from "@/lib/rate-limit";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Rate limit: 3 registrations per IP per month
    const ip = getClientIp(request);
    const { allowed, remaining } = await checkRegistrationLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many accounts created. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { anonId, password } = body;

    if(!anonId || !password) {
      return NextResponse.json(
        { error: "Missing Anonymous ID or password" },
        {status: 400}
      )
    }

    const dummyEmail = `${anonId}@whispr.vercel.app`;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: dummyEmail,
      password: password,
      options: {
        data: {
          anonId: anonId,
        }
      }
    })

    if(error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    };

    const { user } = data;
    const {error: insertError} = await supabase
      .from('anon_users')
      .insert({
        id: user?.id,
        anon_id: anonId,
        mood_streak: 0,
        listening_pts: 0,
        venting_pts: 0,
      });

      if(insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        );
      }

    return NextResponse.json(
      { message: "User registered successfully", data: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {error: "Internal Server Error"},
      {status: 500}
    );
  }
}