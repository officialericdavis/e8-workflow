'use client';

import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { can } from '@/lib/roles';
import { useEffect, useMemo, useState } from 'react';
import { loadLS, saveLS, purgeByAge } from '@/lib/retention';

type Item = {
  id: string;
  title: string;
  date?: string;       // YYYY-MM-DD
  start?: string;      // HH:mm
  end?: string;        // HH:mm
  notes?: string;
  createdAt: number;   // for retention
};

const KEY = 'e8_sched';

export default function SchedulingPage() {
  const { role } = useRole();
  const canRead = can(role, 'schedule:r');
  const canWrite = can(role, 'schedule:rw');

  const [items, setItems] = useState<Item[]>([]);
  // new item inputs
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  // inline edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const initial = purgeByAge(loadLS<Item[]>(KEY, [], true));
    setItems(initial);
  }, []);

  useEffect(() => { saveLS(KEY, items); }, [items]);

  const sorted = useMemo(() => {
    return [...items].sort((a,b) => (a.date||'').localeCompare(b.date||'') || (a.start||'').localeCompare(b.start||''));
  }, [items]);

  function addItem() {
    if (!canWrite) return;
    if (!title.trim()) { alert('Please enter a title'); return; }
    const it: Item = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date, start, end, notes,
      createdAt: Date.now(),
    };
    setItems(prev => [it, ...prev]);
    setTitle(''); setDate(''); setStart(''); setEnd(''); setNotes('');
  }

  function startEdit(id: string, current: string) {
    if (!canWrite) return;
    setEditId(id);
    setEditTitle(current);
  }

  function saveEdit() {
    if (!canWrite || !editId) return;
    const t = editTitle.trim();
    if (!t) { alert('Title is required'); return; }
    setItems(prev => prev.map(i => i.id === editId ? { ...i, title: t } : i));
    setEditId(null);
    setEditTitle('');
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle('');
  }

  function remove(id: string) {
    if (!canWrite) return;
    setItems(prev => prev.filter(i => i.id !== id));
  }

  if (!canRead) return <RequireAuth><div /></RequireAuth>;

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Scheduling</h1>

        {/* Creator */}
        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12, opacity: canWrite ? 1 : .55 }}>
          <h2 style={{ margin:0 }}>New Item</h2>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 160px 120px 120px', alignItems:'center' }}>
            <input placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} style={inp} />
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp} />
            <input type="time" value={start} onChange={e=>setStart(e.target.value)} style={inp} />
            <input type="time" value={end} onChange={e=>setEnd(e.target.value)} style={inp} />
          </div>
          <textarea placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} style={{ ...inp, minHeight:90 }} />
          <div>
            <button disabled={!canWrite} onClick={addItem} style={btnPrimary}>Add to schedule</button>
          </div>
          {!canWrite && <div style={{ color:'#6b7280', fontSize:12 }}>View only — your role cannot create schedule items.</div>}
        </section>

        {/* List */}
        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:8 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Title</th>
                <th style={th}>Date</th>
                <th style={th}>Start</th>
                <th style={th}>End</th>
                <th style={th}>Notes</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(i => {
                const editing = i.id === editId;
                return (
                  <tr key={i.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                    <td style={td}>
                      {editing ? (
                        <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{ ...inp, height:32 }} />
                      ) : i.title}
                    </td>
                    <td style={td}>{i.date || '-'}</td>
                    <td style={td}>{i.start || '-'}</td>
                    <td style={td}>{i.end || '-'}</td>
                    <td style={td}>{i.notes || '-'}</td>
                    <td style={{ ...td, textAlign:'right', whiteSpace:'nowrap' }}>
                      {canWrite && (
                        editing ? (
                          <>
                            <button onClick={saveEdit} style={btnPrimarySm}>Save</button>
                            <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={()=>startEdit(i.id, i.title)} style={btnGhost}>Edit</button>
                            <button onClick={()=>remove(i.id)} style={btnGhost}>Delete</button>
                          </>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={6} style={{ ...td, color:'#6b7280' }}>No scheduled items (last 90 days).</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}

const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'8px 10px' };
const td: React.CSSProperties = { padding:'8px 10px' };
const inp: React.CSSProperties = { height:40, border:'1px solid #e5e7eb', borderRadius:12, padding:'0 12px' };
const btnPrimary: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #111827', background:'#111827', color:'#fff' };
const btnPrimarySm: React.CSSProperties = { height:32, padding:'0 12px', borderRadius:10, fontWeight:700, border:'1px solid #111827', background:'#111827', color:'#fff', marginRight:6 };
const btnGhost: React.CSSProperties = { height:32, padding:'0 10px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', marginLeft:6 };
