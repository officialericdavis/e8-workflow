'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const LINKS = [
  { href: '/',              label: 'Dashboard',    emoji: '📥' },
  { href: '/tasks',         label: 'Tasks',        emoji: '🧩' },
  { href: '/quality-control',label: 'Quality Control', emoji: '✅' },
  { href: '/scheduling',    label: 'Scheduling',   emoji: '📅' },
  { href: '/reports',       label: 'Reports',      emoji: '📊' },
  { href: '/integrations',  label: 'Integrations', emoji: '🔌' },
];

export default function Sidebar() {
  const pathname = usePathname() || '/';
  return (
    <aside style={aside}>
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>E8 Productions</div>
      <nav style={{ display: 'grid', gap: 8 }}>
        {LINKS.map(({ href, label, emoji }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              ...item,
              background: active ? '#111827' : '#fff',
              color: active ? '#fff' : '#111827',
              borderColor: active ? '#111827' : '#e5e7eb'
            }}>
              <span style={{ marginRight: 10 }}>{emoji}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const aside: React.CSSProperties = {
  padding: 16,
  borderRight: '1px solid #edf0f6',
  background: '#fff',
  minHeight: '100dvh',
  width: 260,
  position: 'sticky',
  top: 0
};

const item: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: 44,
  padding: '0 14px',
  borderRadius: 12,
  fontWeight: 800,
  textDecoration: 'none',
  border: '1px solid',
};
