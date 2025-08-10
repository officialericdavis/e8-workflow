import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from './providers/ClientProviders';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'E8 Workflow Manager (Mock)',
  description: 'UI mock for E8 Productions Workflow System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f6f7fb', color: '#111827' }}>
        <ClientProviders>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100dvh' }}>
            <Sidebar />
            <main style={{ padding: 24 }}>{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
