import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  getEndOfDay,
  handleSortingByName,
  handleSortingByPriority,
} from '@/utils';
import {
  FilterTodoList,
  PriorityBy,
  PriorityLevels,
  SortBy,
  Todo,
} from '@/components/todo-list/types';
import dayjs from 'dayjs';
import { levels } from '@/constants';

export const todoListSelector = (state: RootState) => state.todoSlice;
export const filterSelector = (state: RootState) => state.filterSlice;
export const listProjectSelector = (state: RootState) =>
  state.projectSlice.listProject;
export const projectSelectedSelector = (state: RootState) =>
  state.projectSlice.projectSelected;
export const searchTodoSelector = (state: RootState) => state.searchTodoSlice;
export const todoDetailSelector = (state: RootState) => state.todoDetailSlice;

export const listTodoProjectSelector = createSelector(
  listProjectSelector,
  projectSelectedSelector,
  (listProject, projectSelected) => {
    if (listProject === null) return [];

    if (!projectSelected) {
      return listProject[0]?.listTodo;
    }

    const project = listProject?.find(
      (project) => project.id === projectSelected?.id
    );

    return project?.listTodo;
  }
);

export const counterTodoSelector = createSelector(
  todoListSelector,
  (todoList) => {
    if (todoList === null) return 0;

    return todoList.reduce((total, todo) => {
      return todo.isComplete ? total : total + 1;
    }, 0);
  }
);

export const listTodoInboxSelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (todoList === null) return [];

    return handleSortTodo(todoList, filter);
  }
);

export const listTodoOverdueSelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (todoList === null) return [];

    const todoRemaining = todoList.filter((todo) => {
      return dayjs(todo.expireTime).isBefore(dayjs());
    });
    return handleSortTodo(todoRemaining, filter);
  }
);

export const listTodoTodaySelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (todoList === null) return [];

    const todoRemaining = todoList.filter((todo) => {
      return dayjs(todo.expireTime).isSame(getEndOfDay(), 'day');
    });
    return handleSortTodo(todoRemaining, filter);
  }
);

export const listTodoGroupPrioritySelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (todoList === null) return [];

    const output: Todo[][] = levels.map((level) => {
      const listTodoFilterPriority = todoList.filter(
        (todo) => todo.priority.level === level
      );

      return listTodoFilterPriority;
    });

    return output.map((todos) => {
      return handleSortTodo(todos, filter);
    });
  }
);

export const listTodoGroupDateSelector = createSelector(
  todoListSelector,
  filterSelector,
  (todoList, filter) => {
    if (todoList === null) return [];

    const output: Todo[][] = Object.values(
      todoList.reduce((acc: { [key: string]: Todo[] }, todo) => {
        const date = dayjs(todo.expireTime).get('date') || 'no due date';

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(todo);

        return acc;
      }, {})
    );

    return output.map((todos) => {
      return handleSortTodo(todos, filter);
    });
  }
);

export const counterTodoProjectSelector = createSelector(
  listTodoProjectSelector,
  (listTodoProject) => {
    if (listTodoProject === null) return 0;

    return listTodoProject?.reduce((total, todo) => {
      return todo.isComplete ? total : total + 1;
    }, 0);
  }
);

export const listTodoProjectOverdueSelector = createSelector(
  listTodoProjectSelector,
  filterSelector,
  (listTodoProject, filter) => {
    if (listTodoProject === undefined) return [];

    const todoRemaining = listTodoProject.filter((todo) => {
      return dayjs(todo.expireTime).isBefore(dayjs(getEndOfDay()));
    });

    return handleSortTodo(todoRemaining, filter);
  }
);

export const listTodoProjectTodaySelector = createSelector(
  listTodoProjectSelector,
  filterSelector,
  (listTodoProject, filter) => {
    if (listTodoProject === undefined) return [];

    const todoRemaining = listTodoProject.filter((todo) => {
      return dayjs(todo.expireTime).isSame(getEndOfDay(), 'day');
    });
    return handleSortTodo(todoRemaining, filter);
  }
);

export const listTodoProjectGroupPrioritySelector = createSelector(
  listTodoProjectSelector,
  filterSelector,
  (listTodoProject, filter) => {
    if (listTodoProject === undefined) return [];

    const output: Todo[][] = levels.map((level) => {
      const listTodoFilterPriority = listTodoProject.filter(
        (todo) => todo.priority.level === level
      );

      return listTodoFilterPriority;
    });

    return output.map((todos) => {
      return handleSortTodo(todos, filter);
    });
  }
);

export const listTodoProjectGroupDateSelector = createSelector(
  listTodoProjectSelector,
  filterSelector,
  (listTodoProject, filter) => {
    if (listTodoProject === undefined) return [];

    const output: Todo[][] = Object.values(
      listTodoProject.reduce((acc: { [key: string]: Todo[] }, todo) => {
        const date = dayjs(todo.expireTime).get('date') || 'no due date';

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(todo);

        return acc;
      }, {})
    );

    return output.map((todos) => {
      return handleSortTodo(todos, filter);
    });
  }
);

const handleSortTodo = (todoList: Todo[], filter: FilterTodoList) => {
  if (filter.priority !== PriorityBy.DEFAULT) {
    const newListTodoSorting = todoList.filter((todo) => {
      return (
        todo.priority.level ===
        PriorityLevels[filter.priority as keyof typeof PriorityLevels]
      );
    });

    if (filter.sortBy === SortBy.NAME) {
      return handleSortingByName(newListTodoSorting, filter.direction);
    }
    return handleSortingByPriority(newListTodoSorting, filter.direction);
  }

  if (filter.sortBy === SortBy.NAME) {
    return handleSortingByName(todoList, filter.direction);
  }

  return handleSortingByPriority(todoList, filter.direction);
};
