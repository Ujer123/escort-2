import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';
import seoReducer from './slices/seoSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    seo: seoReducer,
  },
});
