import { createSlice } from '@reduxjs/toolkit';

export const transactionsSlice = createSlice({
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
    addTransaction: (state, action) => {
      // Takes payload: {account: activeAccountIndex, transaction: Tx, txType: Integer}
      const account = state.accounts[action.payload.account];
      const txType = action.payload.txType;
      const transaction = action.payload.transaction;
      account.txTypes[txType].transactions.push(transaction);
    },
  }
});

// Actions
export const { addAccount, addTransaction } = transactionsSlice.actions;

// Selectors
export const selectAccounts = state => state.transactions.accounts;
export const selectActiveAccountObject = state => {
  const accounts = state.transactions.accounts;
  const activeAccount = state.navigation.activeAccount;
  return activeAccount < accounts.length ? accounts[activeAccount] : null;
}
export const selectActiveAccountName = state => {
  const activeAccount = selectActiveAccountObject(state);
  return activeAccount ? activeAccount.name : 'No account selected';
}

export default transactionsSlice.reducer;