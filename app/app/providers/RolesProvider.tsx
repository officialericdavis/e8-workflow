"use client";
import React, {createContext, useContext, useEffect, useState} from "react";

type Role = "admin" | "manager" | "editor" | "viewer" | null;
type RolesCtx = { role: Role; setRole: (r: Role) => void; signOut: () => void; };

const Ctx = createContext<RolesCtx | undefined>(undefined);

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (saved) setRoleState(saved as Role);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") {
      if (r) localStorage.setItem("role", r);
      else localStorage.removeItem("role");
    }
  };

  const signOut = () => setRole(null);

  return <Ctx.Provider value={{ role, setRole, signOut }}>{children}</Ctx.Provider>;
}

export function useRole() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRole must be used within RolesProvider");
  return ctx;
}

