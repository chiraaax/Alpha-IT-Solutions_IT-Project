import { useState } from "react";
import CartItem from "../../components/OrderManagement/CartItem";
import Summary from "../../components/OrderManagement/Summary";

const ShoppingCart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "MSI MEG Trident X 12th",
      price: 4349.00,
      quantity: 3,
      image: "/images/msi-trident-x.jpg",
    },
    {
      id: 2,
      name: "MSI MEG Trident X 12th",
      price: 4349.00,
      quantity: 3,
      image: "/images/msi-trident-x.jpg",
    },
  ]);

  const updateQuantity = (id, quantity) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cart.map(item => (
            <CartItem key={item.id} item={item} updateQuantity={updateQuantity} />
          ))}

          {/* Buttons below cart items */}
          <div className="flex space-x-4 mt-6">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none shadow-md">
              Clear Shopping cart
            </button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none shadow-md">
              Continue Shopping
            </button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none shadow-md">
              Update Shopping cart
            </button>
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <Summary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
