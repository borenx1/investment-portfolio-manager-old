import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../navigationSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
  },
});