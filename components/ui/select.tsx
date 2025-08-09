'use client';
import React from 'react';
export function Select({ children, defaultValue }: React.PropsWithChildren<{defaultValue?: string}>) { return <div data-default={defaultValue}>{children}</div>; }
export function SelectTrigger({ children, className='' }: React.PropsWithChildren<{className?: string}>) { return <button className={`border rounded-xl px-3 py-2 text-sm ${className}`}>{children}</button>; }
export function SelectContent({ children }: React.PropsWithChildren) { return <div className="border rounded-xl bg-white p-1">{children}</div>; }
export function SelectItem({ children, value }: React.PropsWithChildren<{value: string}>) { return <div className="px-2 py-1.5 hover:bg-neutral-100 rounded-lg">{children}</div>; }
export function SelectValue({ placeholder }: { placeholder?: string }) { return <span>{placeholder||'Select'}</span>; }
