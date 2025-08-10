'use client';
export const dynamic = 'force-dynamic';

import RequireAuth from '../components/RequireAuth';
import { CATEGORIES, Client, Editor, Task } from '../lib/types';
import { Store } from '../lib/store';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const th: React.CSSProperties = { textAlign:'left', padding:10 };
const td: React.CSSProperties = { padding:10, borderTop:'1px solid #edf0f6' };

function firstDayMonth(d=new Date()){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function lastDayMonth(d=new Date()){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function isSameMonth(a:string){ const d=new Date(a); const now=new Date(); return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth(); }
function workingDaysInMonth(d=new Date()){
  const start = firstDayMonth(d), end = lastDayMonth(d);
  let n=0; const cur = new Date(start);
  while(cur<=end){ const day=cur.getDay(); if(day!==0 && day!==6) n++; cur.setDate(cur.getDate()+1); }
  return n;
}

export default function ReportsPage(){
  const clients: Client[] = Store.getClients();
  const editors: Editor[] = Store.getEditors();
  const tasks: Task[] = Store.getTasks();

  // Client progress
  const clientDoneThisMonth: Record<string, number> = {};
  tasks.forEach(t => { if(t.doneAt && isSameMonth(t.doneAt) && t.clientId) clientDoneThisMonth[t.clientId]=(clientDoneThisMonth[t.clientId]||0)+1; });

  // Editor utilization
  const workdays = workingDaysInMonth();
  const editorCapacityMonth: Record<string, number> = {};
  editors.forEach(e => {
    const daily = CATEGORIES.reduce((s,c)=>s + (e.dailyCapacity[c]||0), 0);
    editorCapacityMonth[e.id] = daily * workdays;
  });
  const editorDoneThisMonth: Record<string, number> = {};
  tasks.forEach(t => { if(t.doneAt && isSameMonth(t.doneAt) && t.assigneeId) editorDoneThisMonth[t.assigneeId]=(editorDoneThisMonth[t.assigneeId]||0)+1; });

  return (
    <RequireAuth>
      <main style={{ padding:24, display:'grid', gap:16 }}>
        <h1 style={{ margin:0 }}>Reports</h1>

        <section style={card}>
          <h2 style={{ margin:'0 0 4px' }}>Client Progress (This Month)</h2>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>
              <th style={th}>Client</th>
              <th style={{...th, textAlign:'right'}}>Done</th>
              {CATEGORIES.map(cat => <th key={cat} style={{...th, textAlign:'right'}}>{cat} Target</th>)}
              <th style={{...th, textAlign:'right'}}>Total Target</th>
              <th style={{...th, textAlign:'right'}}>Progress</th>
            </tr></thead>
            <tbody>
              {clients.map(cl=>{
                const done = clientDoneThisMonth[cl.id]||0;
                const totalTarget = CATEGORIES.reduce((s,c)=>s+(cl.targets[c]||0),0);
                const pct = totalTarget ? Math.min(100, Math.round(done*100/totalTarget)) : 0;
                return (
                  <tr key={cl.id}>
                    <td style={td}>{cl.name}</td>
                    <td style={{...td, textAlign:'right', fontWeight:700}}>{done}</td>
                    {CATEGORIES.map(cat => <td key={cat} style={{...td, textAlign:'right'}}>{cl.targets[cat]||0}</td>)}
                    <td style={{...td, textAlign:'right', fontWeight:700}}>{totalTarget}</td>
                    <td style={{...td, textAlign:'right'}}>
                      <div style={{ display:'inline-block', width:160, background:'#eef2f7', borderRadius:999, overflow:'hidden', verticalAlign:'middle' }}>
                        <div style={{ width:`${pct}%`, height:8, background:'#111827' }} />
                      </div>
                      <span style={{ marginLeft:8, fontWeight:700 }}>{pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section style={card}>
          <h2 style={{ margin:'0 0 4px' }}>Editor Utilization (This Month)</h2>
          <div style={{ fontSize:12, color:'#6b7280' }}>Working days counted: {workdays}</div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>
              <th style={th}>Editor</th>
              <th style={{...th, textAlign:'right'}}>Done</th>
              <th style={{...th, textAlign:'right'}}>Capacity</th>
              <th style={{...th, textAlign:'right'}}>Utilization</th>
            </tr></thead>
            <tbody>
              {editors.map(ed=>{
                const done = editorDoneThisMonth[ed.id]||0;
                const cap  = editorCapacityMonth[ed.id]||0;
                const pct = cap ? Math.min(100, Math.round(done*100/cap)) : 0;
                return (
                  <tr key={ed.id}>
                    <td style={td}>{ed.name}</td>
                    <td style={{...td, textAlign:'right', fontWeight:700}}>{done}</td>
                    <td style={{...td, textAlign:'right'}}>{cap}</td>
                    <td style={{...td, textAlign:'right'}}>
                      <div style={{ display:'inline-block', width:160, background:'#eef2f7', borderRadius:999, overflow:'hidden', verticalAlign:'middle' }}>
                        <div style={{ width:`${pct}%`, height:8, background:'#10b981' }} />
                      </div>
                      <span style={{ marginLeft:8, fontWeight:700 }}>{pct}%</span>
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
