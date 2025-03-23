import React from 'react';

const CartItem = ({ item, updateQuantity }) => {
  // Choose discountPrice if available; otherwise, use price.
  const effectivePrice = item.discountPrice ? item.discountPrice : item.price;

  return (
    <div className="flex gap-4 items-center border p-4 rounded shadow-sm">
      {/* Product Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.description || 'Product'}
          className="w-20 h-20 object-cover"
        />
      )}
      
      <div className="flex-1">
        {/* Display Product ID */}
        {item._id && <h4 className="font-bold">ID: {item._id}</h4>}
        {/* Product Description */}
        {item.description && <p className="text-gray-700">{item.description}</p>}
        {/* Displayed Stock */}
        {item.displayedStock !== undefined && (
          <p className="text-sm text-gray-500">Stock: {item.displayedStock}</p>
        )}
        {/* Price */}
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
          onChange={(e) =>
            updateQuantity(item._id || item.id, parseInt(e.target.value, 10))
          }
          className="w-16 p-1 border rounded"
        />
      </div>
    </div>
  );
};

export default CartItem;
