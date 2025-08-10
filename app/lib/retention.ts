export function saveLS<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
}

export function loadLS<T>(key: string, fallback: T, purge90d: boolean) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    if (purge90d && Array.isArray(data)) {
      const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const filtered = data.filter((x: any) => {
        const ts =
          (typeof x.completedAt === 'number' && x.completedAt) ||
          (typeof x.createdAt === 'number' && x.createdAt) ||
          (x.due ? Date.parse(x.due) : undefined);
        return !ts || ts >= cutoff;
      });
      if (filtered.length !== data.length) {
        localStorage.setItem(key, JSON.stringify(filtered));
      }
      return filtered as T;
    }
    return data as T;
  } catch {
    return fallback;
  }
}
