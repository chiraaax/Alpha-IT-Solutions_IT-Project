import React, { useState } from "react";

const CartItem = ({ item, updateQuantity }) => {
  const [showBulkOrderMessage, setShowBulkOrderMessage] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const effectivePrice = item.discountPrice ? item.discountPrice : item.price;

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > item.quantity) {
      setShowBulkOrderMessage(true);
      return;
    }
    updateQuantity(item._id || item.id, newQuantity);
  };

  // Start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Dragging movement
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  // Stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-4 items-center border border-gray-700 p-4 rounded shadow-sm bg-gray-900 text-white">
        {item.image && (
          <img
            src={item.image}
            alt={item.description || "Product"}
            className="w-20 h-20 object-cover rounded"
          />
        )}

        <div className="flex-1">
          {item._id && <h4 className="font-bold text-gray-300">ID: {item._id}</h4>}
          {item.description && <p className="text-gray-400">{item.description}</p>}
          {item.displayedStock !== undefined && (
            <p className="text-sm text-gray-500">Stock: {item.displayedStock}</p>
          )}
          {effectivePrice !== undefined && (
            <p className="text-xl font-semibold text-green-400">LKR {effectivePrice}</p>
          )}
        </div>

        {/* Quantity controls */}
        <div>
          <input
            type="number"
            min="1"
            value={item.quantity || 1}
            onChange={handleQuantityChange}
            className="w-16 p-1 border border-gray-600 rounded bg-gray-800 text-white focus:ring focus:ring-green-500"
          />
        </div>
      </div>

      {/* Bulk Order Message Modal (Draggable) */}
      {showBulkOrderMessage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="absolute bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-96 border border-gray-700 cursor-move"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-2xl font-semibold text-red-500">Bulk Order Notice</h3>
            <p className="mt-2 text-gray-300">
              <span>To add more items, please go back and add the product again.</span> <br />
              <b>For <span className="text-yellow-400">bulk orders</span>, please contact the admin directly.</b>
            </p>
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => window.location.href = "/contact"}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-500 transition-all"
              >
                Contact Admin
              </button>
              <button
                onClick={() => setShowBulkOrderMessage(false)}
                className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-500 transition-all"
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
