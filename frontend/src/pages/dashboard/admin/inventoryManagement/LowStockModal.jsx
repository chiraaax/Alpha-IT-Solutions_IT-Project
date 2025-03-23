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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Low Stock Alerts</h3>
        {products.length ? (
          <ul>
            {products.map((p) => (
              <li key={p._id} className="mb-4 border-b pb-2">
                <div>
                  <strong>Product ID:</strong> {p._id} <br />
                  <strong>Name:</strong> {p.description} <br />
                  <strong>Stock:</strong> {p.stockCount} (Displayed:{" "}
                  {getDisplayedStock(p.stockCount)})
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => handleDecrement(p._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md"
                    disabled={p.stockCount <= 1}
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleIncrement(p._id)}
                    className="px-2 py-1 bg-green-600 text-white rounded-md"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>All products are sufficiently stocked.</p>
        )}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
