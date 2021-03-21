import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    account: null,        // String or null
    page: 'transactions', // String or null
    tab: 0,               // Integer
  },
  reducers: {
    changeAccount: (state, action) => {
      state.account = action.payload ? String(action.payload) : null;
    },
    changePage: (state, action) => {
      state.page = action.payload ? String(action.payload) : null;
    },
    changeTab: (state, action) => {
      state.tab = parseInt(action.payload) || 0;
    },
  }
});

// Actions
export const { changeAccount, changePage, changeTab } = navigationSlice.actions;

// Selectors
export const selectAccount = state => state.naviation.account;
export const selectPage = state => state.naviation.page;
export const selectTab = state => state.naviation.tab;

export default navigationSlice.reducer;