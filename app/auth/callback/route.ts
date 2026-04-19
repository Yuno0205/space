import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

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

  //  Step 3: check profile exists
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single();

  //  Step 4: if not exists → create profile + stats
  if (!profile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    });

    const { error: statsError } = await supabase.from("user_stats").insert({
      user_id: user.id,
    });

    if (profileError || statsError) {
      console.error("Init user error:", profileError || statsError);
    }
  }

  //  Step 5: redirect to app
  return NextResponse.redirect(redirectUrl);
}
