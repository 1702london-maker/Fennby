import { getSessionProfile, Role, SessionProfile } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/action-result";

export class UnauthenticatedError extends Error {
  constructor() {
    super("You must be signed in to do that.");
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You don't have permission to do that.");
  }
}

// Route-level guard: fast, clean error before touching domain logic.
// This is NOT the security boundary — RLS is (see docs/architecture).
//
// Every current handler returns Promise<ActionResult<...>>, so on an auth
// failure we resolve to a well-formed { ok: false, error } instead of
// throwing — a thrown rejection from a Server Action has repeatedly left
// client forms stuck on "Saving..." because a caller forgot a try/catch.
// If a future call site genuinely needs a non-ActionResult return type,
// wrap it in its own try/catch at the call site instead of relying on this
// throwing.
export function withRole<Args extends unknown[], R>(
  allowed: Role[],
  handler: (session: SessionProfile, ...args: Args) => Promise<R>
) {
  return async (...args: Args): Promise<R> => {
    const session = await getSessionProfile();
    if (!session) {
      return { ok: false, error: "unauthenticated" } as ActionResult as R;
    }
    if (!allowed.includes(session.role)) {
      return { ok: false, error: "forbidden" } as ActionResult as R;
    }
    return handler(session, ...args);
  };
}
