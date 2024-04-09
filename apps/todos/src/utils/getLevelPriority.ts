import { PriorityBy, PriorityLevels } from '@/components/todo-list/types';

export const getLevelPriority = (priorityBy: PriorityBy) => {
  switch (priorityBy) {
    case PriorityBy.High:
      return PriorityLevels.High;
    case PriorityBy.Medium:
      return PriorityLevels.Medium;
    case PriorityBy.Low:
      return PriorityLevels.Low;
    default:
      return PriorityLevels.All;
  }
};
