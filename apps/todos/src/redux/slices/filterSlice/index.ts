import {
  Direction,
  FilterTodoList,
  GroupBy,
  PriorityBy,
  SortBy,
  View,
} from '@/components/todo-list/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FilterTodoList = {
  groupBy: GroupBy.DEFAULT,
  sortBy: SortBy.DEFAULT,
  priority: PriorityBy.DEFAULT,
  direction: Direction.ASCENDING,
  view: View.LIST,
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
    setDirection: (state, action: PayloadAction<Direction>) => {
      state.direction = action.payload;
    },
    setView: (state, action: PayloadAction<View>) => {
      state.view = action.payload;
    },
  },
});

export const {
  resetFilter,
  setGroupBy,
  setSortBy,
  setPriorityBy,
  setDirection,
  setView,
} = filterSlice.actions;
export default filterSlice.reducer;
