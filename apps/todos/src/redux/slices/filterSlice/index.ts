import {
  FilterTodoList,
  GroupBy,
  PriorityBy,
  SortBy,
} from '@/components/todo-list/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FilterTodoList = {
  groupBy: GroupBy.DEFAULT,
  sortBy: SortBy.DEFAULT,
  priority: PriorityBy.DEFAULT,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    resetFilter: (_state, _action: PayloadAction) => {
      return initialState;
    },
    setGroupBy: (state, action: PayloadAction<GroupBy>) => {
      state.groupBy = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setPriorityBy: (state, action: PayloadAction<PriorityBy>) => {
      state.priority = action.payload;
    },
  },
});

export const { resetFilter, setGroupBy, setSortBy, setPriorityBy } =
  filterSlice.actions;
export default filterSlice.reducer;
