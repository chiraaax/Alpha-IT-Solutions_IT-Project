// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; 



const store = configureStore({
  reducer: {
    cart: cartReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(),
});

export default store;
