import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import accountsReducer from '../features/accounts/accountsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer,
  },
});