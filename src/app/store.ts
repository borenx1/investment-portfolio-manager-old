import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import accountsReducer from '../features/accounts/accountsSlice';
import capitalReducer from '../features/capital-changes/capitalSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    accounts: accountsReducer,
    capital: capitalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;