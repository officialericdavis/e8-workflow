export type Role = 'admin' | 'manager' | 'editor' | 'viewer' | null;

const PERMS: Record<Exclude<Role, null>, string[]> = {
  admin:   ['tasks:rw','schedule:rw','reports:rw','files:rw','integrations:use'],
  manager: ['tasks:rw','schedule:rw','reports:rw','files:rw'],
  editor:  ['tasks:rw','schedule:rw','files:rw'],
  viewer:  ['tasks:r','schedule:r','reports:r','files:r'],
};

export function can(role: Role, perm: string): boolean {
  if (!role) return false;
  const list = PERMS[role];
  // allow :r via :rw, e.g. if perm is tasks:r and role has tasks:rw
  return list.includes(perm) || list.includes(perm.replace(':r', ':rw'));
}
