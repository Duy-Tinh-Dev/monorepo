export interface BaseTodo {
  name: string;
  description: string;
  priority: PriorityItem;
  expireTime?: string;
}

export interface Todo extends BaseTodo {
  id: number;
  isComplete: boolean;
  comments: Comment[];
  subTasks: Todo[];
}

export interface Comment {
  id: number;
  name: string;
  content: string;
}

export enum PriorityLevels {
  P1 = 'high',
  P2 = 'medium',
  P3 = 'low',
}

export interface PriorityItem {
  id: number;
  color: string;
  level: PriorityLevels;
}

export enum Priority {
  DEFAULT = 'Priority',
}

export enum GroupBy {
  DEFAULT = 'None (default)',
  PRIORITY = Priority.DEFAULT,
}

export enum SortBy {
  DEFAULT = 'Smart (default)',
  PRIORITY = Priority.DEFAULT,
  NAME = 'Name',
}

export enum PriorityBy {
  DEFAULT = 'All (default)',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export type TypeInput = 'text' | 'password';

export interface FilterTodoList {
  groupBy: GroupBy;
  sortBy: SortBy;
  priority: PriorityBy;
}

export interface FormData {
  email: string;
  password: string;
}

export enum QuickTime {
  TODAY = 'today',
  LATER_THIS_WEEK = 'later_this_week',
  THIS_WEEKEND = 'this_weekend',
  NEXT_WEEK = 'next_week',
}
