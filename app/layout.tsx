import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from './providers/ClientProviders';
import AppShell from './components/AppShell';

export const metadata: Metadata = {
  title: 'E8 Workflow Manager (Mock)',
  description: 'UI mock for E8 Productions Workflow System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f6f7fb', color: '#111827' }}>
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
