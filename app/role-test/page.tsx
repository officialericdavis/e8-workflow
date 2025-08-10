'use client';

import { useRole } from '../providers/RolesProvider';
import Link from 'next/link';

export default function RoleTestPage() {
  const { role, refresh, signOut } = useRole();

  return (
    <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#f6f7fb', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,.08)', padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Role Status</h1>
        <p style={{ color: '#5f6b7b', marginTop: 6 }}>
          Current role: <strong>{role ?? 'none'}</strong>
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <button onClick={refresh} style={btnSecondary}>Refresh role</button>
          <button onClick={signOut} style={btnPrimary}>Sign out</button>
          <Link href="/login" style={{ ...btnGhost, textDecoration: 'none', lineHeight: '48px' }}>Go to Login</Link>
          <Link href="/" style={{ ...btnGhost, textDecoration: 'none', lineHeight: '48px' }}>Home</Link>
        </div>

        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 12 }}>
          Tip: If you change this user’s group in Cognito, tap <b>Refresh role</b> to pull a new token. Or sign out/in.
        </p>
      </section>
    </main>
  );
}

const btnBase: React.CSSProperties = {
  height: 48, padding: '0 16px', borderRadius: 12, border: '1px solid transparent',
  fontWeight: 800, cursor: 'pointer',
};
const btnPrimary: React.CSSProperties = { ...btnBase, background: '#111827', color: '#fff' };
const btnSecondary: React.CSSProperties = { ...btnBase, background: '#fff', borderColor: '#d8dce6' };
const btnGhost: React.CSSProperties = { ...btnBase, background: '#f8fafc', borderColor: '#e2e8f0', display: 'inline-block' };
