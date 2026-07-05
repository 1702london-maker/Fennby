"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRole } from "@/lib/auth/withRole";
import type { ActionResult } from "@/lib/action-result";
import {
  signUpSchema,
  loginSchema,
  childLoginSchema,
  createChildLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignUpInput,
  type LoginInput,
  type ChildLoginInput,
  type CreateChildLoginInput,
} from "@/features/auth/schema";

const CHILD_EMAIL_DOMAIN = "child.fennby.internal";

/** Parent, tutor, or school_admin self-registration. */
export async function signUp(input: SignUpInput): Promise<ActionResult<{ userId: string }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
  }
  const { email, password, fullName, intendedRole } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: intendedRole, full_name: fullName } },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "internal" };

  return { ok: true, data: { userId: data.user.id } };
}

/** Adult sign-in (parent/tutor/teacher/school_admin/admin/safeguarding/authority). */
export async function login(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: "Incorrect email or password" };
  return { ok: true, data: null };
}

/** Child sign-in via parent-assigned username + 6-digit PIN. */
export async function childLogin(input: ChildLoginInput): Promise<ActionResult> {
  const parsed = childLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
  }
  const { learnerUsername, pin } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: `${learnerUsername.toLowerCase()}@${CHILD_EMAIL_DOMAIN}`,
    password: pin,
  });
  if (error) return { ok: false, error: "Incorrect username or PIN" };
  return { ok: true, data: null };
}

/** Parent provisions a login for their child. Admin-privileged (creates an auth user). */
export const createChildLogin = withRole(
  ["parent"],
  async (session, input: CreateChildLoginInput): Promise<ActionResult> => {
    const parsed = createChildLoginSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
    }
    const { learnerId, username, pin } = parsed.data;

    const supabase = await createClient();
    // Ownership check — RLS would also catch this, but a clean 403 here saves
    // a wasted admin-API call.
    const { data: learner } = await supabase
      .from("learners")
      .select("id, parent_id, auth_id")
      .eq("id", learnerId)
      .single();

    if (!learner || learner.parent_id !== session.id) {
      return { ok: false, error: "forbidden" };
    }
    if (learner.auth_id) {
      return { ok: false, error: "conflict" };
    }

    const admin = createAdminClient();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: `${username.toLowerCase()}@${CHILD_EMAIL_DOMAIN}`,
      password: pin,
      email_confirm: true,
      user_metadata: { role: "child", full_name: username },
    });

    if (createError || !created.user) {
      return { ok: false, error: createError?.message ?? "internal" };
    }

    const { error: updateError } = await admin
      .from("learners")
      .update({ auth_id: created.user.id })
      .eq("id", learnerId);

    if (updateError) return { ok: false, error: "internal" };

    return { ok: true, data: null };
  }
);

export async function logout(): Promise<ActionResult> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { ok: true, data: null };
}

export async function forgotPassword(email: string): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) return { ok: false, error: "validation_failed" };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/reset-password`,
  });
  // Always return success regardless of whether the email exists — avoids
  // user enumeration.
  return { ok: true, data: null };
}

/** Called from /reset-password after the user follows the emailed link
 * (Supabase establishes a recovery session automatically via the URL hash). */
export async function resetPassword(password: string): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({ password });
  if (!parsed.success) return { ok: false, error: "validation_failed" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}
