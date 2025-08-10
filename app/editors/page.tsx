'use client';
import * as React from 'react';
import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { loadLS, saveLS } from '../lib/retention';

type Editor = { id: string; name: string; dailyCapacity: number; active: boolean; createdAt: number; };
const KEY = 'e8_editors';

export default function EditorsPage() {
  const { role } = useRole();
  const canWrite = role === 'admin' || role === 'manager';
  const [editors, setEditors] = React.useState<Editor[]>(() => loadLS<Editor[]>(KEY, [], false));
  const [name, setName] = React.useState('');
  const [cap, setCap] = React.useState<number>(5);

  React.useEffect(() => { saveLS(KEY, editors); }, [editors]);

  function add() {
    const n = name.trim();
    if (!n) return alert('Editor name required');
    setEditors(prev => [{ id: crypto.randomUUID(), name:n, dailyCapacity: Math.max(0, Number(cap)||0), active:true, createdAt: Date.now() }, ...prev]);
    setName(''); setCap(5);
  }
  function update(id: string, patch: Partial<Editor>) {
    setEditors(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  }
  function remove(id: string) {
    if (!confirm('Remove editor profile?')) return;
    setEditors(prev => prev.filter(e => e.id !== id));
  }

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Editors</h1>
        <section style={card}>
          <h2 style={{ margin:'0 0 8px' }}>Add Editor</h2>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 180px' }}>
            <input placeholder="Name *" value={name} onChange={e=>setName(e.target.value)} style={inp}/>
            <input type="number" min={0} value={cap} onChange={e=>setCap(Number(e.target.value)||0)} style={inp}/>
          </div>
          <div><button onClick={add} disabled={!canWrite} style={btnPrimary}>Create</button></div>
        </section>

        <section style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={th}>Editor</th><th style={th}>Daily Capacity</th><th style={th}>Active</th><th style={th}></th></tr></thead>
            <tbody>
              {editors.map(e => (
                <tr key={e.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}><input value={e.name} onChange={ev=>update(e.id,{name:ev.target.value})} disabled={!canWrite} style={inp}/></td>
                  <td style={td}><input type="number" min={0} value={e.dailyCapacity} onChange={ev=>update(e.id,{dailyCapacity: Math.max(0, Number(ev.target.value)||0)})} disabled={!canWrite} style={inp}/></td>
                  <td style={td}><label style={{ display:'inline-flex', gap:8, alignItems:'center' }}><input type="checkbox" checked={e.active} onChange={ev=>update(e.id,{active: ev.target.checked})} disabled={!canWrite}/>{e.active ? 'Active' : 'Paused'}</label></td>
                  <td style={{ ...td, textAlign:'right' }}><button onClick={()=>remove(e.id)} disabled={!canWrite} style={btnGhost}>Delete</button></td>
                </tr>
              ))}
              {editors.length === 0 && <tr><td colSpan={4} style={{...td,color:'#6b7280'}}>No editors yet.</td></tr>}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties = { padding:'10px' };
const inp: React.CSSProperties = { height:40, border:'1px solid #e5e7eb', borderRadius:12, padding:'0 12px', width:'100%' };
const btnPrimary: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #111827', background:'#111827', color:'#fff' };
const btnGhost: React.CSSProperties = { height:32, padding:'0 10px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff' };
