import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const nextUrl = new URL(next, origin);

  const redirectUrl = nextUrl.origin === origin ? nextUrl : new URL("/dashboard", origin);

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createClient();

  // 1. Exchange OAuth code → session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Auth error:", exchangeError.message);

    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  // 2. Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/`);
  }

  // 3. Create/update profile and return onboarding state
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
      {
        onConflict: "id",
      }
    )
    .select("id, onboarding_completed_at")
    .single();

  if (profileError || !profile) {
    console.error("Profile init error:", profileError?.message);

    return NextResponse.redirect(`${origin}/?error=profile_failed`);
  }

  // 4. Initialize stats
  const { error: statsError } = await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true,
    }
  );

  if (statsError) {
    console.error("Stats init error:", statsError.message);
  }

  // 5. New / unfinished onboarding
  if (!profile.onboarding_completed_at) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  // 6. Existing user
  return NextResponse.redirect(redirectUrl);
}
