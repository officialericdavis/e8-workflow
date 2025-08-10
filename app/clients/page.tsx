'use client';

import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, Client } from '../lib/types';
import { Store } from '../lib/store';
import RequireAuth from '../components/RequireAuth';
import EditLock from '../components/EditLock';
import { useRole } from '../providers/RolesProvider';
import { AMPLIFY_MOCK } from '../amplify-config';

export const dynamic = 'force-dynamic';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const inputNarrow: React.CSSProperties = { width: 90, textAlign:'right', padding:'6px 8px', border:'1px solid #dfe4ee', borderRadius:8 };
const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'6px 8px', borderBottom:'1px solid #edf0f6' };
const td: React.CSSProperties = { padding:'8px', borderBottom:'1px solid #f2f4fa' };

export default function ClientsPage() {
  const { role } = useRole();
  const canEdit = AMPLIFY_MOCK || role === 'admin' || role === 'manager';

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(Store.getClients());
  }, []);

  const totals = useMemo(() => {
    const sum: Record<string, number> = {};
    CATEGORIES.forEach(c => (sum[c] = 0));
    clients.forEach(cl => CATEGORIES.forEach(c => (sum[c] += cl.targets[c] || 0)));
    return sum;
  }, [clients]);

  function updateTarget(id: string, cat: (typeof CATEGORIES)[number], value: number) {
    const next = clients.map(c =>
      c.id === id ? { ...c, targets: { ...c.targets, [cat]: Math.max(0, value | 0) } } : c
    );
    setClients(next);
    Store.setClients(next);
  }

  function addClient() {
    const name = prompt('Client name?')?.trim();
    if (!name) return;
    const base = Object.fromEntries(CATEGORIES.map(c => [c, 0]));
    const next = [...clients, { id: crypto.randomUUID(), name, targets: base as Client['targets'] }];
    setClients(next);
    Store.setClients(next);
  }

  function renameClient(id: string) {
    const curr = clients.find(c => c.id === id);
    if (!curr) return;
    const name = prompt('Rename client', curr.name)?.trim();
    if (!name) return;
    const next = clients.map(c => (c.id === id ? { ...c, name } : c));
    setClients(next);
    Store.setClients(next);
  }

  function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return;
    const next = clients.filter(c => c.id !== id);
    setClients(next);
    Store.setClients(next);
  }

  return (
    <RequireAuth>
      <EditLock allowed={canEdit}>
        <main style={{ padding: 24, display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0 }}>Clients & Monthly Targets</h1>
            <button
              onClick={addClient}
              disabled={!canEdit}
              style={{
                opacity: canEdit ? 1 : 0.6,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #dbe2ef',
                background: '#111827',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              + Add Client
            </button>
          </div>

          <section style={card}>
            <h2 style={{ margin: '0 0 4px' }}>Totals (This Month)</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <div key={cat} style={{ padding: 12, border: '1px solid #edf0f6', borderRadius: 12, minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{cat}</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{totals[cat] ?? 0}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <h2 style={{ margin: '0 0 4px' }}>Per Client Targets</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Client</th>
                  {CATEGORIES.map(cat => (
                    <th key={cat} style={th}>{cat}</th>
                  ))}
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {clients.map(cl => (
                  <tr key={cl.id}>
                    <td style={td}>
                      <button
                        onClick={() => renameClient(cl.id)}
                        disabled={!canEdit}
                        style={{ all: 'unset', cursor: canEdit ? 'pointer' : 'default', fontWeight: 600 }}
                        title={canEdit ? 'Rename' : 'View'}
                      >
                        {cl.name}
                      </button>
                    </td>
                    {CATEGORIES.map(cat => (
                      <td key={cat} style={td}>
                        <input
                          type="number"
                          min={0}
                          value={cl.targets[cat] ?? 0}
                          onChange={e => updateTarget(cl.id, cat, Number(e.target.value))}
                          disabled={!canEdit}
                          style={inputNarrow}
                        />
                      </td>
                    ))}
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button
                        onClick={() => deleteClient(cl.id)}
                        disabled={!canEdit}
                        style={{
                          opacity: canEdit ? 1 : 0.6,
                          cursor: canEdit ? 'pointer' : 'not-allowed',
                          padding: '6px 10px',
                          borderRadius: 10,
                          border: '1px solid #f3d1d1',
                          background: '#fff5f5',
                          color: '#b91c1c',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={CATEGORIES.length + 2} style={{ ...td, textAlign: 'center', color: '#6b7280' }}>
                      No clients yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
      </EditLock>
    </RequireAuth>
  );
}
