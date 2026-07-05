import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Role = Database["public"]["Enums"]["role_type"];

export interface SessionProfile {
  id: string;
  role: Role;
  fullName: string;
  email: string;
}

// Single source of truth for "who is signed in and what's their role" on
// the server. Never trust a role passed from the client — always re-derive
// it here from the profiles table under the request's own session.
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    role: profile.role,
    fullName: profile.full_name,
    email: profile.email,
  };
}

export const roleRedirect: Record<Role, string> = {
  parent: "/parent",
  child: "/child/today",
  tutor: "/tutor",
  school_admin: "/school",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
  safeguarding: "/safeguarding/dashboard",
  authority: "/authority/dashboard",
};
