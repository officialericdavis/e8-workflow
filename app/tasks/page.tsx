'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RequireAuth from '../components/RequireAuth';
import { useToast } from '../components/Toasts';

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
type Status = 'Open' | 'In Progress' | 'Blocked' | 'Done';
type Task = {
  id: string;
  title: string;
  assignee?: string;
  due?: string;
  priority?: Priority;
  status?: Status;
};

const emptyTask: Task = { id: '', title: '', assignee: '', due: '', priority: 'Medium', status: 'Open' };
const KEY = 'e8_tasks';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Task>(emptyTask);
  const [query, setQuery] = useState('');
  const [selP, setSelP] = useState<Set<Priority>>(new Set());
  const [selS, setSelS] = useState<Set<Status>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const search = useSearchParams();
  const { show } = useToast();

  // load/save local tasks
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) setTasks(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {} }, [tasks]);

  // deep-link /tasks?new=1
  useEffect(() => {
    if (search.get('new') === '1' && !open) {
      setDraft({ ...emptyTask, id: crypto.randomUUID() });
      setOpen(true);
      setTimeout(() => titleRef.current?.focus(), 30);
    }
  }, [search, open]);

  const canSave = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  function startNew() {
    setDraft({ ...emptyTask, id: crypto.randomUUID() });
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 30);
  }
  function cancel() { setOpen(false); setDraft(emptyTask); }
  function save() {
    if (!canSave) return;
    setTasks(prev => {
      const i = prev.findIndex(t => t.id === draft.id);
      if (i >= 0) { const copy = [...prev]; copy[i] = draft; return copy; }
      return [draft, ...prev];
    });
    setOpen(false);
    setDraft(emptyTask);
    show('Task saved', 'success');
  }
  function remove() {
    setTasks(prev => prev.filter(x => x.id !== draft.id));
    cancel();
    show('Task deleted', 'error');
  }

  // filters
  const filtered = useMemo(() => {
    const qp = query.trim().toLowerCase();
    return tasks.filter(t => {
      const matchQ = !qp || t.title.toLowerCase().includes(qp) || (t.assignee||'').toLowerCase().includes(qp);
      const matchP = selP.size === 0 || selP.has((t.priority||'Medium'));
      const matchS = selS.size === 0 || selS.has((t.status||'Open'));
      return matchQ && matchP && matchS;
    });
  }, [tasks, query, selP, selS]);

  // dnd reorder
  function onDrop(overId: string) {
    if (!dragId || dragId === overId) return;
    const from = tasks.findIndex(t => t.id === dragId);
    const to = tasks.findIndex(t => t.id === overId);
    if (from < 0 || to < 0) return;
    const copy = [...tasks];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setTasks(copy);
    setDragId(null);
    show('Reordered', 'info');
  }

  return (
    <RequireAuth>
      <div style={{ display: 'grid', gap: 16 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Tasks</h1>
          <button onClick={startNew} style={btnPrimary}>➕ New Task</button>
        </header>

        {/* Filters */}
        <div style={{ display:'flex', flexWrap:'wrap', gap: 10, alignItems:'center' }}>
          <input placeholder="Search tasks, assignee…" value={query}
                 onChange={(e)=>setQuery(e.target.value)} style={input}/>
          <Chips title="Priority" values={['Low','Medium','High','Urgent']} selected={selP}
                 onToggle={(v)=>setSelP(s=>toggleSet(s, v as Priority))}/>
          <Chips title="Status" values={['Open','In Progress','Blocked','Done']} selected={selS}
                 onToggle={(v)=>setSelS(s=>toggleSet(s, v as Status))}/>
          {(selP.size>0 || selS.size>0 || query) && (
            <button onClick={()=>{setQuery('');setSelP(new Set());setSelS(new Set());}}
                    style={btnSecondary}>Clear</button>
          )}
        </div>

        {/* Table */}
        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#f7f8fc' }}>
              <tr>
                {['Title','Assignee','Due','Priority','Status'].map(h=> <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 20, textAlign:'center', color:'#6b7280' }}>No matching tasks.</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id}
                    draggable
                    onDragStart={()=>setDragId(t.id)}
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={()=>onDrop(t.id)}
                    onClick={()=>{ setDraft(t); setOpen(true); }}
                    style={{ borderTop:'1px solid #f0f2f7', cursor:'grab' }}>
                  <td style={td}>{t.title}</td>
                  <td style={td}>{t.assignee || '—'}</td>
                  <td style={td}>{t.due ? new Date(t.due).toLocaleDateString() : '—'}</td>
                  <td style={td}><Badge kind="priority" value={t.priority||'Medium'} /></td>
                  <td style={td}><Badge kind="status" value={t.status||'Open'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal */}
        {open && (
          <div role="dialog" aria-modal="true" style={overlay} onClick={cancel}>
            <div style={sheet} onClick={(e)=>e.stopPropagation()}>
              <h2 style={{ margin:0, fontSize:22, fontWeight:900 }}>{tasks.some(x=>x.id===draft.id)?'Edit Task':'New Task'}</h2>

              <label style={label}>
                Title <span style={{ color:'#ef4444' }}>*</span>
                <input ref={titleRef} value={draft.title} onChange={(e)=>setDraft(d=>({ ...d, title: e.target.value }))} style={input} placeholder="What needs to be done?" />
              </label>

              <label style={label}>
                Assignee
                <input value={draft.assignee} onChange={(e)=>setDraft(d=>({ ...d, assignee: e.target.value }))} style={input} placeholder="Person responsible" />
              </label>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <label style={label}>
                  Due date
                  <input type="date" value={draft.due || ''} onChange={(e)=>setDraft(d=>({ ...d, due: e.target.value }))} style={input}/>
                </label>
                <label style={label}>
                  Priority
                  <select value={draft.priority} onChange={(e)=>setDraft(d=>({ ...d, priority: e.target.value as Priority }))} style={input}>
                    {['Low','Medium','High','Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
              </div>

              <label style={label}>
                Status
                <select value={draft.status} onChange={(e)=>setDraft(d=>({ ...d, status: e.target.value as Status }))} style={input}>
                  {['Open','In Progress','Blocked','Done'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <div style={{ display:'flex', gap:10, justifyContent:'space-between', marginTop:10 }}>
                <button onClick={remove} style={{ ...btnSecondary, borderColor:'#ef4444', color:'#ef4444' }}>Delete</button>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={cancel} style={btnSecondary}>Cancel</button>
                  <button onClick={save} disabled={!canSave} style={{ ...btnPrimary, opacity: canSave?1:.6, cursor: canSave?'pointer':'not-allowed' }}>Save Task</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

// ---- UI helpers ----
function toggleSet<T>(s: Set<T>, v: T) {
  const next = new Set(s);
  if (next.has(v)) next.delete(v); else next.add(v);
  return next;
}

function Badge({ kind, value }: { kind:'priority'|'status'; value: string }) {
  const styles: Record<string, React.CSSProperties> = {
    base: { display:'inline-flex', alignItems:'center', height:26, padding:'0 10px', borderRadius:999, fontWeight:800, fontSize:12 },
    Low:    { background:'#eef6ff', color:'#1e3a8a' },
    Medium: { background:'#f5f3ff', color:'#5b21b6' },
    High:   { background:'#fff1f2', color:'#be123c' },
    Urgent: { background:'#fee2e2', color:'#991b1b' },
    Open:         { background:'#f3f4f6', color:'#111827' },
    'In Progress':{ background:'#ecfeff', color:'#155e75' },
    Blocked:      { background:'#fef3c7', color:'#92400e' },
    Done:         { background:'#ecfdf5', color:'#065f46' },
  };
  return <span style={{ ...(styles.base), ...(styles[value]||{}) }}>{value}</span>;
}

function Chips({ title, values, selected, onToggle }:{
  title:string; values:string[]; selected:Set<string>; onToggle:(v:string)=>void;
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontWeight:800, color:'#6b7280', fontSize:12, textTransform:'uppercase' }}>{title}:</span>
      {values.map(v=>{
        const active = selected.has(v);
        return (
          <button key={v}
                  onClick={()=>onToggle(v)}
                  style={{
                    height:36, padding:'0 12px', borderRadius:999, fontWeight:900, cursor:'pointer',
                    border: active? '1px solid #111827' : '1px solid #e5e7eb',
                    background: active? '#111827' : '#fff', color: active? '#fff' : '#111827'
                  }}>
            {v}
          </button>
        );
      })}
    </div>
  );
}

const th:React.CSSProperties = { textAlign:'left', padding:'12px 16px', fontSize:12, textTransform:'uppercase', letterSpacing:.3, color:'#6b7280' };
const td:React.CSSProperties = { padding:'14px 16px', fontSize:15, color:'#111827' };

const input:React.CSSProperties = { height:44, padding:'0 14px', border:'1px solid #d8dce6', borderRadius:12, fontSize:16, outline:'none' };
const label:React.CSSProperties = { display:'grid', gap:6, fontWeight:700 };

const btnBase:React.CSSProperties = { height:44, padding:'0 16px', borderRadius:12, border:'1px solid transparent', fontWeight:900, cursor:'pointer' };
const btnPrimary:React.CSSProperties = { ...btnBase, background:'#111827', color:'#fff', borderColor:'#111827' };
const btnSecondary:React.CSSProperties = { ...btnBase, background:'#fff', borderColor:'#e5e7eb' };

const overlay:React.CSSProperties = { position:'fixed', inset:0, background:'rgba(17,24,39,.28)', display:'grid', placeItems:'center', padding:16, zIndex:50 };
const sheet:React.CSSProperties   = { width:'100%', maxWidth:520, background:'#fff', borderRadius:16, padding:20, boxShadow:'0 20px 50px rgba(0,0,0,.25)', display:'grid', gap:12 };
