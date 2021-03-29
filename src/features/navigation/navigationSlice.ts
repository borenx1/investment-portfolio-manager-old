import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface State {
  user: string;
}

const initialState: State = {
  user: 'New User',
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

// Actions
export const { changeUser } = navigationSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.navigation.user;

export default navigationSlice.reducer;