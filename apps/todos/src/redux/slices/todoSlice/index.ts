import { Todo } from '@/components/todo-list/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Todo[] = [];

const todoSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    initListTodo: (_state, action: PayloadAction<Todo[]>) => {
      return action.payload;
    },
  },
});

export const { initListTodo } = todoSlice.actions;
export default todoSlice.reducer;
