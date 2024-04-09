import { Todo, ToggleDetail } from '@/components/todo-list/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TodoDetail {
  isCommentModal: boolean;
  todoDetail: Todo;
  indexTodoDetail: number;
  isOpenModalDetail: boolean;
  listTodoModal: Todo[];
}

const initialState: TodoDetail = {
  isCommentModal: false,
  todoDetail: {} as Todo,
  indexTodoDetail: 0,
  isOpenModalDetail: false,
  listTodoModal: [],
};

const todoDetailSlice = createSlice({
  name: 'todoDetail',
  initialState,
  reducers: {
    setCommentDetail: (state, action: PayloadAction<boolean>) => {
      state.isCommentModal = action.payload;
    },
    setIndexTodoDetail: (state, action: PayloadAction<number>) => {
      state.indexTodoDetail = action.payload;
    },
    setTodoDetail: (state, action: PayloadAction<Todo>) => {
      state.todoDetail = action.payload;
    },
    nextDetailTodo: (state) => {
      const nextIndex = state.indexTodoDetail + 1;
      state.todoDetail = state.listTodoModal[nextIndex];
      state.indexTodoDetail = nextIndex;
    },
    previousDetailTodo: (state) => {
      const preIndex = state.indexTodoDetail - 1;
      state.todoDetail = state.listTodoModal[preIndex];
      state.indexTodoDetail = preIndex;
    },
    toggleModalDetail: (state, action: PayloadAction<ToggleDetail>) => {
      const { todo, index, isComment } = action.payload;
      state.todoDetail = todo;
      state.indexTodoDetail = index ?? 0;
      state.isCommentModal = !!isComment;
      state.isOpenModalDetail = true;
    },

    setIsOpenModalDetail: (state, action: PayloadAction<boolean>) => {
      state.isOpenModalDetail = action.payload;
    },

    setListTodoModal: (state, action: PayloadAction<Todo[]>) => {
      state.listTodoModal = action.payload;
    },
  },
});

export const {
  setCommentDetail,
  setIndexTodoDetail,
  setTodoDetail,
  nextDetailTodo,
  previousDetailTodo,
  toggleModalDetail,
  setIsOpenModalDetail,
  setListTodoModal,
} = todoDetailSlice.actions;

export default todoDetailSlice.reducer;
