import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

import budgetReducer from './slices/budgetSlice'
import uiReducer from './slices/uiSlice'
import aiReducer from './slices/aiSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['budget', 'ui'], // Only persist these reducers
}

const rootReducer = combineReducers({
  budget: budgetReducer,
  ui: uiReducer,
  ai: aiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
