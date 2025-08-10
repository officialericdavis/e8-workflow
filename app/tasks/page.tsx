'use client';

import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { can } from '@/lib/roles';
import { useEffect, useMemo, useState } from 'react';
import { loadLS, saveLS, purgeByAge } from '@/lib/retention';

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
type Status = 'Open' | 'In Progress' | 'Blocked' | 'Done';
type Task = {
  id: string;
  title: string;
  client?: string;     // NEW
  assignee?: string;
  due?: string;
  priority?: Priority;
  status?: Status;
  createdAt: number;
};

const KEY = 'e8_tasks';
const empty: Task = { id:'', title:'', client:'', assignee:'', due:'', priority:'Medium', status:'Open', createdAt: Date.now() };

export default function TasksPage() {
  const { role } = useRole();
  const canRead = can(role, 'tasks:r');
  const canWrite = can(role, 'tasks:rw');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState<Task>(empty);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const initial = purgeByAge(loadLS<Task[]>(KEY, [], true));
    setTasks(initial);
  }, []);
  useEffect(() => { saveLS(KEY, tasks); }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = [...tasks].sort((a,b) => (a.due||'').localeCompare(b.due||''));
    if (!q) return base;
    return base.filter(t =>
      [t.title, t.client, t.assignee, t.priority, t.status].join(' ').toLowerCase().includes(q)
    );
  }, [tasks, query]);

  function addTask() {
    if (!canWrite) return;
    if (!draft.title.trim()) { alert('Title required'); return; }
    if (!draft.client?.trim()) { alert('Client required'); return; }
    const t: Task = { ...draft, id: crypto.randomUUID(), createdAt: Date.now() };
    setTasks(prev => [t, ...prev]);
    setDraft(empty);
    setOpen(false);
  }
  function remove(id: string) {
    if (!canWrite) return;
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  if (!canRead) return <RequireAuth><div /></RequireAuth>;

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h1 style={{ margin:0, fontWeight:900 }}>Tasks</h1>
          <div style={{ display:'flex', gap:8 }}>
            <input placeholder="Search by title, client, assignee…" value={query} onChange={e=>setQuery(e.target.value)} style={inp}/>
            <button disabled={!canWrite} onClick={()=>setOpen(true)} style={btnPrimary}>New Task</button>
          </div>
        </div>

        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Title</th>
                <th style={th}>Client</th>   {/* NEW */}
                <th style={th}>Assignee</th>
                <th style={th}>Due</th>
                <th style={th}>Priority</th>
                <th style={th}>Status</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}>{t.title}</td>
                  <td style={td}>{t.client || '-'}</td> {/* NEW */}
                  <td style={td}>{t.assignee || '-'}</td>
                  <td style={td}>{t.due || '-'}</td>
                  <td style={td}>{t.priority}</td>
                  <td style={td}>{t.status}</td>
                  <td style={{ ...td, textAlign:'right' }}>
                    {canWrite && <button onClick={()=>remove(t.id)} style={btnGhost}>Delete</button>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ ...td, color:'#6b7280' }}>No tasks (last 90 days).</td></tr>}
            </tbody>
          </table>
        </section>

        {open && (
          <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 }}>
            <h2 style={{ margin:0 }}>New Task</h2>
            <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 1fr' }}>
              <input placeholder="Title *" value={draft.title} onChange={e=>setDraft({...draft, title:e.target.value})} style={inp}/>
              <input placeholder="Client *" value={draft.client} onChange={e=>setDraft({...draft, client:e.target.value})} style={inp}/>
            </div>
            <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 160px 160px' }}>
              <input placeholder="Assignee" value={draft.assignee} onChange={e=>setDraft({...draft, assignee:e.target.value})} style={inp}/>
              <input type="date" value={draft.due} onChange={e=>setDraft({...draft, due:e.target.value})} style={inp}/>
              <select value={draft.priority} onChange={e=>setDraft({...draft, priority:e.target.value as any})} style={inp}>
                {['Low','Medium','High','Urgent'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <select value={draft.status} onChange={e=>setDraft({...draft, status:e.target.value as any})} style={inp}>
                {['Open','In Progress','Blocked','Done'].map(s => <option key={s}>{s}</option>)}
              </select>
              <div style={{ flex:1 }} />
              <button onClick={()=>setOpen(false)} style={btnGhost}>Cancel</button>
              <button disabled={!canWrite} onClick={addTask} style={btnPrimary}>Create</button>
            </div>
          </section>
        )}
      </main>
    </RequireAuth>
  );
}

const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties = { padding:'10px' };
const inp: React.CSSProperties = { height:40, border:'1px solid #e5e7eb', borderRadius:12, padding:'0 12px' };
const btnPrimary: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #111827', background:'#111827', color:'#fff' };
const btnGhost: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, border:'1px solid #e5e7eb', background:'#fff' };
