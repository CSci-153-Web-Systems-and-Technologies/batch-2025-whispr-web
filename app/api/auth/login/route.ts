import { checkLoginLimit, getClientIp } from "@/lib/rate-limit";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 login attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const { allowed } = await checkLoginLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { anonId, password } = body;

    if(!anonId || !password) {
      return NextResponse.json(
        { error: "Misging Anonymous ID or password" },
        {status: 400}
      )
    }

    const dummyEmail = `${anonId}@whispr.vercel.app`;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dummyEmail,
      password: password,
    })

    if(error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "User logged in successfully", data: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {error: "Internal Server Error"},
      {status: 500}
    );
  }
}