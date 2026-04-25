import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log(request);

  const url = new URL(request.url);
  const { searchParams, origin } = url;

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const nextUrl = new URL(next, origin);
  const redirectUrl = nextUrl.origin === origin ? nextUrl : new URL("/dashboard", origin);

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();

  //  Step 1: exchange code → session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  console.log(error);

  if (error) {
    console.error("Auth error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  //  Step 2: get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Use upsert to create user if not exist
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    },
    {
      onConflict: "id",
    }
  );

  // upsert user stats
  const { error: statsError } = await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true,
    }
  );

  if (profileError || statsError) {
    console.error("Init user error:", profileError || statsError);
  }

  return NextResponse.redirect(redirectUrl);
}
