'use client';

import RequireAuth from '../components/RequireAuth';
import { useRole } from '../providers/RolesProvider';
import { can } from '@/lib/roles';
import { useEffect, useMemo, useState } from 'react';
import { loadLS, saveLS, purgeByAge } from '@/lib/retention';

type FileRec = { id: string; name: string; url?: string; createdAt: number; };
const KEY = 'e8_files';

export default function FilesPage() {
  const { role } = useRole();
  const canRead = can(role, 'files:r');
  const canWrite = can(role, 'files:rw');

  const [list, setList] = useState<FileRec[]>([]);
  const [name, setName] = useState('Spec.pdf');
  const [url, setUrl] = useState('https://example.com/spec.pdf');

  useEffect(() => { setList(purgeByAge(loadLS(KEY, [], true))); }, []);
  useEffect(() => { saveLS(KEY, list); }, [list]);

  const sorted = useMemo(() => [...list].sort((a,b)=>b.createdAt - a.createdAt), [list]);

  function add() {
    if (!canWrite) return;
    if (!name.trim()) { alert('Name required'); return; }
    const rec: FileRec = { id: crypto.randomUUID(), name: name.trim(), url: url.trim(), createdAt: Date.now() };
    setList(prev => [rec, ...prev]);
    setName(''); setUrl('');
  }
  function remove(id: string) {
    if (!canWrite) return;
    setList(prev => prev.filter(r => r.id !== id));
  }

  if (!canRead) return <RequireAuth><div /></RequireAuth>;

  return (
    <RequireAuth>
      <main style={{ display:'grid', gap:16 }}>
        <h1 style={{ margin:0, fontWeight:900 }}>Files (Mock)</h1>

        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:16, display:'grid', gap:10, opacity:canWrite?1:.6 }}>
          <h2 style={{ margin:0 }}>Add file record</h2>
          <input placeholder="Name *" value={name} onChange={e=>setName(e.target.value)} style={inp}/>
          <input placeholder="Link (optional)" value={url} onChange={e=>setUrl(e.target.value)} style={inp}/>
          <div><button disabled={!canWrite} onClick={add} style={btnPrimary}>Add</button></div>
          {!canWrite && <div style={{ color:'#6b7280', fontSize:12 }}>View only — your role cannot add files.</div>}
        </section>

        <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:16, padding:8 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={th}>Name</th><th style={th}>Created</th><th style={th}>Link</th><th style={th}></th></tr></thead>
            <tbody>
              {sorted.map(f => (
                <tr key={f.id} style={{ borderTop:'1px solid #f3f4f6' }}>
                  <td style={td}>{f.name}</td>
                  <td style={td}>{new Date(f.createdAt).toLocaleString()}</td>
                  <td style={td}>{f.url ? <a href={f.url} target="_blank" rel="noreferrer">Open</a> : '-'}</td>
                  <td style={{ ...td, textAlign:'right' }}>{canWrite && <button onClick={()=>remove(f.id)} style={btnGhost}>Delete</button>}</td>
                </tr>
              ))}
              {sorted.length === 0 && <tr><td colSpan={4} style={{ ...td, color:'#6b7280' }}>No files (last 90 days).</td></tr>}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}

const th: React.CSSProperties = { textAlign:'left', fontSize:12, color:'#6b7280', padding:'10px' };
const td: React.CSSProperties = { padding:'10px' };
const inp: React.CSSProperties = { border:'1px solid #e5e7eb', borderRadius:12, padding:'8px 12px' };
const btnPrimary: React.CSSProperties = { height:40, padding:'0 14px', borderRadius:12, fontWeight:900, border:'1px solid #111827', background:'#111827', color:'#fff' };
const btnGhost: React.CSSProperties = { height:32, padding:'0 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff' };
