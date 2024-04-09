import { Direction, Todo } from '@/components/todo-list/types';

export const handleSortingByName = (
  array: Todo[],
  direction: Direction
): Todo[] => {
  return array.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (direction === Direction.ASCENDING) {
      if (nameA >= nameB) {
        return 1;
      }
      return -1;
    }
    if (nameA <= nameB) {
      return 1;
    }
    return -1;
  });
};
