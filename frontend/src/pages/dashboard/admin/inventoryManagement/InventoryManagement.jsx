import { useState, useEffect } from "react";
import axios from "axios";

const InventoryProductModal = ({ product, onClose, onProductUpdated }) => {
  // Use product.productFields if needed
  const productTypeFields = product.productFields || [];

  // Set up state – note that description is now read-only.
  const [_id] = useState(product._id);
  const [description] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [discount, setDiscount] = useState(product.discount || 0);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice || product.price);
  const [stockCount, setStockCount] = useState(product.stockCount || 10);
  // Threshold is set to a constant value of 1.
  const threshold = 1;
  const [isLoading, setIsLoading] = useState(false);
  const [adminNotification, setAdminNotification] = useState("");

  // Whenever price or discount change, recalc discountPrice automatically.
  useEffect(() => {
    const discPrice = price - (price * discount) / 100;
    setDiscountPrice(Number(discPrice.toFixed(2)));
  }, [price, discount]);

  // Calculate what the customer sees – only half the actual stock.
  const displayedStock = Math.floor(stockCount / 2);

  // Handle a simulated order: decrease stock by 1 if above the threshold.
  const handleOrder = () => {
    // Check if decreasing stock would make customer-visible stock equal to or below the threshold.
    if (stockCount > 1) {
      const newStock = stockCount - 1;
      setStockCount(newStock);
      // Calculate new displayed stock value.
      const newDisplayedStock = Math.floor(newStock / 2);
      if (newDisplayedStock <= threshold) {
        setAdminNotification("🔔 Low Stock Alert: Customer stock has reached the threshold level.");
      }
    } else {
      alert("Cannot reduce stock below the threshold level.");
    }
  };

  // Save changes (update product inventory on the backend)
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Construct the updated product object.
      const updatedProduct = {
        ...product,
        price,
        discount,
        discountPrice,
        stockCount,
        threshold, // Always 1.
      };
      await axios.put(`/api/products/${product.id}`, updatedProduct);
      onProductUpdated(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Error updating product. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md w-7/12 relative">
        <h3 className="text-2xl font-bold mb-4">Inventory Management</h3>
        
        {/* Admin Notification Banner */}
        {adminNotification && (
          <div className="absolute top-4 right-4 bg-yellow-200 border border-yellow-400 text-yellow-800 px-4 py-2 rounded flex items-center">
            <span className="mr-2">🔔</span>
            <span>{adminNotification}</span>
          </div>
        )}

        {/* Read-only product ID  */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Product ID:</label>
          <input
            type="text"
            value={_id}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
        </div>
        {/* Read-only Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Description:</label>
          <input
            type="text"
            value={description}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Price:</label>
          <input
            type="number"
            value={price}
            readOnly
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Discount */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Calculated Discount Price */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Discount Price:</label>
          <input
            type="number"
            value={discountPrice}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
        </div>

        {/* Stock Count */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Stock Count:</label>
          <input
            type="number"
            value={stockCount}
            onChange={(e) => setStockCount(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Fixed Threshold (read-only) */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Stock Threshold :</label>
          <input
            type="number"
            value={threshold}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
          <small className="text-gray-500">
            Threshold is fixed at 1. When customer-visible stock reaches 1, an alert is triggered.
          </small>
        </div>

        {/* Displayed Stock */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Stock (Customer View):</label>
          <input
            type="number"
            value={displayedStock}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
          <small className="text-gray-500">
            Displayed stock is half of the actual available stock.
          </small>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleOrder}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            disabled={isLoading}
          >
            Simulate Order
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryProductModal;
