import { Todo } from '@/components/todo-list/types';
import { UniqueIdentifier } from '@dnd-kit/core';

export const getIndexTodoById = (
  listTodo: Todo[],
  idTodo: UniqueIdentifier
) => {
  return listTodo.findIndex((todo) => todo.id === idTodo);
};
