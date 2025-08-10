'use client';
import React from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  // If Cognito env vars aren’t present, let everything through (mock mode).
  const cfgReady = Boolean(
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
  );
  if (!cfgReady) return <>{children}</>;

  // Minimal placeholder gate; when you finish real auth, replace this.
  return <>{children}</>;
}
