// src/redux/store.js
//this is the redux store
//used to combine reducers and persist the cart slice


// configureStore handles setting up the store with sensible default middleware and settings.
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // persist only the cart slice
};

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; 
import productsApi from './features/products/productsApi';


const store = configureStore({
  reducer: persistedReducer,
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath] : productsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions in serializable check middleware
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
    getDefaultMiddleware().concat(productsApi.middleware),
});

export const persistor = persistStore(store);
export default store;
