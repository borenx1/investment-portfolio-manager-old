import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  Account,
  Asset,
  Journal,
  JournalType,
  JournalColumnRole,
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
    addJournalColumn: (state, action: PayloadAction<{account?: number, index: number, column: ExtraColumn}>) => {
      const { account: accountIndex, index, column } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.journals[index].columns.extra.push(column);
      // Add column to the end of column order
      const extraColumnsLength = account.journals[index].columns.extra.length;
      account.journals[index].columnOrder.push(extraColumnsLength - 1);
    },
    editJournalColumn: (state, action: PayloadAction<{account?: number, index: number, role: JournalColumnRole, column: JournalColumn}>) => {
      // Payload: {account: int?, journalIndex: int, columnRole: String, column: Column}
      const { account: accountIndex, index, role, column } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (typeof role === 'string') {
        // Core column
        // TODO: add predicates for using right column type
        account.journals[index].columns[role] = column as any;
      } else {
        // It is an extra column
        account.journals[index].columns.extra[role] = column as any;
      }
    },
    deleteJournalColumn: (state, action: PayloadAction<{account?: number, journalIndex: number, columnIndex: number}>) => {
      const { account: accountIndex, journalIndex, columnIndex } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      account.journals[journalIndex].columns.extra.splice(columnIndex, 1);
      // Delete column from column order
      // TODO: redo this so that order is retained after role renaming
      const extraColumnsLength = account.journals[journalIndex].columns.extra.length;
      const columnOrderIndex = account.journals[journalIndex].columnOrder.indexOf(extraColumnsLength);
      if (columnOrderIndex !== -1) {
        account.journals[journalIndex].columnOrder.splice(columnOrderIndex, 1);
      }
    },
    editJournalColumnOrder: (state, action: PayloadAction<{account?: number, index: number, columnOrder: JournalColumnRole[]}>) => {
      const { account: accountIndex, index, columnOrder } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account.journals[index] !== undefined) {
        account.journals[index].columnOrder = columnOrder;
      } else {
        console.warn(`editJournalColumnOrder: Invalid index ${index} for column order of length: ${account.journals.length}.`);
      }
    },
  },
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
  addDefaultJournal,
  editJournalSettings,
  deleteJournal,
  addJournalColumn,
  editJournalColumn,
  deleteJournalColumn,
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