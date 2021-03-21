import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    user: 'New User',       // String or null
    activeAccount: 0,       // Integer
    page: 'transactions',   // String or null
  },
  reducers: {
    changeAccount: (state, action) => {
      state.activeAccount = action.payload ? String(action.payload) : null;
    },
    changePage: (state, action) => {
      state.page = action.payload ? String(action.payload) : null;
    },
  }
});

// Actions
export const { changeAccount, changePage } = navigationSlice.actions;

// Selectors
export const selectActiveAccount = state => state.navigation.activeAccount;
export const selectPage = state => state.navigation.page;

export default navigationSlice.reducer;