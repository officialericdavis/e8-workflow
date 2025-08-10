'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/scheduling', label: 'Scheduling' },
  { href: '/quality-control', label: 'Quality Control' },
  { href: '/clients', label: 'Clients' },
  { href: '/editors', label: 'Editors' },
  { href: '/reports', label: 'Reports' },
  { href: '/integrations', label: 'Integrations' },
];

export default function Sidebar() {
  const pathname = usePathname() || '/';
  return (
    <aside style={{ borderRight:'1px solid #edf0f6', background:'#fff', padding:16 }}>
      <div style={{ fontWeight:900, marginBottom:12 }}>E8 Workflow</div>
      <nav style={{ display:'grid', gap:6 }}>
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display:'block', padding:'10px 12px', borderRadius:10,
              textDecoration:'none', color: active ? '#fff' : '#111827',
              background: active ? '#111827' : 'transparent',
              border: active ? '1px solid #111827' : '1px solid #e5e7eb'
            }}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
