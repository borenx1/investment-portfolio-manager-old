import { createSlice } from '@reduxjs/toolkit';
import { account, transaction } from '../../models/Account';

export const accountsSlice = createSlice({
  name: 'transactions',
  initialState: {
    accounts: [],   // Array of accounts
  },
  reducers: {
    addAccount: (state, action) => {
      if (action.payload) {
        state.accounts.push(action.payload);
      } else {
        console.warn(`Attempted to add invalid account: ${action.payload}`);
      }
    },
    addDefaultAccount: (state, action) => {
      const name = action.payload ? String(action.payload) : 'New Account';
      state.accounts.push(account(name));
    },
    addTransaction: (state, action) => {
      // Takes payload: {account: activeAccountIndex, transaction: Tx, journal: Integer}
      const account = state.accounts[action.payload.account];
      const journal = action.payload.journal;
      const transaction = action.payload.transaction;
      account.journals[journal].transactions.push(transaction);
    },
  }
});

// Actions
export const { addAccount, addDefaultAccount, addTransaction } = accountsSlice.actions;

// Selectors
export const selectAccounts = state => state.accounts.accounts;
export const selectActiveAccountObject = state => {
  const accounts = state.accounts.accounts;
  const activeAccount = state.navigation.activeAccount;
  return activeAccount < accounts.length ? accounts[activeAccount] : null;
}
export const selectActiveAccountName = state => {
  const activeAccount = selectActiveAccountObject(state);
  return activeAccount ? activeAccount.name : 'No account selected';
}

export default accountsSlice.reducer;