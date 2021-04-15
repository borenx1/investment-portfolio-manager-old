import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { addTransactionOrdered } from '../../helper/functions';
import {
  CapitalChange,
  CapitalTransfer,
} from '../../models/capital';

interface State {
  readonly capitalChanges: CapitalChange[],
  readonly capitalTransfers: CapitalTransfer[],
}

const initialState: State = {
  capitalChanges: [],
  capitalTransfers: [],
};

export const capitalSlice = createSlice({
  name: 'capital',
  initialState: initialState,
  reducers: {
    addCapitalChange: (state, action: PayloadAction<CapitalChange>) => {
      addTransactionOrdered(state.capitalChanges, action.payload);
    },
    editCapitalChange: (state, action: PayloadAction<{index: number, capitalChange: CapitalChange}>) => {
      const { index, capitalChange } = action.payload;
      const oldCapitalChange = state.capitalChanges[index];
      if (oldCapitalChange !== undefined) {
        if (oldCapitalChange.date === capitalChange.date) {
          state.capitalChanges[index] = capitalChange;
        } else {
          state.capitalChanges.splice(index, 1);
          addTransactionOrdered(state.capitalChanges, capitalChange);
        }
      }
    },
    deleteCapitalChange: (state, action: PayloadAction<number>) => {
      state.capitalChanges.splice(action.payload, 1);
    },
    addCapitalTransfer: (state, action: PayloadAction<CapitalTransfer>) => {
      addTransactionOrdered(state.capitalTransfers, action.payload);
    },
    editCapitalTransfer: (state, action: PayloadAction<{index: number, capitalTransfer: CapitalTransfer}>) => {
      const { index, capitalTransfer } = action.payload;
      const oldCapitalTransfer = state.capitalTransfers[index];
      if (oldCapitalTransfer !== undefined) {
        if (oldCapitalTransfer.date === capitalTransfer.date) {
          state.capitalTransfers[index] = capitalTransfer;
        } else {
          state.capitalTransfers.splice(index, 1);
          addTransactionOrdered(state.capitalTransfers, capitalTransfer);
        }
      }
    },
    deleteCapitalTransfer: (state, action: PayloadAction<number>) => {
      state.capitalTransfers.splice(action.payload, 1);
    },
  },
});

// Actions
export const {
  addCapitalChange,
  editCapitalChange,
  deleteCapitalChange,
  addCapitalTransfer,
  editCapitalTransfer,
  deleteCapitalTransfer,
} = capitalSlice.actions;

// Selectors
export const selectCapitalChanges = (state: RootState) => state.capital.capitalChanges;
export const selectCapitalTransfers = (state: RootState) => state.capital.capitalTransfers;

export default capitalSlice.reducer;