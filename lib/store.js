import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
  },
});
