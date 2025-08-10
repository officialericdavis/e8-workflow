'use client';
import { redirect } from 'next/navigation';
import { useRole } from '../providers/RolesProvider';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  if (!role) redirect('/login');
  return <>{children}</>;
}
