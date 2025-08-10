'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import RequireAuth from '../components/RequireAuth';
import { CATEGORIES, Client, Task } from '../lib/types';
import { Store, isSameMonth } from '../lib/store';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const th: React.CSSProperties   = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties   = { padding:'10px' };

export default function ReportsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => { setClients(Store.getClients()); setTasks(Store.getTasks()); }, []);

  const byClient = useMemo(() => {
    // Count Done tasks in current month per client & category
    const map: Record<string, Record<string, number>> = {};
    clients.forEach(c => {
      map[c.id] = Object.fromEntries(CATEGORIES.map(cat => [cat, 0]));
    });
    tasks.forEach(t => {
      if (t.status === 'Done' && isSameMonth(t.doneAt) && t.clientId && CATEGORIES.includes(t.category)) {
        map[t.clientId][t.category] = (map[t.clientId][t.category] || 0) + 1;
      }
    });
    return map;
  }, [clients, tasks]);

  return (
    <RequireAuth>
      <main style={{ padding:24, display:'grid', gap:16 }}>
        <h1 style={{ margin:0 }}>Reports (This Month)</h1>

        <section style={card}>
          <h2 style={{ margin:'0 0 4px' }}>Client Progress by Deliverable</h2>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Client</th>
                {CATEGORIES.map(cat => <th key={cat} style={{ ...th, textAlign:'right' }}>{cat}</th>)}
                <th style={{ ...th, textAlign:'right' }}>Total Done</th>
                <th style={{ ...th, textAlign:'right' }}>Target</th>
                <th style={{ ...th, textAlign:'right' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => {
                const doneCounts = byClient[c.id] ?? {};
                const totalDone = CATEGORIES.reduce((s, cat) => s + (doneCounts[cat] || 0), 0);
                const targetTotal = CATEGORIES.reduce((s, cat) => s + (c.targets[cat] || 0), 0);
                const pct = targetTotal ? Math.min(100, Math.round((totalDone / targetTotal) * 100)) : 0;
                return (
                  <tr key={c.id} style={{ borderTop:'1px solid #edf0f6' }}>
                    <td style={td}><strong>{c.name}</strong></td>
                    {CATEGORIES.map(cat => (
                      <td key={cat} style={{ ...td, textAlign:'right' }}>{doneCounts[cat] || 0} / {(c.targets[cat] || 0)}</td>
                    ))}
                    <td style={{ ...td, textAlign:'right' }}>{totalDone}</td>
                    <td style={{ ...td, textAlign:'right' }}>{targetTotal}</td>
                    <td style={{ ...td, textAlign:'right' }}>
                      <div style={{ display:'grid', gap:6 }}>
                        <div style={{ height:10, background:'#eef2ff', borderRadius:999, overflow:'hidden' }}>
                          <div style={{ width:`${pct}%`, height:'100%', background:'#4f46e5' }} />
                        </div>
                        <span style={{ fontSize:12, color:'#6b7280' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}
