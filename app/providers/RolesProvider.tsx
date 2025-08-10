'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AMPLIFY_MOCK } from '../amplify-config';
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';

export type Role = 'admin' | 'manager' | 'editor' | 'viewer' | null;
type RolesCtx = { role: Role; setRole: (r: Role) => void; signOut: () => Promise<void> };

const Ctx = createContext<RolesCtx | undefined>(undefined);

export function useRole() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useRole must be used within RolesProvider');
  return c;
}

function pickRoleFromGroups(groups?: string[]): Role {
  if (!groups || groups.length === 0) return 'viewer';
  const g = groups.map((x) => x.toLowerCase());
  if (g.includes('admin')) return 'admin';
  if (g.includes('manager')) return 'manager';
  if (g.includes('editor')) return 'editor';
  return 'viewer';
}

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (AMPLIFY_MOCK) {
        if (mounted) setRole('admin');
        return;
      }
      try {
        const { tokens } = await fetchAuthSession();
        const groups = (tokens?.idToken?.payload?.['cognito:groups'] as string[]) || [];
        if (mounted) setRole(pickRoleFromGroups(groups));
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function signOut() {
    try {
      if (!AMPLIFY_MOCK) await amplifySignOut();
    } finally {
      setRole(null);
    }
  }

  return <Ctx.Provider value={{ role, setRole, signOut }}>{children}</Ctx.Provider>;
}
