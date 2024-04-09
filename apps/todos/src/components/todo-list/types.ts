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
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  All = 'all',
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
  DATE = 'Date',
}

export enum SortBy {
  DEFAULT = 'Smart (default)',
  PRIORITY = Priority.DEFAULT,
  NAME = 'Name',
}

export enum Direction {
  ASCENDING = 'Ascending (default)',
  DESCENDING = 'Descending',
}

export enum PriorityBy {
  DEFAULT = 'All (default)',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum OptionFilter {
  GROUP,
  SORT,
  PRIORITY,
  DIRECTION,
}

export type TypeInput = 'text' | 'password';

export interface FilterTodoList {
  groupBy: GroupBy;
  sortBy: SortBy;
  priority: PriorityBy;
  direction: Direction;
  view: View;
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

export enum View {
  LIST,
  BOARD,
}

export enum TypeSearchTodo {
  HISTORY,
  CURRENT,
}

export interface SearchTodo {
  listIdTodoSearchHistory: number[];
  listIdTodoSearchCurrent: number[];
}

export interface ToggleDetail {
  todo: Todo;
  index?: number;
  isComment?: boolean;
}
