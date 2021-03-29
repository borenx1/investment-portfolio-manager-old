import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  Account,
  Asset,
  Journal,
  JournalType,
  JournalColumnSet,
  JournalColumn,
  ExtraColumn,
  createDefaultAccount,
  createDefaultJournal,
} from '../../models/Account';

interface State {
  readonly accounts: Account[],
  readonly activeAccount: number,
}

const initialState: State = {
  accounts: [],
  activeAccount: 0,
};

export const accountsSlice = createSlice({
  name: 'transactions',
  initialState: initialState,
  reducers: {
    /**
     * Change the active account (-1 for all accounts). Negative numbers are evaluated as -1 (all accounts).
     */
    switchAccount: (state, action: PayloadAction<number>) => {
      const accountIndex = action.payload;
      state.activeAccount = Math.max(accountIndex, -1);
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    addDefaultAccount: (state, action: PayloadAction<string>) => {
      const name = action.payload || 'New Account';
      state.accounts.push(createDefaultAccount(name));
    },
    addTransaction: (state, action) => {
      // Takes payload: {account: activeAccountIndex, transaction: Tx, journal: journalIndex}
      const account = state.accounts[action.payload.account || state.activeAccount];
      const journal = action.payload.journal;
      const transaction = action.payload.transaction;
      account.journals[journal].transactions.push(transaction);
    },
    changeAccountingCurrency: (state, action: PayloadAction<{account?: number, currency: Asset}>) => {
      const { account: accountIndex, currency } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.settings.accountingCurrency = currency;
    },
    addAsset: (state, action: PayloadAction<{account?: number, asset: Asset}>) => {
      const { account: accountIndex, asset } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.assets.push(asset);
    },
    editAsset: (state, action: PayloadAction<{account?: number, index: number, asset: Asset}>) => {
      const { account: accountIndex, index, asset } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      // Only edit if the index is valid
      if (account.assets[index] !== undefined) {
        account.assets[index] = asset;
      } else {
        console.warn(`editAsset: Invalid index ${index} of assets array of length ${account.assets.length}.`);
      }
    },
    deleteAsset: (state, action: PayloadAction<{account?: number, index: number}>) => {
      const { account: accountIndex, index } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.assets.splice(index, 1);
    },
    addJournal: (state, action: PayloadAction<{account?: number, journal: Journal}>) => {
      // Payload: {account: int?, journal: Journal (except column settings)}
      const { account: accountIndex, journal } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.journals.push(journal);
    },
    addDefaultJournal: (state, action: PayloadAction<{account?: number, name: string, type: JournalType}>) => {
      const { account: accountIndex, name, type } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.journals.push(createDefaultJournal(name, type));
    },
    editJournalSettings: (state, action: PayloadAction<{account?: number, index: number, name: string, type: JournalType}>) => {
      const { account: accountIndex, index, name, type } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account.journals[index] !== undefined) {
        const journal = account.journals[index];
        account.journals[index] = {...journal, name: name, type: type};
      } else {
        console.warn(`editJournalSettings: Invalid index ${index} of journals array of length ${account.journals.length}.`);
      }
    },
    deleteJournal: (state, action: PayloadAction<{account?: number, index: number}>) => {
      const { account: accountIndex, index } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.journals.splice(index, 1);
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
    editJournalColumn: (state, action: PayloadAction<{account?: number, index: number, role: keyof JournalColumnSet, column: JournalColumn}>) => {
      // Payload: {account: int?, journalIndex: int, columnRole: String, column: Column}
      const { account: accountIndex, index, role, column } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (role.slice(0, 5) === 'extra') {
        // It is an extra column
        account.journals[index].columns.extra[parseInt(role.split('-')[1])] = column;
      } else {
        // Core column
        // TODO: add predicates for using right column type
        account.journals[index].columns[role] = column as any;
      }
    },
    deleteJournalColumn: (state, action: PayloadAction<{account?: number, index: number, role: keyof JournalColumnSet}>) => {
      // Payload: {account: int?, journalIndex: int, role: string}
      const { account: accountIndex, index, role } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      // Determine if deleting a core or extra column
      if (role.slice(0, 5) === 'extra') {
        const columnIndex = parseInt(role.split('-')[1]);
        account.journals[index].columns.extra.splice(columnIndex, 1);
        // Delete column from column order
        const extraColumnsLength = account.journals[index].columns.extra.length;
        const columnOrderIndex = account.journals[index].columnOrder.indexOf(`extra-${extraColumnsLength}`);
        if (columnOrderIndex !== -1) {
          account.journals[index].columnOrder.splice(columnOrderIndex, 1);
        }
      } else {
        // TODO: do better
        delete account.journals[index].columns[role];
        // Delete column from column order
        const columnOrderIndex = account.journals[index].columnOrder.indexOf(role);
        if (columnOrderIndex !== -1) {
          account.journals[index].columnOrder.splice(columnOrderIndex, 1);
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
  switchAccount,
  addAccount,
  addDefaultAccount,
  addTransaction,
  changeAccountingCurrency,
  addAsset,
  editAsset,
  deleteAsset,
  addJournal,
  editJournalSettings,
  deleteJournal,
  addJournalColumn,
  editJournalColumn,
  deleteJournalColumn,
  deleteJournalExtraColumn,
  editJournalColumnOrder,
} = accountsSlice.actions;

// Selectors
// TODO consider selector errors
export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectActiveAccountIndex = (state: RootState) => state.accounts.activeAccount;
export const selectActiveAccount = (state: RootState) => {
  const accounts = selectAccounts(state);
  const activeAccount = selectActiveAccountIndex(state);
  return activeAccount < accounts.length ? accounts[activeAccount] : null;
}
export const selectActiveAccountName = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.name : 'No account selected';
}
export const selectActiveAccountAccountingCurrency = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.settings.accountingCurrency : null;
}
export const selectActiveAccountAssets = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.assets : [];
}
export const selectActiveAccountJournals = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.journals : [];
}

export default accountsSlice.reducer;