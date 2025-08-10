'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';

export type Role = 'admin' | 'manager' | 'editor' | 'viewer' | null;

type RolesCtx = {
  role: Role;
  setRole: (r: Role) => void;         // keeps your old tests working
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;       // NEW: force-refresh ID token and re-map groups -> role
};

const Ctx = createContext<RolesCtx | undefined>(undefined);

function groupToRole(groups?: string[] | null): Role {
  const g = (groups ?? []).map((s) => s.toLowerCase());
  if (g.includes('admin')) return 'admin';
  if (g.includes('manager')) return 'manager';
  if (g.includes('editor')) return 'editor';
  if (g.includes('viewer')) return 'viewer';
  return null;
}

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    (async () => {
      try {
        await getCurrentUser(); // throws if signed out
        const s = await fetchAuthSession();
        const groups = (s.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined) ?? [];
        setRoleState(groupToRole(groups));
      } catch {
        setRoleState(null);
      }
    })();
  }, []);

  const setRole = (r: Role) => setRoleState(r);

  const refresh = async () => {
    try {
      const s = await fetchAuthSession({ forceRefresh: true });
      const groups = (s.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined) ?? [];
      setRoleState(groupToRole(groups));
    } catch {
      setRoleState(null);
    }
  };

  const signOut = async () => {
    await amplifySignOut();
    setRoleState(null);
  };

  return <Ctx.Provider value={{ role, setRole, signOut, refresh }}>{children}</Ctx.Provider>;
}

export function useRole() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRole must be used within RolesProvider');
  return ctx;
}
