import { Todo } from '@/components/todo-list/types';

export interface Project {
  id: number;
  name: string;
  color: string;
  listTodo: Todo[];
  userId?: string;
}
