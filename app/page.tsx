'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Task = { id:string; title:string; assignee?:string; due?:string; priority?:string; status?:string };

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem('e8_tasks'); if (raw) setTasks(JSON.parse(raw)); } catch {}
  }, []);

  return (
    <div style={{ display:'grid', gap:16 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontWeight:900, fontSize:14, color:'#6b7280' }}>
          E8 Productions / <span style={{ color:'#111827' }}>Workflow Manager</span>
        </div>
        <Link href="/tasks?new=1" style={btnPrimary}>➕ New Task</Link>
      </div>

      {/* Stats */}
      <section style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { label:'Open Tasks', value: String(tasks.filter(t=>t.status!=='Done').length || 0), sub:'—' },
          { label:'Awaiting QC', value: String(tasks.filter(t=>t.status==='Blocked').length || 0), sub:'—' },
          { label:'Scheduled', value: String(tasks.filter(t=>t.status==='In Progress').length || 0), sub:'—' },
          { label:'Payments', value:'$8,400', sub:'due Monday' },
        ].map(c => (
          <div key={c.label} style={card}>
            <div style={cardLabel}>{c.label}</div>
            <div style={cardValue}>{c.value}</div>
            <div style={cardSub}>{c.sub}</div>
          </div>
        ))}
      </section>

      {/* Active Tasks */}
      <section style={panel}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:900 }}>Active Tasks</h2>
          <input placeholder="Search tasks, people, clients"
                 style={input}
                 onChange={(e)=>{
                   const q = e.target.value.toLowerCase();
                   try {
                     const raw = localStorage.getItem('e8_tasks'); 
                     const all: Task[] = raw? JSON.parse(raw): [];
                     const f = all.filter(t =>
                       t.title.toLowerCase().includes(q) ||
                       (t.assignee||'').toLowerCase().includes(q));
                     setTasks(f);
                   } catch {}
                 }}
          />
        </div>

        <div style={{ marginTop:12, overflow:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#f7f8fc' }}>
              <tr>
                {['Title','Assignee','Due','Priority','Status'].map(h=>(
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tasks.length? tasks: sample).slice(0,6).map(t=>(
                <tr key={t.id} style={{ borderTop:'1px solid #f0f2f7' }}>
                  <td style={td}>{t.title}</td>
                  <td style={td}>{t.assignee || '—'}</td>
                  <td style={td}>{t.due ? new Date(t.due).toLocaleDateString() : '—'}</td>
                  <td style={td}>{t.priority || '—'}</td>
                  <td style={td}>{t.status || 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const sample: Task[] = [
  { id:'1', title:'Edit Street Interview — Miami Beach EP12', assignee:'Aishwarya M.', due:'2025-08-12', priority:'High', status:'Editing' },
  { id:'2', title:'QC — Casino UGC Reels (x4)', assignee:'Rahul K.', due:'2025-08-10', priority:'Medium', status:'QC' },
  { id:'3', title:'Schedule — YouTube Premiere EP23', assignee:'Luis G.', due:'2025-08-11', priority:'High', status:'Scheduling' },
  { id:'4', title:'Client Delivery — CLA Spotlight Cutdowns', assignee:'Neha P.', due:new Date().toISOString().slice(0,10), priority:'Low', status:'Delivery' },
];

const panel:React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:14 };
const input:React.CSSProperties = { height:44, padding:'0 14px', border:'1px solid #d8dce6', borderRadius:12, fontSize:16, outline:'none' };
const btnPrimary:React.CSSProperties = { display:'inline-flex', alignItems:'center', gap:8, height:44, padding:'0 16px', borderRadius:12, border:'1px solid #111827', background:'#111827', color:'#fff', textDecoration:'none', fontWeight:900 };
const card:React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:14, display:'grid', gap:6 };
const cardLabel:React.CSSProperties = { color:'#6b7280', fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:.4 };
const cardValue:React.CSSProperties = { fontWeight:900, fontSize:28 };
const cardSub:React.CSSProperties = { color:'#6b7280', fontSize:12 };
const th:React.CSSProperties = { textAlign:'left', padding:'12px 14px', fontSize:12, textTransform:'uppercase', letterSpacing:.3, color:'#6b7280' };
const td:React.CSSProperties = { padding:'14px 14px', fontSize:15, color:'#111827' };
