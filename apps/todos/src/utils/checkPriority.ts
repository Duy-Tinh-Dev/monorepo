import { Todo } from '@/components/todo-list/types';

export const checkPriority = (
  listTodo: Todo[],
  idActive: number,
  idOver: number
) => {
  return listTodo[idActive].priority.level === listTodo[idOver].priority.level;
};
