export type DeliverableCategory =
  | 'Long Form'
  | 'Short Form'
  | 'Square Form'
  | 'Hard Posts'
  | 'Text Posts';

export const CATEGORIES: DeliverableCategory[] = [
  'Long Form',
  'Short Form',
  'Square Form',
  'Hard Posts',
  'Text Posts',
];

export type Status = 'Open' | 'In Progress' | 'Blocked' | 'Done';

export type Client = {
  id: string;
  name: string;
  targets: Record<DeliverableCategory, number>;
};

export type Editor = {
  id: string;
  name: string;
  dailyCapacity: Record<DeliverableCategory, number>;
};

export type Task = {
  id: string;
  title: string;
  clientId?: string;
  assigneeId?: string;                // NEW: who’s responsible
  category: DeliverableCategory;
  status: Status;
  due?: string;
  createdAt: string;
  doneAt?: string;
};
