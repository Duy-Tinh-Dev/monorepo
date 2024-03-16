import { BaseTodo, Todo } from '@/components/todo-list/types';

export interface Group {
  listTodoSorting: Todo[];
  onDeleteTodo: (idTodo: number) => void;
  onToggleCompleteTodo: (idTodo: number) => void;
  onEditTodo: (todo: BaseTodo, idEdit?: number) => void;
  onDuplicate: (todo: Todo) => void;
  onSeeDetailTodo: (todo: Todo, index?: number) => void;
}
