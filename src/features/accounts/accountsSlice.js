import { createSlice } from '@reduxjs/toolkit';
import { account, transaction } from '../../models/Account';

export const accountsSlice = createSlice({
  name: 'transactions',
  initialState: {
    accounts: [],       // Array of accounts
    activeAccount: 0,   // Integer
  },
  reducers: {
    /**
     * Change the active account (-1 for all accounts). Receives an index from the payload. Invalid values
     * are evaluated as 0. Negative numbers are evaluated as -1 (all accounts).
     */
    changeAccount: (state, action) => {
      const accountIndex = parseInt(action.payload);
      state.activeAccount = accountIndex ? Math.max(accountIndex, -1) : 0;
    },
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
      // Takes payload: {account: activeAccountIndex, transaction: Tx, journal: journalIndex}
      const account = state.accounts[action.payload.account || state.activeAccount];
      const journal = action.payload.journal;
      const transaction = action.payload.transaction;
      account.journals[journal].transactions.push(transaction);
    },
  }
});

// Actions
export const { changeAccount, addAccount, addDefaultAccount, addTransaction } = accountsSlice.actions;

// Selectors
export const selectAccounts = state => state.accounts.accounts;
export const selectActiveAccountIndex = state => state.accounts.activeAccount;
export const selectActiveAccount = state => {
  const accounts = selectAccounts(state);
  const activeAccount = selectActiveAccountIndex(state);
  return activeAccount < accounts.length ? accounts[activeAccount] : null;
}
export const selectActiveAccountName = state => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.name : 'No account selected';
}

export default accountsSlice.reducer;