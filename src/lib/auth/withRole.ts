import { getSessionProfile, Role, SessionProfile } from "@/lib/auth/session";

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
// It exists so a wrong-role click gets "You don't have permission" instead
// of a confusing empty result.
export function withRole<Args extends unknown[], R>(
  allowed: Role[],
  handler: (session: SessionProfile, ...args: Args) => Promise<R>
) {
  return async (...args: Args): Promise<R> => {
    const session = await getSessionProfile();
    if (!session) throw new UnauthenticatedError();
    if (!allowed.includes(session.role)) throw new ForbiddenError();
    return handler(session, ...args);
  };
}
