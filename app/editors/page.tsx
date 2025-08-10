'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { CATEGORIES, Editor } from '../lib/types';
import { Store } from '../lib/store';
import RequireAuth from '../components/RequireAuth';

const card: React.CSSProperties = { background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:12 };
const inputNarrow: React.CSSProperties = { width: 90, textAlign:'right', padding:'6px 8px', border:'1px solid #dfe4ee', borderRadius:8 };

export default function EditorsPage() {
  const [editors, setEditors] = useState<Editor[]>([]);

  function updateCap(id: string, cat: (typeof CATEGORIES)[number], value: number) {
    const next = editors.map(e => e.id === id ? { ...e, dailyCapacity: { ...e.dailyCapacity, [cat]: Math.max(0, value|0) } } : e);
    setEditors(next); Store.setEditors(next);
  }

  function addEditor() {
    const name = prompt('Editor name?')?.trim(); if (!name) return;
    const base = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Editor['dailyCapacity'];
    const next = [...editors, { id: crypto.randomUUID(), name, dailyCapacity: base }];
    setEditors(next); Store.setEditors(next);
  }

  function renameEditor(id: string) {
    const cur = editors.find(e => e.id === id); if (!cur) return;
    const name = prompt('Rename editor', cur.name)?.trim(); if (!name) return;
    const next = editors.map(e => e.id === id ? { ...e, name } : e);
    setEditors(next); Store.setEditors(next);
  }

  function removeEditor(id: string) {
    if (!confirm('Remove editor?')) return;
    const next = editors.filter(e => e.id !== id);
    setEditors(next); Store.setEditors(next);
  }

  return (
    <RequireAuth>
      <main style={{ padding: 24, display:'grid', gap:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h1 style={{ margin:0 }}>Editors & Daily Capacity</h1>
          <button onClick={addEditor} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #dfe4ee', background:'#111827', color:'#fff' }}>New Editor</button>
        </div>

        <section style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:10 }}>Editor</th>
                {CATEGORIES.map(cat => <th key={cat} style={{ textAlign:'right', padding:10 }}>{cat}/day</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {editors.map(ed => (
                <tr key={ed.id} style={{ borderTop:'1px solid #edf0f6' }}>
                  <td style={{ padding:10, fontWeight:600 }}>
                    <div>{ed.name}</div>
                    <div style={{ display:'flex', gap:8, marginTop:6 }}>
                      <button onClick={() => renameEditor(ed.id)} style={{ fontSize:12, border:'1px solid #e5e7eb', borderRadius:8, padding:'4px 8px', background:'#fff' }}>Rename</button>
                      <button onClick={() => removeEditor(ed.id)} style={{ fontSize:12, border:'1px solid #f3d1d1', color:'#991b1b', borderRadius:8, padding:'4px 8px', background:'#fff' }}>Remove</button>
                    </div>
                  </td>
                  {CATEGORIES.map(cat => (
                    <td key={cat} style={{ padding:10, textAlign:'right' }}>
                      <input
                        type="number" min={0}
                        value={ed.dailyCapacity[cat] ?? 0}
                        onChange={(e) => updateCap(ed.id, cat, Number(e.target.value))}
                        style={inputNarrow}
                      />
                    </td>
                  ))}
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}
