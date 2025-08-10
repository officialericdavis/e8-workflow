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
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Client = {
  id: string;
  name: string;
  targets: Record<DeliverableCategory, number>; // monthly targets per category
};

export type Editor = {
  id: string;
  name: string;
  dailyCapacity: Record<DeliverableCategory, number>; // optional planning
};

export type Task = {
  id: string;
  title: string;
  clientId?: string;
  category: DeliverableCategory;
  status: Status;
  priority?: Priority;
  due?: string;
  assignee?: string;
  createdAt: string;
  doneAt?: string; // set when status becomes Done
};
