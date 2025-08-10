'use client';

import { useRoles } from '../providers/RolesProvider';

export default function RoleTestPage() {
  const { role, setRole } = useRoles();

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Current Role: {role ?? 'none'}</h1>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setRole('admin')}>Set Admin</button>
        <button onClick={() => setRole('manager')}>Set Manager</button>
        <button onClick={() => setRole('editor')}>Set Editor</button>
        <button onClick={() => setRole('viewer')}>Set Viewer</button>
        <button onClick={() => setRole(null)}>Clear Role</button>
      </div>
    </div>
  );
}
