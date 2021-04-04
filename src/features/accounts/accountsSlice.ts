import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  Account,
  Asset,
  Transaction,
  Journal,
  JournalType,
  JournalColumnRole,
  JournalColumn,
  ExtraColumn,
  createDefaultAccount,
  createDefaultJournal,
  isDateColumn,
  isAssetColumn,
  isBaseAmountColumn,
  isQuoteAmountColumn,
  isPriceColumn,
  isTextColumn,
  isExtraColumn,
} from '../../models/account';

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
    /** Change the active account (-1 for all accounts). Negative numbers are evaluated as -1 (all accounts). */
    switchAccount: (state, action: PayloadAction<number>) => {
      const accountIndex = action.payload;
      state.activeAccount = Math.floor(Math.max(accountIndex, -1));
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    addDefaultAccount: (state, action: PayloadAction<string>) => {
      const name = action.payload || 'New Account';
      state.accounts.push(createDefaultAccount(name));
    },
    addTransaction: (state, action: PayloadAction<{account?: number, journal: number, transaction: Transaction}>) => {
      const { account: accountIndex, journal: journalIndex, transaction } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[journalIndex];
      if (journal !== undefined) {
        // Insert transaction in the correct order
        for (let i = journal.transactions.length; i >= 0; i--) {
          if (i === 0 || new Date(transaction.date) >= new Date(journal.transactions[i-1]!.date)) {
            journal.transactions.splice(i, 0, transaction);
            break;
          }
        }
      } else {
        console.warn(`addTransaction: Journal index ${journalIndex} is out of range for account: ${JSON.stringify(account)}.`);
      }
    },
    editTransaction: (state, action: PayloadAction<{account?: number, journal: number, index: number, transaction: Transaction}>) => {
      // TODO
      console.log('TODO');
    },
    changeAccountingCurrency: (state, action: PayloadAction<{account?: number, currency: Asset}>) => {
      const { account: accountIndex, currency } = action.payload;
      // Updates the active account if no account provided
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined) {
        account.settings.accountingCurrency = currency;
      }
    },
    addAsset: (state, action: PayloadAction<{account?: number, asset: Asset}>) => {
      const { account: accountIndex, asset } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined) {
        account.assets.push(asset);
      }
    },
    editAsset: (state, action: PayloadAction<{account?: number, index: number, asset: Asset}>) => {
      const { account: accountIndex, index, asset } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      // Only edit if the index is valid
      if (account?.assets[index] !== undefined) {
        account.assets[index] = asset;
      }
    },
    deleteAsset: (state, action: PayloadAction<{account?: number, index: number}>) => {
      const { account: accountIndex, index } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined && index >= 0) {
        account.assets.splice(index, 1);
      }
    },
    addJournal: (state, action: PayloadAction<{account?: number, journal: Journal}>) => {
      const { account: accountIndex, journal } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined) {
        account.journals.push(journal);
      }
    },
    addDefaultJournal: (state, action: PayloadAction<{account?: number, name: string, type: JournalType}>) => {
      const { account: accountIndex, name, type } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined) {
        account.journals.push(createDefaultJournal(name, type));
      }
    },
    editJournalSettings: (state, action: PayloadAction<{account?: number, index: number, name: string, type: JournalType}>) => {
      const { account: accountIndex, index, name, type } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[index];
      if (journal !== undefined) {
        account!.journals[index] = {...journal, name: name, type: type};
      } else {
        console.warn(`editJournalSettings: Journal index ${index} is out of range for account: ${JSON.stringify(account)}.`);
      }
    },
    deleteJournal: (state, action: PayloadAction<{account?: number, index: number}>) => {
      const { account: accountIndex, index } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      if (account !== undefined) {
        account.journals.splice(index, 1);
      }
    },
    addJournalColumn: (state, action: PayloadAction<{account?: number, index: number, column: ExtraColumn}>) => {
      const { account: accountIndex, index, column } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[index];
      if (journal !== undefined) {
        journal.columns.extra.push(column);
        // Add column to the end of column order
        const extraColumnsLength = journal.columns.extra.length;
        journal.columnOrder.push(extraColumnsLength - 1);
      }
    },
    editJournalColumn: (state, action: PayloadAction<{account?: number, index: number, role: JournalColumnRole, column: JournalColumn}>) => {
      const { account: accountIndex, index, role, column } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[index];
      if (journal !== undefined) {
        if (typeof role === 'string') {
          // Core column
          if (role === 'date' && isDateColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'base' && isAssetColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'baseAmount' && isBaseAmountColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'quote' && isAssetColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'quoteAmount' && isQuoteAmountColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'price' && isPriceColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'feeBase' && isBaseAmountColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'feeQuote' && isQuoteAmountColumn(column)) {
            journal.columns[role] = column;
          } else if (role === 'notes' && isTextColumn(column)) {
            journal.columns[role] = column;
          } else {
            console.warn(`editJournalColumn: Column does not match core column role: ${role}.`);
          }
        } else {    // Implicit typeof column === 'number'
          if (isExtraColumn(column)) {
            journal.columns.extra[role] = column;
          } else {
            console.warn(`editJournalColumn: Column is not an ExtraColumn for role: ${role}.`);
          }
        }
      }
    },
    deleteJournalColumn: (state, action: PayloadAction<{account?: number, journalIndex: number, columnIndex: number}>) => {
      const { account: accountIndex, journalIndex, columnIndex } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[journalIndex];
      if (journal !== undefined) {
        if (journal.columns.extra[columnIndex] !== undefined) {
          journal.columns.extra.splice(columnIndex, 1);
          // Delete column from column order. The numeric JournalColumnRoles cascade down to preserve the column order after deletion.
          const extraColumnsLength = journal.columns.extra.length;
          const deletedColIndex = journal.columnOrder.indexOf(columnIndex);
          if (deletedColIndex !== -1) {
            journal.columnOrder.splice(deletedColIndex, 1);
          }
          for (let i = columnIndex + 1; i <= extraColumnsLength; i++) {
            const colIndex = journal.columnOrder.indexOf(i);
            if (colIndex !== -1) {
              journal.columnOrder[colIndex] = i - 1;
            }
          }
        } else {
          console.warn(`deleteJournalColumn: Invalid column selectors journalIndex: ${journalIndex} and columnIndex: ${columnIndex}.`);
        }
      }
    },
    editJournalColumnOrder: (state, action: PayloadAction<{account?: number, index: number, columnOrder: JournalColumnRole[]}>) => {
      const { account: accountIndex, index, columnOrder } = action.payload;
      const account = state.accounts[accountIndex ?? state.activeAccount];
      const journal = account?.journals[index];
      if (journal !== undefined) {
        journal.columnOrder = columnOrder;
      } else {
        console.warn(`editJournalColumnOrder: Journal index ${index} is out of range for account: ${JSON.stringify(account)}.`);
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
/**
 * Get the assets (excluding base currency) of the active account.
 */
export const selectActiveAccountAssets = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.assets : [];
}
/**
 * Get the accounting currency and assets of the active account.
 */
export const selectActiveAccountAssetsAll = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? [activeAccount.settings.accountingCurrency, ...activeAccount.assets] : [];
}
export const selectActiveAccountJournals = (state: RootState) => {
  const activeAccount = selectActiveAccount(state);
  return activeAccount ? activeAccount.journals : [];
}

export default accountsSlice.reducer;