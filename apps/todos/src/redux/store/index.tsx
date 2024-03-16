import { configureStore } from '@reduxjs/toolkit';
import todoSlice from '../slices/todoSlice';
import filterSlice from '../slices/filterSlice';

const store = configureStore({
  reducer: {
    todoSlice,
    filterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
