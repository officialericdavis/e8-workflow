'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Task = {
  id: string;
  title: string;
  assignee?: string;
  due?: string;     // ISO date
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  status?: 'Open' | 'In Progress' | 'Blocked' | 'Done';
};

const emptyTask: Task = { id: '', title: '', assignee: '', due: '', priority: 'Medium', status: 'Open' };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Task>(emptyTask);
  const titleRef = useRef<HTMLInputElement>(null);

  // load/save to localStorage so it feels real
  useEffect(() => {
    try { const raw = localStorage.getItem('e8_tasks'); if (raw) setTasks(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('e8_tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const canSave = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  function startNew() {
    setDraft({ ...emptyTask, id: crypto.randomUUID() });
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 30);
  }

  function save() {
    if (!canSave) return;
    setTasks(prev => [draft, ...prev]);
    setOpen(false);
    setDraft(emptyTask);
  }

  function cancel() {
    setOpen(false);
    setDraft(emptyTask);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Tasks</h1>
        <button onClick={startNew} style={btnPrimary}>➕ New Task</button>
      </header>

      <section style={{ background: '#fff', border: '1px solid #edf0f6', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f7f8fc' }}>
            <tr>
              {['Title', 'Assignee', 'Due', 'Priority', 'Status'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No tasks yet. Tap <b>New Task</b> to create your first one.</td></tr>
            ) : tasks.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid #f0f2f7' }}>
                <td style={td}>{t.title}</td>
                <td style={td}>{t.assignee || '—'}</td>
                <td style={td}>{t.due ? new Date(t.due).toLocaleDateString() : '—'}</td>
                <td style={td}>{t.priority}</td>
                <td style={td}>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      {open && (
        <div role="dialog" aria-modal="true" style={overlay} onClick={cancel}>
          <div style={sheet} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>New Task</h2>

            <label style={label}>
              Title <span style={{ color: '#ef4444' }}>*</span>
              <input ref={titleRef} value={draft.title} onChange={(e)=>setDraft(d=>({ ...d, title: e.target.value }))} style={input} placeholder="What needs to be done?" />
            </label>

            <label style={label}>
              Assignee
              <input value={draft.assignee} onChange={(e)=>setDraft(d=>({ ...d, assignee: e.target.value }))} style={input} placeholder="Person responsible" />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={label}>
                Due date
                <input type="date" value={draft.due || ''} onChange={(e)=>setDraft(d=>({ ...d, due: e.target.value }))} style={input} />
              </label>

              <label style={label}>
                Priority
                <select value={draft.priority} onChange={(e)=>setDraft(d=>({ ...d, priority: e.target.value as Task['priority'] }))} style={input}>
                  {['Low','Medium','High','Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>

            <label style={label}>
              Status
              <select value={draft.status} onChange={(e)=>setDraft(d=>({ ...d, status: e.target.value as Task['status'] }))} style={input}>
                {['Open','In Progress','Blocked','Done'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={cancel} style={btnSecondary}>Cancel</button>
              <button onClick={save} disabled={!canSave} style={{ ...btnPrimary, opacity: canSave ? 1 : .6, cursor: canSave ? 'pointer' : 'not-allowed' }}>Save Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', padding: '14px 16px', fontSize: 12, textTransform: 'uppercase', letterSpacing: .4, color: '#6b7280' };
const td: React.CSSProperties = { padding: '14px 16px', fontSize: 15, color: '#111827' };

const input: React.CSSProperties = { height: 48, padding: '0 14px', border: '1px solid #d8dce6', borderRadius: 12, fontSize: 16, outline: 'none' };
const label: React.CSSProperties = { display: 'grid', gap: 6, fontWeight: 700 };

const btnBase: React.CSSProperties = { height: 48, padding: '0 16px', borderRadius: 12, border: '1px solid transparent', fontWeight: 900, cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { ...btnBase, background: '#111827', color: '#fff' };
const btnSecondary: React.CSSProperties = { ...btnBase, background: '#fff', borderColor: '#e5e7eb' };

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, .28)', display: 'grid', placeItems: 'center', padding: 16, zIndex: 50 };
const sheet: React.CSSProperties = { width: '100%', maxWidth: 520, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 20px 50px rgba(0,0,0,.25)', display: 'grid', gap: 12 };
