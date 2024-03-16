import { Todo } from '@/components/todo-list/types';

export const handleSortingByPriority = (array: Todo[]): Todo[] => {
  return array.slice().sort((a, b) => {
    const levels = { high: 3, medium: 2, low: 1 };
    return levels[b.priority.level] - levels[a.priority.level];
  });
};
