'use client';
import React from 'react';
export function Dialog({ children }: React.PropsWithChildren) { return <>{children}</>; }
export function DialogTrigger({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) { return <>{children}</>; }
export function DialogContent({ children, className='' }: React.PropsWithChildren<{className?: string}>) { return <div className={`border rounded-2xl p-4 bg-white shadow-lg ${className}`}>{children}</div>; }
export function DialogHeader({ children }: React.PropsWithChildren) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children }: React.PropsWithChildren) { return <h4 className="text-lg font-semibold">{children}</h4>; }
