import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import accountsReducer from '../features/accounts/accountsSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    accounts: accountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;