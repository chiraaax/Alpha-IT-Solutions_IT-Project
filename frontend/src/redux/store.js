// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; 
import productsApi from './features/products/productsApi';


const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath] : productsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export default store;
