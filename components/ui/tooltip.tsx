import React from 'react';
export function TooltipProvider({ children }: React.PropsWithChildren) { return <>{children}</>; }
export function Tooltip({ children }: React.PropsWithChildren) { return <>{children}</>; }
export function TooltipTrigger({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) { return <>{children}</>; }
export function TooltipContent({ children }: React.PropsWithChildren) { return <div className="text-xs bg-black text-white px-2 py-1 rounded">{children}</div>; }
