import { PriorityItem, PriorityLevels } from '@/components/todo-list/types';

export const listPriority: PriorityItem[] = [
  {
    id: 1,
    color: '#dc4c3e',
    level: PriorityLevels.High,
  },
  {
    id: 2,
    color: '#eb8909',
    level: PriorityLevels.Medium,
  },
  {
    id: 3,
    color: '#666666',
    level: PriorityLevels.Low,
  },
];

export const levels: PriorityLevels[] = [
  PriorityLevels.High,
  PriorityLevels.Medium,
  PriorityLevels.Low,
];

export const ROUTES = {
  signin: '/auth/login',
  signup: '/auth/signup',
  home: '/',
  inbox: '/inbox',
  project: '/project',
  filter: '/filter',
};

export const styleScrollbar = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
export const keyLocalStorage = {
  searchTodo: 'search-todo',
};

export const initialListIdTodo: number[] = [];
