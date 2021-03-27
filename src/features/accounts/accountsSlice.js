import { createSlice } from '@reduxjs/toolkit';
import { account, tradingJournal, incomeJournal, expenseJournal } from '../../models/Account';

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
    // TODO rename to switchAccount
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
    /**
     * Changes the accounting currency. Receives payload {account: activeAccountIndex, currency: asset}.
     * Ignores invalid values for currency.
     */
    changeAccountingCurrency: (state, action) => {
      if (action.payload && 'currency' in action.payload) {
        // Updates the active account if no account provided
        const account = state.accounts[action.payload.account || state.activeAccount];
        // TODO: input validation
        account.settings.accountingCurrency = action.payload.currency;
      } else {
        console.warn(`changeAccountingCurrency: 'currency' not in payload`);
      }
    },
    addAsset: (state, action) => {
      if (action.payload && 'asset' in action.payload) {
        // Updates the active account if no account provided
        const account = state.accounts[action.payload.account || state.activeAccount];
        // TODO: input validation
        account.assets.push(action.payload.asset);
      } else {
        console.warn(`addAsset: 'asset' not in payload`);
      }
    },
    editAsset: (state, action) => {
      if (action.payload && 'asset' in action.payload && 'index' in action.payload) {
        // Updates the active account if no account provided
        const account = state.accounts[action.payload.account || state.activeAccount];
        // TODO: input validation
        account.assets[action.payload.index] = action.payload.asset;
      } else {
        console.warn(`editAsset: 'asset' or 'index' not in payload`);
      }
    },
    deleteAsset: (state, action) => {
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      account.assets.splice(action.payload.index, 1);
    },
    addJournal: (state, action) => {
      // Payload: {account: int?, journal: Journal (except column settings)}
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      let newJournal;
      switch (action.payload.journal.type) {
        case 'trading':
          newJournal = {...tradingJournal(), ...action.payload.journal};
          break;
        case 'income':
          newJournal = {...incomeJournal(), ...action.payload.journal};
          break;
        case 'expense':
          newJournal = {...expenseJournal(), ...action.payload.journal};
          break;
        default:
          console.warn(`addJournal: Invalid journal type: ${action.payload.journal.type}`);
          newJournal = {...tradingJournal(), ...action.payload.journal};
      }
      account.journals.push(newJournal);
    },
    editJournal: (state, action) => {
      // Payload: {account: int?, journalIndex: int, journal: Journal (except column settings)}
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      let journal = account.journals[action.payload.journalIndex];
      account.journals[action.payload.journalIndex] = {...journal, ...action.payload.journal};
    },
    deleteJournal: (state, action) => {
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      account.journals.splice(action.payload.index, 1);
    },
    addJournalColumn: (state, action) => {
      // Payload: {account: int?, journalIndex: int, column: Column}
      const { journalIndex, column } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      account.journals[journalIndex].columns.extra.push(column);
      // Add column to the end of column order
      const extraColumnsLength = account.journals[journalIndex].columns.extra.length;
      account.journals[journalIndex].columnOrder.push(`extra-${extraColumnsLength - 1}`);
    },
    editJournalColumn: (state, action) => {
      // Payload: {account: int?, journalIndex: int, columnRole: String, column: Column}
      const { journalIndex, columnRole, column } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      if (columnRole.slice(0, 5) === 'extra') {
        // It is an extra column
        account.journals[journalIndex].columns.extra[parseInt(columnRole.split('-')[1])] = column;
      } else {
        // Core column
        account.journals[journalIndex].columns[columnRole] = column;
      }
    },
    deleteJournalColumn: (state, action) => {
      // Payload: {account: int?, journalIndex: int, role: string}
      const { journalIndex, role } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      // Determine if deleting a core or extra column
      if (role.slice(0, 5) === 'extra') {
        const columnIndex = parseInt(role.split('-')[1]);
        account.journals[journalIndex].columns.extra.splice(columnIndex, 1);
        // Delete column from column order
        const extraColumnsLength = account.journals[journalIndex].columns.extra.length;
        const columnOrderIndex = account.journals[journalIndex].columnOrder.indexOf(`extra-${extraColumnsLength}`);
        if (columnOrderIndex !== -1) {
          account.journals[journalIndex].columnOrder.splice(columnOrderIndex, 1);
        }
      } else {
        delete account.journals[journalIndex].columns[role];
        // Delete column from column order
        const columnOrderIndex = account.journals[journalIndex].columnOrder.indexOf(role);
        if (columnOrderIndex !== -1) {
          account.journals[journalIndex].columnOrder.splice(columnOrderIndex, 1);
        }
      }
    },
    // Deletes an extra journal column
    deleteJournalExtraColumn: (state, action) => {
      const { journalIndex, columnIndex } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[action.payload.account || state.activeAccount];
      account.journals[journalIndex].columns.extra.splice(columnIndex, 1);
      // Delete column from column order
      const extraColumnsLength = account.journals[journalIndex].columns.extra.length;
      const columnOrderIndex = account.journals[journalIndex].columnOrder.indexOf(`extra-${extraColumnsLength}`);
      if (columnOrderIndex !== -1) {
        account.journals[journalIndex].columnOrder.splice(columnOrderIndex, 1);
      }
    },
    editJournalColumnOrder: (state, action) => {
      // Payload: {account: int?, journalIndex: int, columnOrder: String[]}
      if (action.payload && 'journalIndex' in action.payload && 'columnOrder' in action.payload) {
        // Updates the active account if no account provided
        const account = state.accounts[action.payload.account || state.activeAccount];
        account.journals[action.payload.journalIndex].columnOrder = action.payload.columnOrder;
      } else {
        console.warn(`editJournalColumnOrder: 'journalIndex' or 'columnOrder' not in payload`);
      }
    },
  }
});

// Actions
export const {
  changeAccount,
  addAccount,
  addDefaultAccount,
  addTransaction,
  changeAccountingCurrency,
  addAsset,
  editAsset,
  deleteAsset,
  addJournal,
  editJournal,
  deleteJournal,
  addJournalColumn,
  editJournalColumn,
  deleteJournalColumn,
  deleteJournalExtraColumn,
  editJournalColumnOrder,
} = accountsSlice.actions;

// Selectors
// TODO consider selector errors
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
export const selectActiveAccountAccountingCurrency = state => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.settings.accountingCurrency : null;
}
export const selectActiveAccountAssets = state => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.assets : [];
}
export const selectActiveAccountJournals = state => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.journals : [];
}

export default accountsSlice.reducer;