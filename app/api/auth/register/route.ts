import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";

export async function POST(request: Request) {
  try {
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