import { PriorityBy, PriorityLevels, Todo } from '@/components/todo-list/types';
import { getLevelPriority } from '@/utils';

export const getListTodoByLevelPriority = (
  listTodoGroupPriority: Todo[][],
  priorityBy: PriorityBy
) => {
  let level: PriorityLevels = getLevelPriority(priorityBy);

  const todos = listTodoGroupPriority.find(
    (listTodo) => listTodo[0]?.priority.level === level
  );
  return todos ?? [];
};

export const getIndexPriority = (priority: PriorityBy) => {
  switch (priority) {
    case PriorityBy.High:
      return 1;
    case PriorityBy.Medium:
      return 2;
    case PriorityBy.Low:
      return 3;
    default:
      return 1;
  }
};
