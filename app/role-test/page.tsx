'use client';

import { useRoles } from '../providers/RolesProvider';

export default function RoleTestPage() {
  const { role, setRole } = useRoles();

  const renderRoleContent = () => {
    switch (role) {
      case 'admin':
        return <p style={{ color: 'red' }}>🔑 Admin Panel: You have full access.</p>;
      case 'manager':
        return <p style={{ color: 'orange' }}>📋 Manager Dashboard: Manage teams & projects.</p>;
      case 'editor':
        return <p style={{ color: 'blue' }}>✏️ Editor Tools: You can edit content.</p>;
      case 'viewer':
        return <p style={{ color: 'green' }}>👀 Viewer Mode: Read-only access.</p>;
      default:
        return <p>❓ No role selected. Please choose a role.</p>;
    }
  };

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
      <div style={{ marginTop: 20 }}>
        {renderRoleContent()}
      </div>
    </div>
  );
}
