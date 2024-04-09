import { SearchTodo } from '@/components/todo-list/types';
import { keyLocalStorage } from '@/constants';
import { getDataFromLocalStorage } from '@/utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: SearchTodo = <SearchTodo>(
  getDataFromLocalStorage(keyLocalStorage.searchTodo)
) ?? {
  listIdTodoSearchHistory: [],
  listIdTodoSearchCurrent: [],
};

const searchTodoSlice = createSlice({
  name: 'searchTodo',
  initialState,
  reducers: {
    addIdTodoHistory: (state, action: PayloadAction<number>) => {
      const newId = action.payload;
      const index = state.listIdTodoSearchHistory.findIndex(
        (id) => id === newId
      );
      if (index === -1) {
        state.listIdTodoSearchHistory.push(newId);
      }
    },

    deleteIdTodoHistory: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        listIdTodoSearchHistory: state.listIdTodoSearchHistory.filter(
          (id) => id !== action.payload
        ),
      };
    },

    setListIdTodoSearchHistory: (state, action: PayloadAction<number[]>) => {
      state.listIdTodoSearchHistory = action.payload;
    },

    setListIdTodoSearchCurrent: (state, action: PayloadAction<number[]>) => {
      state.listIdTodoSearchCurrent = action.payload;
    },
  },
});

export const {
  addIdTodoHistory,
  deleteIdTodoHistory,
  setListIdTodoSearchCurrent,
  setListIdTodoSearchHistory,
} = searchTodoSlice.actions;

export default searchTodoSlice.reducer;
