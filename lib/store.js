import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';
import seoReducer from './slices/seoSlice';

// Use web storage only on the client; provide a noop storage on the server to avoid warnings
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

let storage;
if (typeof window !== 'undefined') {
  // Dynamically require to avoid SSR import side-effects
  storage = require('redux-persist/lib/storage').default;
} else {
  storage = createNoopStorage();
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['profile', 'seo'], // Only persist these reducers
  blacklist: ['auth'], // Don't persist auth for security
};

const rootReducer = combineReducers({
  profile: profileReducer,
  auth: authReducer,
  seo: seoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = typeof window !== 'undefined' ? persistStore(store) : null;
