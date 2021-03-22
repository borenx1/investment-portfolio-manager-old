import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    user: 'New User',       // String or null
    page: 'transactions',   // String or null
  },
  reducers: {
    changePage: (state, action) => {
      state.page = action.payload ? String(action.payload) : null;
    },
  }
});

// Actions
export const { changePage } = navigationSlice.actions;

// Selectors
export const selectPage = state => state.navigation.page;

export default navigationSlice.reducer;