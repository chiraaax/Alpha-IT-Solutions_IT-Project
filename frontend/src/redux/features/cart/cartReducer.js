const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + (action.payload.quantity || 1),
        };
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // If item doesn't exist, add to cart
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: action.payload.quantity || 1 }],
        };
      }

    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.updates.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};

export default cartReducer;


// const initialState = {
//   cartItems: [],
// };

// const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//       case 'ADD_TO_CART':
//           const existingItem = state.cartItems.find(item => item.id === action.payload.id);
          
//           if (existingItem) {
//               return {
//                   ...state,
//                   cartItems: state.cartItems.map(item =>
//                       item.id === action.payload.id
//                           ? { ...item, quantity: item.quantity + 1 }
//                           : item
//                   ),
//               };
//           } else {
//               return {
//                   ...state,
//                   cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
//               };
//           }

//         case "UPDATE_CART_ITEM":
//             return {
//               ...state,
//               cartItems: state.cartItems.map(item =>
//                 item.id === action.payload.id
//                   ? { ...item, quantity: action.payload.updates.quantity }
//                   : item
//               ),
//             };

//       case 'CLEAR_CART':
//           return { ...state, cartItems: [] };

//       default:
//           return state;
//   }
// };

// export default cartReducer;
