import React from 'react';
export function Table({ children }: React.PropsWithChildren) { return <table className="w-full border-separate border-spacing-y-2">{children}</table>; }
export function TableHeader({ children }: React.PropsWithChildren) { return <thead className="text-xs text-neutral-500">{children}</thead>; }
export function TableBody({ children }: React.PropsWithChildren) { return <tbody>{children}</tbody>; }
export function TableRow({ children }: React.PropsWithChildren) { return <tr className="bg-white border rounded-xl">{children}</tr>; }
export function TableHead({ children, className='' }: React.PropsWithChildren<{className?: string}>) { return <th className={`text-left px-3 py-2 ${className}`}>{children}</th>; }
export function TableCell({ children, className='' }: React.PropsWithChildren<{className?: string}>) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
