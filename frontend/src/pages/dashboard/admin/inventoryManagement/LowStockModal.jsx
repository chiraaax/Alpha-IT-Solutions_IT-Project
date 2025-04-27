import { useState } from "react";
import axios from "axios";

const LowStockModal = ({ lowStockProducts, onClose, onSaveProducts }) => {
  // Clone incoming products so we can edit displayedStock
  const [products, setProducts] = useState(
    lowStockProducts.map(p => ({ ...p }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const defaultThreshold = 3;

  // Increase or decrease displayedStock
  const handleIncrement = (id) => {
    setProducts(prev =>
      prev.map(p =>
        p._id === id
          ? { ...p, displayedStock: p.displayedStock + 1 }
          : p
      )
    );
  };
  const handleDecrement = (id) => {
    setProducts(prev =>
      prev.map(p =>
        p._id === id && p.displayedStock > 0
          ? { ...p, displayedStock: p.displayedStock - 1 }
          : p
      )
    );
  };

  // Save via parent callback (which should PATCH /inventory for each)
  const handleSave = async () => {
    setIsSaving(true);
    // Validate against each product's threshold
    const invalid = products.filter(
      p => p.displayedStock <= (p.threshold ?? defaultThreshold)
    );
    if (invalid.length > 0) {
      setIsSaving(false);
      return;
    }
    try {
      // Let parent persist and update its state
      await onSaveProducts(products);
      onClose();
    } catch (err) {
      console.error("Error saving low-stock:", err);
      alert("Failed to save updates; check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-100 p-6 transform transition-all duration-300 scale-95 animate-fadeIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg p-4">
          <h3 className="text-white text-2xl font-bold text-center">
            Low Stock Alerts
          </h3>
        </div>

        {/* List */}
        <div className="mt-4 max-h-80 overflow-y-auto">
          {products.length ? (
            <ul className="space-y-4">
              {products.map(p => (
                <li key={p._id} className="border-b pb-2">
                  <div className="text-gray-800">
                    <strong>Product Category:</strong> {p.category} <br/>
                    <strong>Product ID:</strong> {p._id} <br/>
                    <strong>Name:</strong> {p.description} <br/>
                    <strong>Displayed Stock:</strong> {p.displayedStock}
                  </div>

                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleDecrement(p._id)}
                      disabled={p.displayedStock <= 0 || isSaving}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 rounded-md transition-colors disabled:opacity-50"
                    >
                      –
                    </button>
                    <button
                      onClick={() => handleIncrement(p._id)}
                      disabled={isSaving}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded-md transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {p.displayedStock <= (p.threshold ?? defaultThreshold) && (
                    <p className="mt-1 text-sm font-bold text-red-600">
                      Stock must exceed threshold ({p.threshold ?? defaultThreshold})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-700">
              All products are sufficiently stocked.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowStockModal;
