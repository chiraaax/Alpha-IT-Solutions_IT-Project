import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const InventoryProductModal = ({ product, onClose, onProductUpdated }) => {
  // Read-only fields.
  const [_id] = useState(product._id);
  const [description] = useState(product.description);
  const [price] = useState(product.price);

  // Editable fields.
  const [discount, setDiscount] = useState(product.discount || 0);
  const [discountPrice, setDiscountPrice] = useState(
    product.discountPrice || product.price
  );
  const [stockCount, setStockCount] = useState(product.stockCount || 10);

  // Error and modal states.
  const [discountError, setDiscountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminNotification, setAdminNotification] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Notification threshold: if stockCount is 5 or below, trigger alert.
  const notificationThreshold = 5;

  // Helper: compute customer-visible stock.
  // Even if stockCount is low, displayed stock never shows zero.
  const getDisplayedStock = (stock) => Math.max(Math.floor(stock / 2), 1);

  // Recalculate discount price on discount or price changes.
  useEffect(() => {
    const discPrice = price - (price * discount) / 100;
    setDiscountPrice(Number(discPrice.toFixed(2)));
  }, [price, discount]);

  // Computed displayed stock.
  const computedDisplayedStock = getDisplayedStock(stockCount);

  // Trigger admin notification when stockCount is 5 or below.
  const checkNotification = (newStock) => {
    if (newStock <= notificationThreshold) {
      setAdminNotification("🔔 Low Stock Alert: Stock count is 5 or less.");
    } else {
      setAdminNotification("");
    }
  };

  // Handle a simulated order: decrease stock by 1 and check notification.
  const handleOrder = () => {
    if (stockCount > 1) {
      const newStock = stockCount - 1;
      setStockCount(newStock);
      checkNotification(newStock);
    } else {
      alert("Cannot reduce stock below the minimum allowed value.");
    }
  };

  // Increment and decrement handlers.
  const incrementStock = () => {
    const newStock = stockCount + 1;
    setStockCount(newStock);
    checkNotification(newStock);
  };

  const decrementStock = () => {
    if (stockCount > 1) {
      const newStock = stockCount - 1;
      setStockCount(newStock);
      checkNotification(newStock);
    } else {
      alert("Stock cannot be reduced further.");
    }
  };

  // Save changes: update product inventory on the backend.
const handleSave = async (e) => {
  e.preventDefault();
  // Prevent saving if discountError exists.
  if (discountError) return;
  setIsLoading(true);
  try {
    const updateProduct = {
      discount,
      discountPrice,
      stockCount,
      // The API can store the threshold for internal reference if needed.
      notificationThreshold,
      displayedStock: getDisplayedStock(stockCount),
    };

    const response = await axios.patch(
      `http://localhost:5000/api/products/${_id}/inventory`,
      updateProduct
    );

    if (response.status === 200) {
      // Display a native alert box on successful update.
      alert("Product inventory updated successfully!");
      if (typeof onProductUpdated === "function") {
        onProductUpdated(response.data);
      } else {
        console.warn("onProductUpdated is not a function.");
      }
      // Close the modal immediately after showing the alert.
      onClose();
    }
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    alert("Error updating product inventory. Check console for details.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
        <div className="bg-white p-8 rounded-md w-7/12 relative">
          <h3 className="text-2xl font-bold mb-4">Inventory Management</h3>

          {/* Admin Notification Banner */}
          {adminNotification && (
            <div className="absolute top-4 right-4 bg-yellow-200 border border-yellow-400 text-yellow-800 px-4 py-2 rounded flex items-center">
              <span className="mr-2">🔔</span>
              <span>{adminNotification}</span>
            </div>
          )}

          {/* Read-only Product ID */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Product ID:
            </label>
            <input
              type="text"
              value={_id}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          {/* Read-only Description */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Description:
            </label>
            <input
              type="text"
              value={description}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Price (Read-only) */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Price:
            </label>
            <input
              type="number"
              value={price}
              readOnly
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Discount (%):
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => {
                const newDiscount = Number(e.target.value);
                if (newDiscount < 0) {
                  setDiscountError("Discount cannot be less than 0");
                } else {
                  setDiscountError("");
                  setDiscount(newDiscount);
                }
              }}
              className="w-full p-2 border rounded-md"
            />
            {discountError && (
              <p className="mt-1 text-red-500 text-sm">{discountError}</p>
            )}
          </div>

          {/* Calculated Discount Price (Read-only) */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Discount Price:
            </label>
            <input
              type="number"
              value={discountPrice}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Stock Count with Plus/Minus Buttons */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Stock Count:
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementStock}
                className="px-2 py-1 bg-red-600 text-white rounded-md"
                disabled={stockCount <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => {
                  const newVal = Number(e.target.value);
                  setStockCount(newVal);
                  checkNotification(newVal);
                }}
                className="w-20 p-2 border rounded-md text-center"
              />
              <button
                onClick={incrementStock}
                className="px-2 py-1 bg-green-600 text-white rounded-md"
              >
                +
              </button>
            </div>
          </div>

          {/* Notification Threshold Info (Read-only) */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Notification Threshold:
            </label>
            <input
              type="number"
              value={notificationThreshold}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
            <small className="text-gray-500">
              A low-stock alert is triggered when stock count is 5 or less.
            </small>
          </div>

          {/* Displayed Stock (Customer View - Read-only) */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Stock (Customer View):
            </label>
            <input
              type="number"
              value={computedDisplayedStock}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
            <small className="text-gray-500">
              Displayed stock is half of the actual available stock (minimum 1).
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
              disabled={isLoading || discountError}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal as a pop-up alert box */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-20 z-40"></div>
          <div className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white p-8 rounded-md shadow-lg border">
              <h3 className="text-2xl font-bold mb-4">Success</h3>
              <p>Product inventory updated successfully!</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

InventoryProductModal.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func,
};

InventoryProductModal.defaultProps = {
  onProductUpdated: () => {},
};

export default InventoryProductModal;
