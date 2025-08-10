'use client';

import { useRole } from '../providers/RolesProvider';

export default function RoleTestPage() {
  const { role, setRole, signOut } = useRole();

  const view = role ? `Current Role: ${role}` : 'Current Role: none';

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>{view}</h1>
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setRole('admin')}>Set Admin</button>
        <button onClick={() => setRole('manager')}>Set Manager</button>
        <button onClick={() => setRole('editor')}>Set Editor</button>
        <button onClick={() => setRole('viewer')}>Set Viewer</button>
        <button onClick={signOut}>Clear Role</button>
      </div>
      <div style={{ marginTop: 16 }}>
        {role === 'admin' && <p>🔑 Admin Panel: full access</p>}
        {role === 'manager' && <p>📋 Manager Dashboard</p>}
        {role === 'editor' && <p>✏️ Editor Tools</p>}
        {role === 'viewer' && <p>👀 Viewer Mode</p>}
        {!role && <p>❓ No role selected</p>}
      </div>
    </div>
  );
}
