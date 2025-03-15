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
          <div className="flex space-x-6 mt-6">
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none shadow-md">
              Clear Shopping cart
            </button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none shadow-md">
              Continue Shopping
            </button>
            <div className="flex space-x-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none shadow-md">
                Update Shopping cart
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <Summary cart={cart} />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        {/* Input Field */}
        <input type="text"
              placeholder="Enter your query..."
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Contact Us Button */}
        <button
          onClick={() => window.location.href = "/contact"}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
