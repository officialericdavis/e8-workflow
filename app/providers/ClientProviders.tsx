'use client';

import '../amplify-config';
import ToastProvider from '../components/Toasts';
import { RolesProvider } from './RolesProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RolesProvider>{children}</RolesProvider>
    </ToastProvider>
  );
}
