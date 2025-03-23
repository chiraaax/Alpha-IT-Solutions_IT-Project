import React, { useState } from 'react';

const CartItem = ({ item, updateQuantity }) => {
  const [showBulkOrderMessage, setShowBulkOrderMessage] = useState(false);
  const effectivePrice = item.discountPrice ? item.discountPrice : item.price;

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);

    if (newQuantity > item.quantity) {
      setShowBulkOrderMessage(true);
      return;
    }

    updateQuantity(item._id || item.id, newQuantity);
  };

  return (
    <div className="relative">
      <div className="flex gap-4 items-center border p-4 rounded shadow-sm">
        {item.image && (
          <img
            src={item.image}
            alt={item.description || 'Product'}
            className="w-20 h-20 object-cover"
          />
        )}

        <div className="flex-1">
          {item._id && <h4 className="font-bold">ID: {item._id}</h4>}
          {item.description && <p className="text-gray-700">{item.description}</p>}
          {item.displayedStock !== undefined && (
            <p className="text-sm text-gray-500">Stock: {item.displayedStock}</p>
          )}
          {effectivePrice !== undefined && (
            <p className="text-xl font-semibold">LKR {effectivePrice}</p>
          )}
        </div>

        {/* Quantity controls */}
        <div>
          <input
            type="number"
            min="1"
            value={item.quantity || 1}
            onChange={handleQuantityChange}
            className="w-16 p-1 border rounded"
          />
        </div>
      </div>

      {/* Bulk Order Message Modal */}
      {showBulkOrderMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h3 className="text-xl font-semibold text-red-600">Bulk Order Notice</h3>
            <p className="mt-2 text-gray-700">
              <span>To add more items, please go back and add the product again.</span> <br />
              <b>To place <span className="text-x3 font-semibold">bulk orders</span>, please contact the admin directly.</b>
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => window.location.href = "/contact"}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Contact Admin
              </button>
              <button
                onClick={() => setShowBulkOrderMessage(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
