import React from 'react';
export function Button({ children, variant='default', size='md', className='', ...props }:
  React.PropsWithChildren<{variant?: 'default'|'outline'|'ghost', size?: 'sm'|'md', className?: string} & React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-3.5 py-2 text-sm transition';
  const variants = { default: 'bg-neutral-900 text-white hover:bg-neutral-800', outline: 'border border-neutral-300 hover:bg-neutral-50', ghost: 'hover:bg-neutral-100' } as const;
  const sizes = { sm: 'px-2.5 py-1.5 text-xs rounded-xl', md: '' } as const;
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
