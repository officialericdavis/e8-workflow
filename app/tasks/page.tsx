'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import RequireAuth from '../components/RequireAuth';
import { CATEGORIES, Client, Status, Task } from '../lib/types';
import { Store } from '../lib/store';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };

const empty: Task = {
  id: '',
  title: '',
  category: 'Short Form',
  status: 'Open',
  createdAt: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Task>(empty);
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterCat, setFilterCat] = useState<string>('');

  useEffect(() => {
    setTasks(Store.getTasks());
    setClients(Store.getClients());
  }, []);

  const view = useMemo(() => {
    return tasks.filter(t =>
      (!filterClient || t.clientId === filterClient) &&
      (!filterCat || t.category === filterCat)
    );
  }, [tasks, filterClient, filterCat]);

  function saveAll(next: Task[]) { setTasks(next); Store.setTasks(next); }

  function openNew() {
    setDraft({ ...empty, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    setOpen(true);
  }

  function saveDraft() {
    if (!draft.title.trim()) return alert('Title required');
    const next = [draft, ...tasks];
    saveAll(next);
    setOpen(false);
  }

  function update(id: string, patch: Partial<Task>) {
    const next = tasks.map(t => t.id === id ? { ...t, ...patch } : t);
    saveAll(next);
  }

  function nextStatus(s: Status): Status {
    if (s === 'Open') return 'In Progress';
    if (s === 'In Progress') return 'Blocked';
    if (s === 'Blocked') return 'Done';
    return 'Open';
  }

  function toggleStatus(t: Task) {
    const ns = nextStatus(t.status);
    update(t.id, { status: ns, doneAt: ns === 'Done' ? new Date().toISOString() : t.doneAt && undefined });
  }

  function remove(id: string) {
    if (!confirm('Delete task?')) return;
    saveAll(tasks.filter(t => t.id !== id));
  }

  return (
    <RequireAuth>
      <main style={{ padding: 24, display:'grid', gap:16 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <h1 style={{ margin:0, flex:1 }}>Tasks</h1>
          <select value={filterClient} onChange={e=>setFilterClient(e.target.value)} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;">
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={openNew} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #dfe4ee', background:'#111827', color:'#fff' }}>New Task</button>
        </div>

        <section style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:10 }}>Title</th>
                <th style={{ textAlign:'left', padding:10 }}>Client</th>
                <th style={{ textAlign:'left', padding:10 }}>Category</th>
                <th style={{ textAlign:'left', padding:10 }}>Status</th>
                <th style={{ textAlign:'left', padding:10 }}>Due</th>
                <th style={{ width:1 }} />
              </tr>
            </thead>
            <tbody>
              {view.map(t => {
                const client = clients.find(c => c.id === t.clientId)?.name ?? '—';
                return (
                  <tr key={t.id} style={{ borderTop:'1px solid #edf0f6' }}>
                    <td style={{ padding:10 }}>
                      <input value={t.title} onChange={e=>update(t.id,{ title:e.target.value })} style="width:100%;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;" />
                    </td>
                    <td style={{ padding:10 }}>
                      <select value={t.clientId ?? ''} onChange={e=>update(t.id,{ clientId: e.target.value || undefined })} style="padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;">
                        <option value="">—</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:10 }}>
                      <select value={t.category} onChange={e=>update(t.id,{ category: e.target.value as any })} style="padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:10 }}>
                      <button onClick={()=>toggleStatus(t)} style={{ padding:'6px 10px', border:'1px solid #dfe4ee', borderRadius:8, background:'#fff' }}>
                        {t.status}
                      </button>
                    </td>
                    <td style={{ padding:10 }}>
                      <input type="date" value={t.due ?? ''} onChange={e=>update(t.id,{ due: e.target.value })} style="padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;" />
                    </td>
                    <td style={{ padding:10 }}>
                      <button onClick={()=>remove(t.id)} style={{ padding:'6px 10px', border:'1px solid #f3d1d1', color:'#991b1b', borderRadius:8, background:'#fff' }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
              {view.length === 0 && (
                <tr><td colSpan={6} style={{ padding:20, textAlign:'center', color:'#6b7280' }}>No tasks</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {open && (
          <section style={card}>
            <h3 style={{ margin:0 }}>New Task</h3>
            <div style={{ display:'grid', gap:12 }}>
              <input placeholder="Title" value={draft.title} onChange={e=>setDraft({ ...draft, title:e.target.value })} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;" />
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <select value={draft.clientId ?? ''} onChange={e=>setDraft({ ...draft, clientId: e.target.value || undefined })} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;">
                  <option value="">— Select client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={draft.category} onChange={e=>setDraft({ ...draft, category: e.target.value as any })} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="date" value={draft.due ?? ''} onChange={e=>setDraft({ ...draft, due:e.target.value })} style="padding:8px;border:1px solid #dfe4ee;border-radius:10px;" />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={saveDraft} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #dfe4ee', background:'#111827', color:'#fff' }}>Save</button>
                <button onClick={()=>setOpen(false)} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff' }}>Cancel</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </RequireAuth>
  );
}
