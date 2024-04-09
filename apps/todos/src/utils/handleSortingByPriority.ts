import { Direction, Todo } from '@/components/todo-list/types';

export const handleSortingByPriority = (
  array: Todo[],
  direction?: Direction
): Todo[] => {
  return array.slice().sort((a, b) => {
    const levels = { all: 4, high: 3, medium: 2, low: 1 };
    if (direction === Direction.ASCENDING) {
      return levels[b.priority.level] - levels[a.priority.level];
    }

    return levels[a.priority.level] - levels[b.priority.level];
  });
};
