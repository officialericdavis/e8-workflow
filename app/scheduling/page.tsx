'use client';
import RequireAuth from '../components/RequireAuth';
import { useState, useRef } from 'react';

type Event = { id:string; title:string; date:string; time:string; location:string; crew:string };

const seed: Event[] = [
  { id:'EV-1', title:'YouTube Premiere EP23', date:'2025-08-11', time:'12:00', location:'Studio A', crew:'Luis, Sam' },
  { id:'EV-2', title:'Client Shoot – MissBehaveTV', date:'2025-08-13', time:'09:30', location:'DTLA', crew:'Neha, Rahul' },
];

export default function SchedulingPage() {
  const [rows, setRows] = useState<Event[]>(seed);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Event>({ id:'', title:'', date:'', time:'', location:'', crew:'' });
  const firstRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setDraft({ id: crypto.randomUUID(), title:'', date:'', time:'', location:'', crew:'' });
    setOpen(true);
    setTimeout(()=>firstRef.current?.focus(), 30);
  }
  function save() {
    setRows(prev => [draft, ...prev]);
    setOpen(false);
  }

  return (
    <RequireAuth>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ marginTop: 0, fontWeight: 900 }}>Scheduling</h1>
        <button onClick={openNew} style={btnPrimary}>➕ New event</button>
      </div>

      <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ background:'#f7f8fc' }}>
            <tr>
              {['Title','Date','Time','Location','Crew'].map(h=>
                <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:'#6b7280', textTransform:'uppercase' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ borderTop:'1px solid #f0f2f7' }}>
                <td style={{ padding:'12px 16px' }}>{r.title}</td>
                <td style={{ padding:'12px 16px' }}>{new Date(r.date).toLocaleDateString()}</td>
                <td style={{ padding:'12px 16px' }}>{r.time}</td>
                <td style={{ padding:'12px 16px' }}>{r.location}</td>
                <td style={{ padding:'12px 16px' }}>{r.crew}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {open && (
        <div role="dialog" aria-modal="true" style={overlay} onClick={()=>setOpen(false)}>
          <div style={sheet} onClick={e=>e.stopPropagation()}>
            <h2 style={{ margin:0, fontWeight:900 }}>New Event</h2>
            <label style={label}>Title
              <input ref={firstRef} value={draft.title} onChange={(e)=>setDraft(d=>({ ...d, title:e.target.value }))} style={input} />
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <label style={label}>Date
                <input type="date" value={draft.date} onChange={(e)=>setDraft(d=>({ ...d, date:e.target.value }))} style={input} />
              </label>
              <label style={label}>Time
                <input type="time" value={draft.time} onChange={(e)=>setDraft(d=>({ ...d, time:e.target.value }))} style={input} />
              </label>
            </div>
            <label style={label}>Location
              <input value={draft.location} onChange={(e)=>setDraft(d=>({ ...d, location:e.target.value }))} style={input} />
            </label>
            <label style={label}>Crew
              <input value={draft.crew} onChange={(e)=>setDraft(d=>({ ...d, crew:e.target.value }))} style={input} />
            </label>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setOpen(false)} style={btnSecondary}>Cancel</button>
              <button onClick={save} style={btnPrimary}>Save</button>
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}

const input:React.CSSProperties = { height:44, padding:'0 14px', border:'1px solid #d8dce6', borderRadius:12, fontSize:16 };
const label:React.CSSProperties = { display:'grid', gap:6, fontWeight:700 };
const btnBase:React.CSSProperties = { height:44, padding:'0 16px', borderRadius:12, border:'1px solid transparent', fontWeight:900, cursor:'pointer' };
const btnPrimary:React.CSSProperties = { ...btnBase, background:'#111827', color:'#fff', borderColor:'#111827' };
const btnSecondary:React.CSSProperties = { ...btnBase, background:'#fff', borderColor:'#e5e7eb' };
const overlay:React.CSSProperties = { position:'fixed', inset:0, background:'rgba(17,24,39,.28)', display:'grid', placeItems:'center', padding:16, zIndex:50 };
const sheet:React.CSSProperties   = { width:'100%', maxWidth:520, background:'#fff', borderRadius:16, padding:20, boxShadow:'0 20px 50px rgba(0,0,0,.25)', display:'grid', gap:12 };
