'use client';
import React from 'react';

export function Tabs({
  defaultValue,
  children,
  className = '',
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-tabs-default={defaultValue}>
      {children}
    </div>
  );
}

export function TabsList({ children }: React.PropsWithChildren) {
  return <div className="inline-flex bg-neutral-100 rounded-xl p-1">{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-white">{children}</button>;
}

export function TabsContent({
  value,
  children,
  className = '',
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
