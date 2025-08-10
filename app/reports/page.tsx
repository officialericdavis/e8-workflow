'use client';

import { useEffect, useMemo, useState } from 'react';

type Task = { id:string; title:string; assignee?:string; due?:string; priority?:'Low'|'Medium'|'High'|'Urgent'; status?:'Open'|'In Progress'|'Blocked'|'Done' };
const KEY = 'e8_tasks';

export default function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(()=>{ try{ const raw = localStorage.getItem(KEY); if(raw) setTasks(JSON.parse(raw)); }catch{} },[]);
  const totals = useMemo(()=>{
    const total = tasks.length;
    const done = tasks.filter(t=>t.status==='Done').length;
    const urgent = tasks.filter(t=>t.priority==='Urgent').length;
    const ontime = Math.round((done / Math.max(1,total)) * 100);
    return { total, done, urgent, ontime };
  },[tasks]);

  const byStatus = useMemo(()=>{
    const order = ['Open','In Progress','Blocked','Done'] as const;
    return order.map(key=>({ key, value: tasks.filter(t=>t.status===key).length }));
  },[tasks]);

  const byWeek = useMemo(()=>{
    // fake weekly completions (or derive from due dates if present)
    const w = [7,12,9,15,11,18,13];
    return w;
  },[]);

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h1 style={{ margin:0, fontSize:28, fontWeight:900 }}>Reports</h1>

      {/* KPI cards */}
      <section style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <Card label="Total Tasks" value={String(totals.total||0)} />
        <Card label="Completed" value={String(totals.done||0)} />
        <Card label="On-time %" value={`${totals.ontime}%`} />
        <Card label="Urgent" value={String(totals.urgent||0)} />
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {/* Bar chart */}
        <div style={panel}>
          <h3 style={h3}>Tasks by Status</h3>
          <div style={{ display:'flex', alignItems:'flex-end', gap:16, height:180, padding:10 }}>
            {byStatus.map(s=>{
              const max = Math.max(1, ...byStatus.map(x=>x.value));
              const h = (s.value / max) * 140 + 10;
              return (
                <div key={s.key} style={{ display:'grid', gap:6, justifyItems:'center' }}>
                  <div style={{ width:40, height:h, borderRadius:10, background: barColor(s.key) }} />
                  <div style={{ fontSize:12, color:'#6b7280', fontWeight:800 }}>{s.key}</div>
                  <div style={{ fontSize:12, fontWeight:900 }}>{s.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line chart */}
        <div style={panel}>
          <h3 style={h3}>Completions (last 7 weeks)</h3>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width:'100%', height:200, background:'#f9fafb', borderRadius:12 }}>
            <polyline
              fill="none"
              stroke="#111827"
              strokeWidth="2"
              points={polylinePoints(byWeek)}
            />
          </svg>
        </div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label:string; value:string }) {
  return (
    <div style={card}>
      <div style={cardLabel}>{label}</div>
      <div style={cardValue}>{value}</div>
    </div>
  );
}

function barColor(key:string){
  if (key==='Done') return '#059669';
  if (key==='In Progress') return '#155e75';
  if (key==='Blocked') return '#92400e';
  return '#111827';
}

function polylinePoints(values:number[]){
  const max = Math.max(...values, 1);
  const step = 100 / (values.length-1);
  return values.map((v,i)=>{
    const x = i * step;
    const y = 40 - (v / max) * 35 - 2;
    return `${x},${y}`;
  }).join(' ');
}

const panel:React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:14 };
const card:React.CSSProperties  = { background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:14, display:'grid', gap:6 };
const cardLabel:React.CSSProperties = { color:'#6b7280', fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:.4 };
const cardValue:React.CSSProperties = { fontWeight:900, fontSize:28 };
const h3:React.CSSProperties = { margin:'2px 0 10px 0', fontSize:16, fontWeight:900 };
