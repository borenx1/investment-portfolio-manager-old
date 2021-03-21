import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    transactions: transactionsReducer,
  },
});