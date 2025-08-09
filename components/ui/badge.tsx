import React from 'react';
export function Badge({ children, className='', variant='default' }:
  React.PropsWithChildren<{ className?: string, variant?: 'default'|'secondary' }>) {
  const styles = variant === 'default' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-800';
  return <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${styles} ${className}`}>{children}</span>;
}
