// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; 
import productsApi from './features/products/productsApi';
import authAPi from './features/auth/authApi';
import authReducer from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    [authAPi.reducerPath] : authAPi.reducer, 
     auth : authReducer,
    [productsApi.reducerPath] : productsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPi.middleware, productsApi.middleware),
});

export default store;
