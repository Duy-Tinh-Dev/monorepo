import { Project } from '@/components/sidebar/sidebar-project/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  listProject: Project[] | null;
  projectSelected: Project | null;
} = {
  listProject: null,
  projectSelected: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    initListProject: (state, action: PayloadAction<Project[]>) => {
      state.listProject = action.payload;
    },

    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.projectSelected = action.payload;
    },
    
    updateProject: (state, action: PayloadAction<Project>) => {
      if (state.listProject) {
        state.listProject = state.listProject.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
      }
    },
  },
});

export const { initListProject, selectProject, updateProject } =
  projectSlice.actions;
export default projectSlice.reducer;
