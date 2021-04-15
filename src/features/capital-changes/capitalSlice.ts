import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
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
      const newCapitalChange = action.payload;

    },
    addCapitalTransfer: (state, action: PayloadAction<CapitalTransfer>) => {
      const newCapitalTransfer = action.payload;

    },
  },
});

// Actions
export const {
  addCapitalChange,
  addCapitalTransfer,
} = capitalSlice.actions;

// Selectors
export const selectCapitalChanges = (state: RootState) => state.capital.capitalChanges;
export const selectCapitalTransfers = (state: RootState) => state.capital.capitalTransfers;

export default capitalSlice.reducer;