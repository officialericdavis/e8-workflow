import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from './providers/ClientProviders';
import SideNav from './components/SideNav';

export const metadata: Metadata = {
  title: 'E8 Workflow Manager (Mock)',
  description: 'UI mock for E8 Productions Workflow System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100svh' }}>
            <aside style={{ padding: 16, borderRight: '1px solid #eef0f5', background: '#FCFCFF' }}>
              <SideNav />
            </aside>
            <main style={{ padding: 20 }}>{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
