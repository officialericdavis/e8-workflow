'use client';

import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { AMPLIFY_MOCK } from '../amplify-config';

export default function RoleTestPage() {
  const { role, setRole, signOut } = useRole();
  const canEdit = AMPLIFY_MOCK; // allow manual switch only in mock mode

  return (
    <RequireAuth>
      <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#f6f7fb' }}>
        <div style={{ width: 420, maxWidth: '100%', background:'#fff', border:'1px solid #edf0f6', borderRadius:16, boxShadow:'0 20px 50px rgba(0,0,0,.08)', padding: 20, display:'grid', gap:12 }}>
          <h1 style={{ margin: 0, fontWeight: 900 }}>Role Test</h1>
          <div><strong>Current role:</strong> {role ?? 'none'}</div>

          {canEdit ? (
            <>
              <div style={{ fontSize: 12, color:'#6b7280' }}>Mock mode: switch role</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(['admin','manager','editor','viewer'] as const).map(r => (
                  <button
                    key={r}
                    onClick={()=>setRole(r)}
                    style={{
                      height:36, padding:'0 12px', borderRadius:10, fontWeight:900, cursor:'pointer',
                      border: role===r ? '1px solid #111827' : '1px solid #e5e7eb',
                      background: role===r ? '#111827' : '#fff',
                      color: role===r ? '#fff' : '#111827'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color:'#6b7280' }}>
              Roles are derived from your Cognito group. (Switch by changing the user’s group in Cognito.)
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button onClick={()=>signOut()} style={{ height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #e5e7eb', background:'#fff' }}>
              Sign out
            </button>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
