export interface BaseTodo {
  name: string;
  description: string;
  priority: PriorityItem;
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

export type LevelPriority = 'low' | 'medium' | 'high';

export interface PriorityItem {
  id: number;
  color: string;
  level: LevelPriority;
}

export type GroupBy = 'None (default)' | 'Priority';

export type SortBy = 'Smart (default)' | 'Priority' | 'Name';

export type FilterPriority = 'All (default)' | 'P1' | 'P2' | 'P3';

export type TypeInput = 'text' | 'password';

export interface FormData {
  email: string;
  password: string;
}
