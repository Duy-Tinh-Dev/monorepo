import { Todo } from '@/components/todo-list/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  todo: Todo[] | null;
} = {
  todo: null,
};

const todoSlice = createSlice({
  name: 'todoList',
  initialState: initialState.todo,
  reducers: {
    initListTodo: (_state, action: PayloadAction<Todo[]>) => {
      return action.payload;
    },
  },
});

export const { initListTodo } = todoSlice.actions;
export default todoSlice.reducer;
