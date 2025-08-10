'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AMPLIFY_MOCK } from '../amplify-config';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  // In mock mode, allow everything
  if (AMPLIFY_MOCK) return <>{children}</>;

  const router = useRouter();
  const pathname = usePathname() || '/';
  const { authStatus } = useAuthenticator((ctx) => [ctx.authStatus]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authStatus, router, pathname]);

  if (authStatus === 'configuring' || authStatus === 'unauthenticated') return null;
  return <>{children}</>;
}
