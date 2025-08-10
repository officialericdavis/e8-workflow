'use client';

import '../amplify-config';              // was in layout — keep this client-side
import { RolesProvider } from '@providers/RolesProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <RolesProvider>{children}</RolesProvider>;
}
