import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { registrationReducer } from './slices/registrationSlice';

const store = configureStore({
  reducer: registrationReducer,
  middleware: [...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
