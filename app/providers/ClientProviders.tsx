'use client';

import '../amplify-config';
import { RolesProvider } from './RolesProvider';
import { ToastsProvider } from '../components/Toasts';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastsProvider>
      <RolesProvider>{children}</RolesProvider>
    </ToastsProvider>
  );
}
