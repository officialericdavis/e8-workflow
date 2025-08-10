'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AMPLIFY_MOCK } from '../amplify-config';
import { useRole } from '../providers/RolesProvider';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  if (AMPLIFY_MOCK) return <>{children}</>; // allow everything in mock mode

  const router = useRouter();
  const pathname = usePathname() || '/';
  const { role } = useRole(); // null means not signed in (until RolesProvider loads session)

  useEffect(() => {
    if (role === null) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [role, router, pathname]);

  if (role === null) return null; // avoid flashing protected UI
  return <>{children}</>;
}
