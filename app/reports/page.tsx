'use client';
import * as React from 'react';
import RequireAuth from '../components/RequireAuth';
import { loadLS } from '../lib/retention';

type Client = { id:string; name:string; monthlyTarget:number; active:boolean; };
type Task = { id:string; title:string; client?:string; assignee?:string; due?:string; status?:'Open'|'In Progress'|'Blocked'|'Done'; completedAt?:number; createdAt:number; };
type Editor = { id:string; name:string; dailyCapacity:number; active:boolean; };

const CLIENTS_KEY = 'e8_clients';
const TASKS_KEY = 'e8_tasks';
const EDITORS_KEY = 'e8_editors';

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getTime();
const startOfNextMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth()+1, 1).getTime();
const isInMonth = (ts: number|undefined|null, now = new Date()) =>
  typeof ts === 'number' && ts >= startOfMonth(now) && ts < startOfNextMonth(now);

export default function Reports() {
  const clients = loadLS<Client[]>(CLIENTS_KEY, [], false);
  const tasks   = loadLS<Task[]>(TASKS_KEY, [], true);
  const editors = loadLS<Editor[]>(EDITORS_KEY, [], false);

  const now = new Date();
  const byClient = groupByClient(clients, tasks, now);
  const byEditorToday = groupByEditorToday(editors, tasks, now);

  const totalTarget = byClient.reduce((s,c)=>s + c.target, 0);
  const totalDone   = byClient.reduce((s,c)=>s + c.done, 0);

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Reports</h1>

        <section style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          <Kpi title="Clients with Targets" value={clients.filter(c=>c.active && c.monthlyTarget>0).length.toString()} />
          <Kpi title="Month Deliverables (Done)" value={totalDone.toString()} />
          <Kpi title="Target vs Actual" value={`${totalDone} / ${totalTarget}`} />
        </section>

        <section style={card}>
          <h2 style={{ margin:'0 0 4px' }}>Client Progress (This Month)</h2>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={th}>Client</th><th style={th}>Done</th><th style={th}>Target</th><th style={th}>Progress</th></tr></thead>
            <tbody>
              {byClient.map(row => (
                <tr key={row.name} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}>{row.name}</td>
                  <td style={td}>{row.done}</td>
                  <td style={td}>{row.target}</td>
                  <td style={{ ...td, width:260 }}><Bar pct={row.target>0 ? Math.min(100, Math.round(100*row.done/row.target)) : 0} /></td>
                </tr>
              ))}
              {byClient.length === 0 && <tr><td colSpan={4} style={{...td,color:'#6b7280'}}>No clients/targets yet.</td></tr>}
            </tbody>
          </table>
        </section>

        <section style={card}>
          <h2 style={{ margin:'0 0 4px' }}>Editor Utilization (Today)</h2>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={th}>Editor</th><th style={th}>Done Today</th><th style={th}>Capacity</th><th style={th}>Utilization</th></tr></thead>
            <tbody>
              {byEditorToday.map(e => (
                <tr key={e.name} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}>{e.name}</td>
                  <td style={td}>{e.done}</td>
                  <td style={td}>{e.capacity}</td>
                  <td style={{ ...td, width:260 }}><Bar pct={e.capacity>0 ? Math.min(100, Math.round(100*e.done/e.capacity)) : 0} /></td>
                </tr>
              ))}
              {byEditorToday.length === 0 && <tr><td colSpan={4} style={{...td,color:'#6b7280'}}>No editor completions today.</td></tr>}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}

function groupByClient(clients: Client[], tasks: Task[], now: Date) {
  const map = new Map<string,{ name:string; target:number; done:number }>();
  for (const c of clients) map.set(c.name, { name:c.name, target: c.active ? c.monthlyTarget : 0, done:0 });
  for (const t of tasks) {
    const completedInMonth = isInMonth(t.completedAt, now);
    const dueTs = t.due ? new Date(t.due).getTime() : undefined;
    const dueInMonth = isInMonth(dueTs, now);
    if (t.status === 'Done' && (completedInMonth || dueInMonth)) {
      const key = t.client || 'Unassigned';
      if (!map.has(key)) map.set(key, { name:key, target:0, done:0 });
      map.get(key)!.done += 1;
    }
  }
  return Array.from(map.values()).sort((a,b)=>a.name.localeCompare(b.name));
}

function groupByEditorToday(editors: Editor[], tasks: Task[], now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + 24*60*60*1000;
  const capMap = new Map<string,number>();
  for (const e of editors) if (e.active) capMap.set(e.name, e.dailyCapacity);

  const doneCount = new Map<string,number>();
  for (const t of tasks) {
    const ts = t.completedAt ?? 0;
    if (t.status === 'Done' && ts >= start && ts < end) {
      const who = t.assignee || 'Unassigned';
      doneCount.set(who, (doneCount.get(who)||0) + 1);
      if (!capMap.has(who)) capMap.set(who, 5);
    }
  }

  const rows: { name:string; done:number; capacity:number }[] = [];
  for (const [name, capacity] of capMap.entries()) rows.push({ name, capacity, done: doneCount.get(name)||0 });
  return rows.sort((a,b)=>a.name.localeCompare(b.name));
}

function Bar({ pct }: { pct:number }) {
  return (
    <div style={{ height:12, background:'#edf0f6', borderRadius:999, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${pct}%`, background:'#111827' }} />
    </div>
  );
}

function Kpi({ title, value }: { title:string; value:string }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16 }}>
      <div style={{ fontSize:12, color:'#6b7280' }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:900 }}>{value}</div>
    </div>
  );
}

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const th: React.CSSProperties   = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties   = { padding:'10px' };
