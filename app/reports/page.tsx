'use client';

import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { can } from '@/lib/roles';
import { useEffect, useMemo, useState } from 'react';
import { loadLS, saveLS, purgeByAge } from '@/lib/retention';

type Report = { id: string; name: string; summary?: string; createdAt: number; };

const KEY = 'e8_reports';

export default function ReportsPage() {
  const { role } = useRole();
  const canRead = can(role, 'reports:r');
  const canWrite = can(role, 'reports:rw');

  const [list, setList] = useState<Report[]>([]);
  const [name, setName] = useState('Weekly KPI Snapshot');
  const [summary, setSummary] = useState('Leads up 12%, cycle time down 6%.');

  useEffect(() => { setList(purgeByAge(loadLS(KEY, [], true))); }, []);
  useEffect(() => { saveLS(KEY, list); }, [list]);

  const sorted = useMemo(() => [...list].sort((a,b)=>b.createdAt - a.createdAt), [list]);

  function saveSnapshot() {
    if (!canWrite) return;
    const r: Report = { id: crypto.randomUUID(), name: name.trim() || 'Report', summary, createdAt: Date.now() };
    setList(prev => [r, ...prev]);
  }
  function remove(id: string) {
    if (!canWrite) return;
    setList(prev => prev.filter(r => r.id !== id));
  }

  if (!canRead) return <RequireAuth><div /></RequireAuth>;

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Reports</h1>

        {/* Snapshot creator */}
        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:10, opacity:canWrite?1:.6 }}>
          <h2 style={{ margin:0 }}>Save snapshot</h2>
          <input placeholder="Report title" value={name} onChange={e=>setName(e.target.value)} style={inp}/>
          <textarea placeholder="Short summary" rows={4} value={summary} onChange={e=>setSummary(e.target.value)} style={{ ...inp, minHeight:100 }} />
          <div><button disabled={!canWrite} onClick={saveSnapshot} style={btnPrimary}>Save</button></div>
          {!canWrite && <div style={{ color:'#6b7280', fontSize:12 }}>View only — your role cannot save reports.</div>}
        </section>

        {/* List of saved reports */}
        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:8 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr><th style={th}>Title</th><th style={th}>Created</th><th style={th}>Summary</th><th style={th}></th></tr>
            </thead>
            <tbody>
              {sorted.map(r => (
                <tr key={r.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}>{r.name}</td>
                  <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
                  <td style={td}>{r.summary || '-'}</td>
                  <td style={{ ...td, textAlign:'right' }}>{canWrite && <button onClick={()=>remove(r.id)} style={btnGhost}>Delete</button>}</td>
                </tr>
              ))}
              {sorted.length === 0 && <tr><td colSpan={4} style={{ ...td, color:'#6b7280' }}>No saved reports (last 90 days).</td></tr>}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}

const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties = { padding:'10px' };
const inp: React.CSSProperties = { border:'1px solid #e5e7eb', borderRadius:12, padding:'8px 12px' };
const btnPrimary: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #111827', background:'#111827', color:'#fff' };
const btnGhost: React.CSSProperties = { height:32, padding:'0 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff' };
