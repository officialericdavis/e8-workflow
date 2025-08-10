'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, Client } from '../lib/types';
import { Store, initDefaults } from '../lib/store';
import RequireAuth from '../components/RequireAuth';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => { initDefaults(); setClients(Store.getClients()); }, []);

  const totals = useMemo(() => {
    const sum: Record<string, number> = {};
    CATEGORIES.forEach(c => sum[c] = 0);
    clients.forEach(cl => CATEGORIES.forEach(c => sum[c] += cl.targets[c] || 0));
    return sum;
  }, [clients]);

  function updateTarget(id: string, cat: (typeof CATEGORIES)[number], value: number) {
    const next = clients.map(c => c.id === id ? { ...c, targets: { ...c.targets, [cat]: Math.max(0, value|0) } } : c);
    setClients(next); Store.setClients(next);
  }

  function addClient() {
    const name = prompt('Client name?')?.trim();
    if (!name) return;
    const base = Object.fromEntries(CATEGORIES.map(c => [c, 0]));
    const next = [...clients, { id: crypto.randomUUID(), name, targets: base as Client['targets'] }];
    setClients(next); Store.setClients(next);
  }

  function renameClient(id: string) {
    const current = clients.find(c => c.id === id); if (!current) return;
    const name = prompt('Rename client', current.name)?.trim(); if (!name) return;
    const next = clients.map(c => c.id === id ? { ...c, name } : c);
    setClients(next); Store.setClients(next);
  }

  function removeClient(id: string) {
    if (!confirm('Remove client?')) return;
    const next = clients.filter(c => c.id !== id);
    setClients(next); Store.setClients(next);
  }

  return (
    <RequireAuth>
      <main style={{ padding: 24, display:'grid', gap:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h1 style={{ margin:0 }}>Clients & Monthly Targets</h1>
          <button onClick={addClient} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #dfe4ee', background:'#111827', color:'#fff' }}>New Client</button>
        </div>

        <section style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:10 }}>Client</th>
                {CATEGORIES.map(cat => <th key={cat} style={{ textAlign:'right', padding:10 }}>{cat}</th>)}
                <th style={{ textAlign:'right', padding:10 }}>Total</th>
                <th style={{ width:1 }}></th>
              </tr>
            </thead>
            <tbody>
              {clients.map(cl => {
                const total = CATEGORIES.reduce((s, c) => s + (cl.targets[c]||0), 0);
                return (
                  <tr key={cl.id} style={{ borderTop:'1px solid #edf0f6' }}>
                    <td style={{ padding:10, fontWeight:600, maxWidth:220 }}>
                      <span>{cl.name}</span>
                      <div style={{ display:'flex', gap:8, marginTop:6 }}>
                        <button onClick={() => renameClient(cl.id)} style={{ fontSize:12, border:'1px solid #e5e7eb', borderRadius:8, padding:'4px 8px', background:'#fff' }}>Rename</button>
                        <button onClick={() => removeClient(cl.id)} style={{ fontSize:12, border:'1px solid #f3d1d1', color:'#991b1b', borderRadius:8, padding:'4px 8px', background:'#fff' }}>Remove</button>
                      </div>
                    </td>
                    {CATEGORIES.map(cat => (
                      <td key={cat} style={{ padding:10, textAlign:'right' }}>
                        <input
                          type="number" min={0}
                          value={cl.targets[cat] ?? 0}
                          onChange={(e) => updateTarget(cl.id, cat, Number(e.target.value))}
                          style="width:90px; text-align:right; padding:6px 8px; border:1px solid #dfe4ee; border-radius:8px;"
                        />
                      </td>
                    ))}
                    <td style={{ padding:10, textAlign:'right', fontWeight:700 }}>{total}</td>
                    <td />
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:'2px solid #e5e7eb' }}>
                <td style={{ padding:10, fontWeight:700 }}>Totals</td>
                {CATEGORIES.map(cat => <td key={cat} style={{ padding:10, textAlign:'right', fontWeight:700 }}>{totals[cat]}</td>)}
                <td style={{ padding:10, textAlign:'right', fontWeight:900 }}>
                  {Object.values(totals).reduce((a,b)=>a+b,0)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}
