import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import accountsReducer from '../features/accounts/accountsSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    accounts: accountsReducer,
  },
});