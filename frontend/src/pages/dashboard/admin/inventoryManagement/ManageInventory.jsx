import { useState, useEffect } from "react";
import axios from "axios";
import InventoryProductModal from "./InventoryManagement";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

// storage helpers...
const STORAGE_KEY = "orderStatusMap";
const loadStatusMap = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
const saveStatusMap = (map) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

// Modal component to manage order statuses
const OrdersModal = ({ orders, onClose, onStatusChange }) => {
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

// outside your component, or at top of OrdersModal
const FULFILLED = ["Approved", "Handovered"];

function adjustStockForOrder(order, prevStatus, newStatus) {
  const wasFulfilled    = FULFILLED.includes(prevStatus);
  const willBeFulfilled = FULFILLED.includes(newStatus);

  // no change if you didn't cross the threshold
  if (wasFulfilled === willBeFulfilled) return;

  // moving into fulfilled? decrease (–); moving out? increase (+)
  const factor = willBeFulfilled ? -1 : +1;

  order.items.forEach(item => {
    const lineQty = item.quantity || 1;

    if (item.itemType === "product") {
      updateProductStock(item.itemId, factor * lineQty);
    }
    else if (item.itemType === "prebuild") {
      item.specs.forEach(spec => {
        // if your spec object also carries its own quantity:
        const specQty = spec.quantity || 1;
        updateProductStock(spec._id, factor * lineQty * specQty);
      });
    }
  });
}

// helper to DRY-up your setProducts call
function updateProductStock(productId, delta) {
  setProducts(prev =>
    prev.map(p =>
      p._id === productId
        ? { ...p, stockCount: (p.stockCount || 0) + delta }
        : p
    )
  );
}

  return (
    // Backdrop: click here to close
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal content: stop click from bubbling, add scroll */}
      <div
        className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Orders</h3>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No orders to display
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                       // compute the sum of all item quantities in this order
                       const totalQty = (order.items || [])
                         .reduce((sum, item) => sum + (item.quantity || 0), 0);
                
                        return (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="border p-2">{order._id}</td>
                            <td className="border p-2">{order.customerId}</td>
                            <td className="border p-2">
                              {new Date(order.createdAt).toLocaleString()}
                            </td>
                           
                            <td className="border p-2">{order.totalAmount}</td>
                            <td className="border p-2">{totalQty}</td>
                            <td className="border p-2">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  onStatusChange(order._id, e.target.value)
                                }
                                className="p-1 border rounded-md"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Handovered">Handovered</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.status === 200) {
        setProducts(response.data.map(p => ({
          ...p,
          // half of real stock, rounded down
          displayedStock: Math.floor((p.stockCount || 0) / 2),
          // how many times we've decremented displayedStock
          displayedReductions: 0,
          // toggles our red-warning row
          lowStockWarning: false,
          // so we only email once
          notificationSent: false,
        })));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders when modal opens
  useEffect(() => {
    if (showOrdersModal) {
      axios
        .get("http://localhost:5000/api/successorder/all")
        .then((res) => {
          const fetched = Array.isArray(res.data) ? res.data : res.data.orders;
          const savedMap = loadStatusMap();

          // merge saved statuses
          const withSaved = fetched.map((o) => ({
            ...o,
            status: savedMap[o._id] || o.status,
          }));

          setOrders(withSaved);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setOrders([]);
        });
    }
  }, [showOrdersModal]);

  // Handle order status changes and adjust stock
  const handleStatusChange = (orderId, newStatus) => {
    // 1) Persist the new status
    const statusMap = loadStatusMap();
    statusMap[orderId] = newStatus;
    saveStatusMap(statusMap);
  
    // 2) Update in-memory orders & adjust stock
    setOrders(prev =>
      prev.map(o => {
        if (o._id !== orderId) return o;
        
        const prevStatus = o.status;
        const updated = { ...o, status: newStatus };
        
        // adjust stock based on that transition
        adjustStockForOrder(updated, prevStatus, newStatus);
        return updated;
      })
    );
  };

  const adjustStockForOrder = (order, prevStatus, newStatus) => {
    const toDecrease = (newStatus === "Approved" || newStatus === "Handovered") && prevStatus === "Pending";
    const toIncrease = newStatus === "Rejected" && (prevStatus === "Approved" || prevStatus === "Handovered");
    if (!toDecrease && !toIncrease) return;
    const factor = toDecrease ? -1 : 1;

    (order.items || []).forEach(item => {
      if (item.itemType === "product") {
        setProducts(prev =>
          prev.map(p =>
            p._id === item.itemId
              ? { ...p, stockCount: (p.stockCount || 0) + factor * item.quantity }
              : p
          )
        );
      } else if (item.itemType === "prebuild") {
        (item.specs || []).forEach(spec => {
          setProducts(prev =>
            prev.map(p =>
              p._id === spec._id
                ? { ...p, stockCount: (p.stockCount || 0) + factor * item.quantity }
                : p
            )
          );
        });
      }
    });
  };

  // Simulate order for product table
  const simulateOrder = async (product) => {
    try {
      // still fire your back-end order if you like
      const response = await axios.post("http://localhost:5000/api/successorder", {
        orderId: "ORDER123",
        items: [{ itemId: product._id, itemType: "product", quantity: 1, specs: [] }]
      });

      if (response.status === 200) {
        setProducts(prev =>
          prev.map(p => {
            if (p._id !== product._id) return p;

            const newDisplayedReductions = p.displayedReductions + 1;
            const newDisplayedStock      = Math.max(p.displayedStock - 1, 0);

            // only every two displayed hits do we knock down real stock
            let newStockCount = p.stockCount;
            if (newDisplayedReductions % 2 === 0) {
              newStockCount = Math.max(p.stockCount - 1, 0);
            }

            let lowStockWarning = p.lowStockWarning;
            let notificationSent = p.notificationSent;

            // when displayedStock hits 1, fire warning + email + collapse real stock to 1
            if (newDisplayedStock === 1 && !notificationSent) {
              lowStockWarning = true;
              notificationSent = true;
              newStockCount = 1; // leave exactly one in real stock

              axios.post("http://localhost:5000/api/notifyLowStock", {
                productId: p._id,
                remainingStock: newStockCount
              }).catch(err => console.error("Low-stock email error:", err));
            }

            return {
              ...p,
              displayedReductions: newDisplayedReductions,
              displayedStock: newDisplayedStock,
              stockCount: newStockCount,
              lowStockWarning,
              notificationSent
            };
          })
        );
      }
    } catch (error) {
      console.error("Error simulating order:", error);
      alert("Error simulating order. Check console for details.");
    }
  };

  // Filter products
  const filteredProducts = products
    .filter(p => (filterCategory ? p.category === filterCategory : true))
    .filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-900">Product Inventory Table</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowOrdersModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Manage Orders
          </button>
          <NotificationBell products={products} />
        </div>
      </div>

      {/* Orders Modal */}
      {showOrdersModal && (
        <OrdersModal
          orders={orders}
          onClose={() => setShowOrdersModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name of product stored in the manage product table..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard/manage-products")}
            className="px-4 py-2 bg-pink-900 text-white rounded-md mt-5 cursor-pointer"
          >
            Go to Manage Products
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Filter by Category:</label>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map(p => p.category))).map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product ID</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Discount (%)</th>
              <th className="border p-2">Discount Price</th>
              <th className="border p-2">Stock Count</th>
              <th className="border p-2">Threshold</th>
              <th className="border p-2">Customer Stock</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const displayedStock = Math.floor((product.stockCount || 10) / 2);
              const computedDiscountPrice = product.discountPrice
                ? product.discountPrice
                : product.price - (product.price * (product.discount || 0)) / 100;
              const discountPrice =
                Number(computedDiscountPrice) === Number(product.price)
                  ? 0
                  : computedDiscountPrice.toFixed(2);

              return (
                <tr
                  key={product._id}
                  className={`hover:bg-gray-50 ${product.stockCount <= 3 ? "bg-red-100" : ""}`}
                >
                  <td className="border p-2">{product._id}</td>
                  <td className="border p-2">{product.description}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">{product.discount || 0}</td>
                  <td className="border p-2">{discountPrice}</td>
                  <td className="border p-2">
                    {product.stockCount || 10}{" "}
                    {product.stockCount <= 3 && (
                      <span className="text-red-600 font-bold ml-1">Low Stock</span>
                    )}
                  </td>
                  <td className="border p-2">{product.threshold || 3}</td>
                  <td className="border p-2">{displayedStock || 1}</td>
                  <td className="border p-2 space-y-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => simulateOrder(product)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      Simulate Order
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Inventory Product Modal */}
      {selectedProduct && (
        <InventoryProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProductUpdated={updatedProduct => {
            if (updatedProduct) {
              setProducts(prev =>
                prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p))
              );
            }
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryTable;
