'use client';

import '../amplify-config';
import { RolesProvider } from '@providers/RolesProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <RolesProvider>{children}</RolesProvider>;
}
