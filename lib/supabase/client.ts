import { createBrowserClient } from "@supabase/ssr";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing environment variables");
}

export function createClient() {
  return createBrowserClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  );
}
