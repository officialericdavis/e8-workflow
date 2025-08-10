export const RETENTION_DAYS = 90;
const TTL_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

export type WithCreatedAt = { createdAt?: number | string };

export function purgeByAge<T extends WithCreatedAt>(items: T[], now = Date.now()): T[] {
  return (items || []).filter((i) => {
    if (!i?.createdAt) return true;
    const ts = typeof i.createdAt === 'string' ? Date.parse(i.createdAt) : i.createdAt;
    return Number.isFinite(ts) ? (now - (ts as number)) <= TTL_MS : true;
  });
}

export function loadLS<T>(key: string, fallback: T, purge = false): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return purge && Array.isArray(parsed) ? (purgeByAge(parsed) as T) : parsed as T;
  } catch { return fallback; }
}

export function saveLS<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
