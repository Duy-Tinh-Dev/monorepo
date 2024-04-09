import { configureStore } from '@reduxjs/toolkit';
import todoSlice from '../slices/todoSlice';
import filterSlice from '../slices/filterSlice';
import projectSlice from '../slices/projectSlice';
import searchTodoSlice from '../slices/searchTodoSlice';
import todoDetailSlice from '../slices/todoDetailSlice';

const store = configureStore({
  reducer: {
    todoSlice,
    filterSlice,
    projectSlice,
    searchTodoSlice,
    todoDetailSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
