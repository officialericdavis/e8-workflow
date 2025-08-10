import RequireAuth from './components/RequireAuth';

export default function DashboardPage() {
  const kpis = [
    { label: 'Open Tasks', value: 64, sub: '+8 this week' },
    { label: 'Awaiting QC', value: 9, sub: '-2 today' },
    { label: 'Scheduled', value: 27, sub: 'this week' },
    { label: 'Payments', value: '$8,400', sub: 'due Monday' },
  ];

  const recent = [
    { id: 'T-1087', title: 'Edit Street Interview – Miami Beach EP12', person: 'Aishwarya', stage: 'Editing', due: 'Aug 12' },
    { id: 'T-1088', title: 'QC – Casino UGC Reels (x4)', person: 'Rahul', stage: 'QC', due: 'Aug 10' },
    { id: 'T-1089', title: 'Schedule – YouTube Premiere EP23', person: 'Luis', stage: 'Scheduling', due: 'Aug 11' },
  ];

  return (
    <RequireAuth>
      <h1 style={{ marginTop: 0, fontWeight: 900 }}>Dashboard</h1>

      <section style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(4, minmax(0,1fr))', marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, padding:16 }}>
            <div style={{ fontSize: 12, color:'#6b7280', fontWeight: 800, textTransform:'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{k.value}</div>
            <div style={{ fontSize: 12, color:'#6b7280' }}>{k.sub}</div>
          </div>
        ))}
      </section>

      <section style={{ background:'#fff', border:'1px solid #edf0f6', borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ background:'#f7f8fc' }}>
            <tr>
              {['ID','Title','Assignee','Stage','Due'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:'#6b7280', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.id} style={{ borderTop:'1px solid #f0f2f7' }}>
                <td style={{ padding:'12px 16px' }}>{r.id}</td>
                <td style={{ padding:'12px 16px' }}>{r.title}</td>
                <td style={{ padding:'12px 16px' }}>{r.person}</td>
                <td style={{ padding:'12px 16px' }}>{r.stage}</td>
                <td style={{ padding:'12px 16px' }}>{r.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RequireAuth>
  );
}
