import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { registrationReducer } from './slices/registrationSlice';
import { authenticationReducer } from './slices/authenticationSlice';
import { navigationReducer } from './slices/navigationSlice';

const store = configureStore({
  reducer: {
    registration: registrationReducer,
    authentication: authenticationReducer,
    navigation: navigationReducer,
  },
  middleware: [...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
