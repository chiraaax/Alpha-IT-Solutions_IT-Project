// redux/features/cart/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
  customerOrders: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Make sure `action.payload` includes a `specs` array!
      const newItem = {
        ...action.payload,
        cartId: uuidv4(),
        quantity: 1,
        specs: action.payload.specs || [],   // ← default to empty array
      };
      state.products.push(newItem);

      // Recalculate
      state.selectedItems = setSelectedItems(state);
      state.totalPrice   = setTotalPrice(state);
      state.tax          = setTax(state);
      state.grandTotal   = setGrandTotal(state);
    },

    updateQuantity: (state, action) => {
      state.products = state.products.map(product => {
        if (product.cartId === action.payload.cartId) {
          const qtyChange = action.payload.type === 'increment' ? 1 :
                            action.payload.type === 'decrement' && product.quantity > 1 ? -1 : 0;
          return {
            ...product,
            quantity: product.quantity + qtyChange,
            // specs stays intact here
          };
        }
        return product;
      });

      // Recalculate
      state.selectedItems = setSelectedItems(state);
      state.totalPrice   = setTotalPrice(state);
      state.tax          = setTax(state);
      state.grandTotal   = setGrandTotal(state);
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        product => product.cartId !== action.payload.cartId
      );
      state.selectedItems = setSelectedItems(state);
      state.totalPrice   = setTotalPrice(state);
      state.tax          = setTax(state);
      state.grandTotal   = setGrandTotal(state);
    },

    clearCart: (state) => {
      state.products    = [];
      state.selectedItems = 0;
      state.totalPrice   = 0;
      state.tax          = 0;
      state.grandTotal   = 0;
    },

    addOrder: (state) => {
      state.customerOrders.push({
        id:    uuidv4(),
        date:  new Date().toLocaleString(),
        items: state.products.map(p => ({
          ...p,
          // cart-specific fields like cartId can be stripped if not needed
        })),
        total: state.grandTotal,
      });
      // Then clear
      state.products    = [];
      state.selectedItems = 0;
      state.totalPrice   = 0;
      state.tax          = 0;
      state.grandTotal   = 0;
    },
  },
});

// Utility recalculators
export const setSelectedItems = state =>
  state.products.reduce((sum, p) => sum + p.quantity, 0);

export const setTotalPrice = state =>
  state.products.reduce(
    (sum, p) =>
      sum + p.quantity * (p.discountPrice ?? p.price),
    0
  );

export const setTax = state =>
  setTotalPrice(state) * state.taxRate;

export const setGrandTotal = state =>
  setTotalPrice(state) + setTax(state);

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  addOrder
} = cartSlice.actions;

export default cartSlice.reducer;
