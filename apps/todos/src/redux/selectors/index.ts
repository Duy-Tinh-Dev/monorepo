import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { handleSortingByName, handleSortingByPriority } from '@/utils';
import {
  PriorityBy,
  PriorityLevels,
  SortBy,
} from '@/components/todo-list/types';

export const todoListSelector = (state: RootState) => state.todoSlice;
export const filterSelector = (state: RootState) => state.filterSlice;

export const counterTodoSelector = createSelector(
  todoListSelector,
  (todoList) => {
    return todoList.reduce((total, todo) => {
      return todo.isComplete ? total : total + 1;
    }, 0);
  }
);

export const listTodoSortingSelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (filter.priority !== PriorityBy.DEFAULT) {
      const newListTodoSorting = todoList.filter((todo) => {
        return (
          todo.priority.level ===
          PriorityLevels[filter.priority as keyof typeof PriorityLevels]
        );
      });

      if (filter.sortBy === SortBy.NAME) {
        return handleSortingByName(newListTodoSorting);
      }
      return handleSortingByPriority(newListTodoSorting);
    }

    if (filter.sortBy === SortBy.NAME) {
      return handleSortingByName(todoList);
    }

    return handleSortingByPriority(todoList);
  }
);
