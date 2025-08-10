'use client';
import { Client, Editor, Task, CATEGORIES } from './types';

const K = {
  clients: 'e8_clients',
  editors: 'e8_editors',
  tasks:   'e8_tasks',
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

export function initDefaults() {
  // Seed minimal data if empty
  const clients = read<Client[]>(K.clients, []);
  if (clients.length === 0) {
    const emptyTargets = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Client['targets'];
    write<Client[]>(K.clients, [
      { id: 'c1', name: 'Acme Co', targets: { ...emptyTargets, 'Short Form': 20, 'Hard Posts': 8 } },
      { id: 'c2', name: 'Globex', targets: { ...emptyTargets, 'Long Form': 4, 'Text Posts': 12 } },
    ]);
  }
  const editors = read<Editor[]>(K.editors, []);
  if (editors.length === 0) {
    const cap = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Editor['dailyCapacity'];
    write<Editor[]>(K.editors, [
      { id: 'e1', name: 'Alex', dailyCapacity: { ...cap, 'Short Form': 4, 'Hard Posts': 2 } },
      { id: 'e2', name: 'Riley', dailyCapacity: { ...cap, 'Long Form': 1, 'Text Posts': 6 } },
    ]);
  }
}

export const Store = {
  getClients(): Client[] { return read<Client[]>(K.clients, []); },
  setClients(v: Client[]) { write(K.clients, v); },

  getEditors(): Editor[] { return read<Editor[]>(K.editors, []); },
  setEditors(v: Editor[]) { write(K.editors, v); },

  getTasks(): Task[] { return read<Task[]>(K.tasks, []); },
  setTasks(v: Task[]) { write(K.tasks, v); },
};

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
export function isSameMonth(ts?: string, d = new Date()) {
  if (!ts) return false;
  const t = new Date(ts);
  return t.getFullYear() === d.getFullYear() && t.getMonth() === d.getMonth();
}
