'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/quality', label: 'Quality Control' },
  { href: '/scheduling', label: 'Scheduling' },
  { href: '/reports', label: 'Reports' },
  { href: '/integrations', label: 'Integrations' },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <nav style={{ display: 'grid', gap: 12 }}>
      {items.map((it) => {
        const active = pathname === it.href || (it.href !== '/' && pathname.startsWith(it.href));
        return (
          <Link
            key={it.href}
            href={it.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 56,
              padding: '0 18px',
              borderRadius: 16,
              fontWeight: 800,
              textDecoration: 'none',
              background: active ? '#111827' : '#F7F7FA',
              color: active ? '#fff' : '#111827',
              border: active ? '1px solid #111827' : '1px solid #E7E8EF',
              boxShadow: active ? 'inset 0 -2px 0 rgba(255,255,255,.12)' : 'none',
            }}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
