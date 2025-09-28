import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import propertySlice from './propertySlice';
import notificationSlice from './notificationSlice';

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['properties', 'notifications'] // Persist properties and notifications
};

const rootReducer = combineReducers({
  properties: propertySlice,
  notifications: notificationSlice,
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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
