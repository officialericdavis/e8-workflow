'use client';

import { CATEGORIES, Client, DeliverableCategory, Editor, Task } from './types';

const K = {
  clients: 'e8_clients',
  editors: 'e8_editors',
  tasks:   'e8_tasks',
};

const isBrowser = typeof window !== 'undefined';

function safeRead<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// helpers to build full category records
function makeTargets(partial: Partial<Record<DeliverableCategory, number>>)
: Record<DeliverableCategory, number> {
  const base = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Record<DeliverableCategory, number>;
  return { ...base, ...partial };
}
function makeCap(partial: Partial<Record<DeliverableCategory, number>>)
: Record<DeliverableCategory, number> {
  const base = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Record<DeliverableCategory, number>;
  return { ...base, ...partial };
}

export const Store = {
  // CRUD
  getClients(): Client[] { return safeRead<Client[]>(K.clients, []); },
  setClients(v: Client[]) { safeWrite(K.clients, v); },

  getEditors(): Editor[] { return safeRead<Editor[]>(K.editors, []); },
  setEditors(v: Editor[]) { safeWrite(K.editors, v); },

  getTasks(): Task[] { return safeRead<Task[]>(K.tasks, []); },
  setTasks(v: Task[]) { safeWrite(K.tasks, v); },

  // First-run data so UI has something to show
  seedIfEmpty() {
    if (this.getClients().length === 0) {
      const clients: Client[] = [
        { id: 'cl-1', name: 'The Dating Blind Show', targets: makeTargets({ 'Long Form': 2, 'Short Form': 12, 'Square Form': 4, 'Hard Posts': 8, 'Text Posts': 4 }) },
        { id: 'cl-2', name: 'MissBehaveTV',           targets: makeTargets({ 'Long Form': 1, 'Short Form':  8, 'Square Form': 4, 'Hard Posts': 6, 'Text Posts': 4 }) },
        { id: 'cl-3', name: 'CLA',                     targets: makeTargets({ 'Long Form': 1, 'Short Form':  6, 'Square Form': 2, 'Hard Posts': 4, 'Text Posts': 4 }) },
      ];
      this.setClients(clients);
    }

    if (this.getEditors().length === 0) {
      const editors: Editor[] = [
        { id: 'ed-1', name: 'Aishwarya M.', dailyCapacity: makeCap({ 'Long Form': 0.2, 'Short Form': 2, 'Square Form': 1, 'Hard Posts': 1, 'Text Posts': 1 }) },
        { id: 'ed-2', name: 'Rahul K.',     dailyCapacity: makeCap({ 'Long Form': 0.2, 'Short Form': 2, 'Square Form': 1, 'Hard Posts': 1, 'Text Posts': 1 }) },
        { id: 'ed-3', name: 'Luis G.',      dailyCapacity: makeCap({ 'Long Form': 0.2, 'Short Form': 2, 'Square Form': 1, 'Hard Posts': 1, 'Text Posts': 1 }) },
      ];
      this.setEditors(editors);
    }

    if (this.getTasks().length === 0) {
      const today = new Date();
      const d = (off: number) => {
        const x = new Date(today);
        x.setDate(x.getDate() + off);
        return x.toISOString().slice(0, 10);
      };
      const tasks: Task[] = [
        { id:'t-1', title:'Edit Street Interview — Miami Beach EP12', clientId:'cl-1', assigneeId:'ed-1', category:'Long Form',  status:'In Progress', createdAt: today.toISOString(), due: d(2) },
        { id:'t-2', title:'QC — Casino UGC Reels (x4)',                clientId:'cl-2', assigneeId:'ed-2', category:'Short Form', status:'Open',        createdAt: today.toISOString(), due: d(1) },
        { id:'t-3', title:'Deliver — CLA Cutdowns',                    clientId:'cl-3', assigneeId:'ed-3', category:'Square Form', status:'Done',        createdAt: today.toISOString(), doneAt: today.toISOString(), due: d(0) },
      ];
      this.setTasks(tasks);
    }
  },
};
