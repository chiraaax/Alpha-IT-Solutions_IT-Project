// reducers/cartReducer.js
const initialState = {
    cartItems: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        // Optionally, check if the item already exists in the cart and update quantity if needed
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      case 'UPDATE_CART_ITEM':
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, ...action.payload.updates }
              : item
          ),
        };
      case 'CLEAR_CART':
        return { ...state, cartItems: [] };
      default:
        return state;
    }
  };
  
  export default cartReducer;
  