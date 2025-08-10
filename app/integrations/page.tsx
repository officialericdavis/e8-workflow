'use client';
import RequireAuth from '../components/RequireAuth';
import { useState } from 'react';

export default function IntegrationsPage() {
  const [state, setState] = useState({
    slack: true,
    gdrive: true,
    privateServer: false
  });

  return (
    <RequireAuth>
      <h1 style={{ marginTop: 0, fontWeight: 900 }}>Integrations</h1>

      <div style={{ display:'grid', gap:12, maxWidth: 560 }}>
        {[
          { key: 'slack', label: 'Slack' },
          { key: 'gdrive', label: 'Google Drive' },
          { key: 'privateServer', label: 'Private Server' },
        ].map(i => (
          <div key={i.key} style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:900 }}>{i.label}</div>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <input type="checkbox"
                     checked={(state as any)[i.key]}
                     onChange={(e)=>setState(s => ({ ...s, [i.key]: e.target.checked }))}
              />
              <span>{(state as any)[i.key] ? 'Connected' : 'Disconnected'}</span>
            </label>
          </div>
        ))}
      </div>
    </RequireAuth>
  );
}
