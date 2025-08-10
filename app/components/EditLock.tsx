'use client';
export default function EditLock({
  allowed,
  children,
  banner = '🔒 View-only: only Admins and Managers can change client deliverables.',
}: { allowed: boolean; children: React.ReactNode; banner?: string }) {
  if (allowed) return <>{children}</>;
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          color: '#9a3412',
          borderRadius: 10,
          padding: '8px 12px',
          marginBottom: 12,
        }}
      >
        {banner}
      </div>
      <div style={{ opacity: 0.6, pointerEvents: 'none' }}>{children}</div>
    </div>
  );
}
