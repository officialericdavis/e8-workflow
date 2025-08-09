'use client';
import React, {createContext, useContext, useState} from 'react';

type Ctx = { value: string; setValue: (v: string)=>void };
const TabsCtx = createContext<Ctx | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('Tabs.* must be inside <Tabs>');
  return ctx;
};

export function Tabs({
  defaultValue,
  children,
  className = '',
}: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children }: React.PropsWithChildren) {
  return <div className="inline-flex bg-neutral-100 rounded-xl p-1">{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const t = useTabs();
  const active = t.value === value;
  return (
    <button
      onClick={() => t.setValue(value)}
      className={`px-3 py-1.5 text-sm rounded-lg ${active ? 'bg-white shadow' : 'hover:bg-white'}`}
    >
      {children}
    </button>
  );
}
export function TabsContent({
  value,
  children,
  className = '',
}: { value: string; children: React.ReactNode; className?: string }) {
  const t = useTabs();
  if (t.value !== value) return null;
  return <div className={className}>{children}</div>;
}
