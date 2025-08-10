'use client';
import * as React from 'react';
import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { loadLS, saveLS } from '../lib/retention';

type Client = { id: string; name: string; monthlyTarget: number; notes?: string; active: boolean; createdAt: number; };
const KEY = 'e8_clients';

export default function ClientsPage() {
  const { role } = useRole();
  const canWrite = role === 'admin' || role === 'manager';
  const [clients, setClients] = React.useState<Client[]>(() => loadLS<Client[]>(KEY, [], false));
  const [name, setName] = React.useState(''); 
  const [monthly, setMonthly] = React.useState<number>(10);
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => { saveLS(KEY, clients); }, [clients]);

  function addClient() {
    const n = name.trim();
    if (!n) return alert('Client name is required');
    setClients(prev => [{
      id: crypto.randomUUID(), name: n, monthlyTarget: Math.max(0, Number(monthly)||0),
      notes: notes.trim() || undefined, active: true, createdAt: Date.now()
    }, ...prev]);
    setName(''); setMonthly(10); setNotes('');
  }
  function update(id: string, patch: Partial<Client>) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }
  function remove(id: string) {
    if (!confirm('Remove this client?')) return;
    setClients(prev => prev.filter(c => c.id !== id));
  }

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Clients</h1>

        <section style={card}>
          <h2 style={{ margin:'0 0 8px' }}>Add Client</h2>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 180px' }}>
            <input placeholder="Client name *" value={name} onChange={e=>setName(e.target.value)} style={inp}/>
            <input type="number" min={0} placeholder="Monthly target *" value={monthly} onChange={e=>setMonthly(Number(e.target.value)||0)} style={inp}/>
          </div>
          <textarea placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} style={{...inp, minHeight:90}}/>
          <div><button onClick={addClient} disabled={!canWrite} style={btnPrimary}>Create</button></div>
          {!canWrite && <div style={muted}>View only — editors/viewers can’t add clients.</div>}
        </section>

        <section style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr><th style={th}>Client</th><th style={th}>Monthly Target</th><th style={th}>Active</th><th style={th}>Notes</th><th style={th}></th></tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}><input value={c.name} onChange={e=>update(c.id,{name:e.target.value})} disabled={!canWrite} style={inp}/></td>
                  <td style={td}><input type="number" min={0} value={c.monthlyTarget} onChange={e=>update(c.id,{monthlyTarget: Math.max(0, Number(e.target.value)||0)})} disabled={!canWrite} style={inp}/></td>
                  <td style={td}><label style={{ display:'inline-flex', gap:8, alignItems:'center' }}><input type="checkbox" checked={c.active} onChange={e=>update(c.id,{active:e.target.checked})} disabled={!canWrite}/>{c.active ? 'Active' : 'Paused'}</label></td>
                  <td style={td}><input value={c.notes||''} onChange={e=>update(c.id,{notes:e.target.value})} disabled={!canWrite} style={inp}/></td>
                  <td style={{ ...td, textAlign:'right' }}><button onClick={()=>remove(c.id)} disabled={!canWrite} style={btnGhost}>Delete</button></td>
                </tr>
              ))}
              {clients.length===0 && <tr><td colSpan={5} style={{...td,color:'#6b7280'}}>No clients yet.</td></tr>}
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
const muted: React.CSSProperties = { color:'#6b7280', fontSize:12 };
