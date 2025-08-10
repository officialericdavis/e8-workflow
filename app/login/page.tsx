'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../providers/RolesProvider';

type Role = 'admin' | 'manager' | 'editor' | 'viewer';

const ROLES: Role[] = ['admin', 'manager', 'editor', 'viewer'];

// Demo credentials (change these as you like; we'll replace with Amplify next)
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

    // Mock verification (replace with Amplify Auth next)
    const u = DEMO_USERS[selectedRole];
    const ok = email.trim().toLowerCase() === u.email && pw === u.password;

    await new Promise(r => setTimeout(r, 400)); // small UX pause

    if (!ok) {
      setLoading(false);
      setErr('Invalid email or password for the selected role.');
      return;
    }

    setRole(selectedRole);
    router.push('/'); // go to dashboard/home
  };

  return (
    <main style={styles.wrap}>
      <section style={styles.card} aria-label="Sign in">
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Choose your role and sign in with email & password.</p>

        {/* Role selector */}
        <div style={styles.roleRow} role="tablist" aria-label="Role selector">
          {ROLES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={selectedRole === r}
              onClick={() => setSelectedRole(r)}
              style={{
                ...styles.rolePill,
                ...(selectedRole === r ? styles.rolePillActive : {}),
              }}
            >
              {DEMO_USERS[r].label}
            </button>
          ))}
        </div>

        {/* Form */}
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
            <button
              type="button"
              onClick={fillDemo}
              style={styles.secondaryBtn}
            >
              Use demo creds
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.primaryBtn, ...(loading ? styles.primaryBtnDisabled : {}) }}
            >
              {loading ? 'Signing in…' : `Sign in as ${DEMO_USERS[selectedRole].label}`}
            </button>
          </div>
        </form>

        <p style={styles.help}>
          Demo for UI only. Next step: wire to Amplify Auth and map users to roles.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100svh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #f5f7fb 0%, #e9eef9 100%)',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0
