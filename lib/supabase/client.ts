// import { createBrowserClient } from "@supabase/ssr";

// export const createClient = () => {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//   if (!supabaseUrl || !supabaseKey) {
//     throw new Error("Supabase environment variables are not set");
//   }

//   return createBrowserClient(supabaseUrl, supabaseKey);
// };

import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
