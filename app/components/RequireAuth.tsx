'use client';

/**
 * Temporary pass-through auth guard.
 * Swap the body later to enforce Cognito (redirect to /login if not signed in).
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
