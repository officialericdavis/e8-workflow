'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isLogin = pathname === '/login';
  if (isLogin) return <main style={{ padding: 0 }}>{children}</main>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100dvh' }}>
      <Sidebar />
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
