import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    user: 'New User',       // String or null
  },
  reducers: {
    changeUser: (state, action) => {
      state.page = action.payload ? String(action.payload) : null;
    },
  }
});

// Actions
export const { changeUser } = navigationSlice.actions;

// Selectors
export const selectUser = state => state.navigation.user;

export default navigationSlice.reducer;