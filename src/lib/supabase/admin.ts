import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service-role client. Bypasses RLS entirely — never import this in a
// Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
// Used only for: creating child auth users, admin approval mutations that
// need to write across ownership boundaries, and webhook handlers.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
