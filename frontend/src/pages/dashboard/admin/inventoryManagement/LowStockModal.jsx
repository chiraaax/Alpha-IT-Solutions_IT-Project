import { useState } from "react";
import axios from "axios";

const LowStockModal = ({ lowStockProducts, onClose, onSaveProducts }) => {
  // Local state to track any stock changes.
  const [products, setProducts] = useState(lowStockProducts);
  const [isSaving, setIsSaving] = useState(false);
  // Fixed threshold for displayed stock.
  const threshold = 1;

  // Helper to compute customer-visible stock.
  const getDisplayedStock = (stock) => Math.max(Math.floor(stock / 2), threshold);

  // Increase or decrease stock in local state.
  const handleIncrement = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, stockCount: p.stockCount + 1 } : p
      )
    );
  };

  const handleDecrement = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId && p.stockCount > 1
          ? { ...p, stockCount: p.stockCount - 1 }
          : p
      )
    );
  };

  // Save updates for all products in local state.
  const handleSave = async () => {
    setIsSaving(true);
    // Validate: Ensure each product has stock greater than 5.
    const invalidProducts = products.filter((p) => p.stockCount <= 5);
    if (invalidProducts.length) {
      // Instead of alert, you can rely on the red alert message on each row.
      setIsSaving(false);
      return;
    }
    try {
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          const updateProduct = {
            stockCount: product.stockCount,
            displayedStock: getDisplayedStock(product.stockCount),
            threshold,
          };
          const response = await axios.patch(
            `http://localhost:5000/api/products/${product._id}/inventory`,
            updateProduct
          );
          if (response.status === 200) {
            return response.data;
          }
          return product;
        })
      );
      // Call parent's callback to update inventory management.
      if (typeof onSaveProducts === "function") {
        onSaveProducts(updatedProducts);
      }
      onClose();
      // Automatically refresh the page.
      window.location.reload();
    } catch (error) {
      console.error("Error saving products:", error.message);
      alert("Failed to save updates. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-100 p-6 transform transition-all duration-300 scale-95 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg p-4">
          <h3 className="text-white text-2xl font-bold text-center">Low Stock Alerts</h3>
        </div>
        {/* Modal Content */}
        <div className="mt-4 max-h-80 overflow-y-auto">
          {products.length ? (
            <ul className="space-y-4">
              {products.map((p) => (
                <li key={p._id} className="border-b pb-2">
                  <div className="text-gray-800">
                    <strong>Product Category:</strong> {p.category} <br />
                    <strong>Product ID:</strong> {p._id} <br />
                    <strong>Name:</strong> {p.description} <br />
                    <strong>Stock:</strong> {p.stockCount}{" "}
                    <span className="text-gray-600">
                      (Displayed: {getDisplayedStock(p.stockCount)})
                    </span>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleDecrement(p._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 rounded-md transition-colors"
                      disabled={p.stockCount <= 1}
                    >
                      –
                    </button>
                    <button
                      onClick={() => handleIncrement(p._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {p.stockCount <= 5 && (
                    <p className="mt-1 text-sm font-bold text-red-600">
                      Stock must be greater than 5.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-700">All products are sufficiently stocked.</p>
          )}
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowStockModal;
