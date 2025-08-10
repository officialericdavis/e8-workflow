'use client';
import RequireAuth from '../components/RequireAuth';
import { useState } from 'react';

type QCItem = { id: string; title: string; creator: string; status: 'Pending' | 'Approved' | 'Flagged' };

const initial: QCItem[] = [
  { id: 'QC-201', title: 'UGC Reel – Casino Pull #2', creator: 'Rahul K', status: 'Pending' },
  { id: 'QC-202', title: 'Street Interview – Miami Beach EP12', creator: 'Aishwarya M', status: 'Pending' },
  { id: 'QC-203', title: 'Client Delivery – CLA Cutdowns', creator: 'Neha P', status: 'Pending' },
];

export default function QCPage() {
  const [rows, setRows] = useState<QCItem[]>(initial);

  function setStatus(id: string, status: QCItem['status']) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  return (
    <RequireAuth>
      <h1 style={{ marginTop: 0, fontWeight: 900 }}>Quality Control</h1>

      <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ background:'#f7f8fc' }}>
            <tr>
              {['ID','Title','Creator','Status','Actions'].map(h=>
                <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:'#6b7280', textTransform:'uppercase' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ borderTop:'1px solid #f0f2f7' }}>
                <td style={{ padding:'12px 16px' }}>{r.id}</td>
                <td style={{ padding:'12px 16px' }}>{r.title}</td>
                <td style={{ padding:'12px 16px' }}>{r.creator}</td>
                <td style={{ padding:'12px 16px' }}>{r.status}</td>
                <td style={{ padding:'12px 16px', display:'flex', gap:8 }}>
                  <button onClick={()=>setStatus(r.id,'Approved')} style={btnOk}>Approve</button>
                  <button onClick={()=>setStatus(r.id,'Flagged')} style={btnWarn}>Flag</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RequireAuth>
  );
}

const base = { height:36, padding:'0 12px', borderRadius:10, fontWeight:900, border:'1px solid transparent', cursor:'pointer' } as const;
const btnOk   = { ...base, background:'#065f46', color:'#fff', borderColor:'#065f46' };
const btnWarn = { ...base, background:'#92400e', color:'#fff', borderColor:'#92400e' };
