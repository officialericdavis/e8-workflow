'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../providers/RolesProvider';

type Role = 'admin' | 'manager' | 'editor' | 'viewer';
const ROLES: Role[] = ['admin', 'manager', 'editor', 'viewer'];

const DEMO_USERS: Record<Role, { email: string; password: string; label: string }> = {
  admin:   { email: 'admin@demo.com',   password: 'Admin123!',   label: 'Admin' },
  manager: { email: 'manager@demo.com', password: 'Manager123!', label: 'Manager' },
  editor:  { email: 'editor@demo.com',  password: 'Editor123!',  label: 'Editor' },
  viewer:  { email: 'viewer@demo.com',  password: 'Viewer123!',  label: 'Viewer' },
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [selectedRole, setSelectedRole] = useState<Role>('viewer');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fillDemo = () => {
    const u = DEMO_USERS[selectedRole];
    setEmail(u.email);
    setPw(u.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const u = DEMO_USERS[selectedRole];
    const ok = email.trim().toLowerCase() === u.email && pw === u.password;

    await new Promise(r => setTimeout(r, 400));

    if (!ok) {
      setLoading(false);
      setErr('Invalid email or password for the selected role.');
      return;
    }

    setRole(selectedRole);
    router.push('/');
  };

  return (
    <main style={styles.wrap}>
      <section style={styles.card} aria-label="Sign in">
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Choose your role and sign in with email & password.</p>

        <div style={styles.roleRow} role="tablist" aria-label="Role selector">
          {ROLES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={selectedRole === r}
              onClick={() => setSelectedRole(r)}
              style={{ ...styles.rolePill, ...(selectedRole === r ? styles.rolePillActive : {}) }}
            >
              {DEMO_USERS[r].label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              inputMode="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <div style={styles.pwRow}>
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={{ ...styles.input, margin: 0, flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={styles.ghostBtn}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {err && <div role="alert" style={styles.error}>{err}</div>}

          <div style={styles.actions}>
            <button type="button" onClick={fillDemo} style={styles.secondaryBtn}>Use demo creds</button>
            <button type="submit" disabled={loading} style={{ ...styles.primaryBtn, ...(loading ? styles.primaryBtnDisabled : {}) }}>
              {loading ? 'Signing in…' : `Sign in as ${DEMO_USERS[selectedRole].label}`}
            </button>
          </div>
        </form>

        <p style={styles.help}>Demo only. We’ll swap to Amplify Auth next.</p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#f5f7fb 0%,#e9eef9 100%)', padding: 16 },
  card: { width: '100%', maxWidth: 460, background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 24 },
  title: { fontSize: 24, fontWeight: 700, margin: 0 },
  subtitle: { color: '#5f6b7b', marginTop: 6, marginBottom: 16 },
  roleRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  rolePill: { padding: '10px 14px', borderRadius: 999, border: '1px solid #d8dce6', background: '#fff', cursor: 'pointer', fontWeight: 600 },
  rolePillActive: { background: '#111827', color: '#fff', borderColor: '#111827' },
  form: { display: 'grid', gap: 12, marginTop: 4 },
  label: { display: 'grid', gap: 6, fontWeight: 600 },
  input: { height: 48, padding: '0 14px', borderRadius: 12, border: '1px solid #cfd5e3', outline: 'none', fontSize: 16 },
  pwRow: { display: 'flex', gap: 8, alignItems: 'center' },
  ghostBtn: { height: 48, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 12px', cursor: 'pointer', fontWeight: 600 },
  actions: { display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap' },
  secondaryBtn: { height: 48, padding: '0 14px', borderRadius: 12, border: '1px solid #d8dce6', background: '#fff', cursor: 'pointer', fontWeight: 700 },
  primaryBtn: { height: 48, padding: '0 16px', borderRadius: 12, border: 'none', background: '#111827', color: '#fff', cursor: 'pointer', fontWeight: 800, flex: 1 },
  primaryBtnDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  error: { background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 10, border: '1px solid #fecaca' },
  help: { color: '#6b7280', fontSize: 12, marginTop: 14 },
};
