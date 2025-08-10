'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';

type Variant = 'success' | 'error' | 'info';
type Toast = { id: string; message: string; variant: Variant };
type ToastCtx = { show: (message: string, variant?: Variant) => void };

const Ctx = createContext<ToastCtx | undefined>(undefined);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used within ToastsProvider');
  return c;
}

function color(v: Variant) {
  if (v === 'success') return '#059669';
  if (v === 'error') return '#DC2626';
  return '#111827';
}

function ToastsProviderInner({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, variant: Variant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, zIndex: 60 }}>
        {toasts.map((t) => (
          <div key={t.id}
               style={{ padding: '12px 14px', borderRadius: 12, color: '#fff', fontWeight: 800, background: color(t.variant), boxShadow: '0 10px 30px rgba(0,0,0,.2)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export default function ToastsProvider(props: { children: React.ReactNode }) {
  return <ToastsProviderInner {...props} />;
}
export { ToastsProviderInner as ToastsProvider };
