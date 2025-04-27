// src/components/InventoryTable.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InventoryProductModal from "./InventoryManagement";


// Storage helpers for persisting order button state
const STORAGE_KEY = "orderStatusMap";
const loadStatusMap = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
const saveStatusMap = (map) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

/** Modal: lets you bump low-stock items back up and then save them */
const LowStockModal = ({ lowStockProducts, onClose, onSaveProducts }) => {
  const [localList, setLocalList] = useState(lowStockProducts);

  const handleChange = (id, value) => {
    setLocalList(list =>
      list.map(p => p._id === id ? { ...p, displayedStock: Number(value) } : p)
    );
  };

  const handleSave = () => {
    onSaveProducts(localList);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl mb-4">Low-Stock Products</h3>
        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {localList.map(p => (
            <li key={p._id} className="flex justify-between items-center">
              <span className="truncate">{p.description || p._id}</span>
              <input
                type="number"
                min="0"
                value={p.displayedStock}
                onChange={e => handleChange(p._id, e.target.value)}
                className="w-20 border rounded px-2 py-1"
              />
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/** Bell icon + count badge; opens LowStockModal */
const NotificationBell = ({ products, onSaveProducts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const lowStock = products.filter(
    p => p.displayedStock <= (p.threshold ?? 3)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="relative focus:outline-none"
      >
        {/* Bell SVG */}
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032..."
          />
        </svg>
        {lowStock.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">
            {lowStock.length}
          </span>
        )}
      </button>

      {isOpen && (
        <LowStockModal
          lowStockProducts={lowStock}
          onClose={() => setIsOpen(false)}
          onSaveProducts={onSaveProducts}
        />
      )}
    </div>
  );
};

/** Orders management modal (unchanged apart from status-change handler hookup) */
const OrdersModal = ({ orders, onClose, onStatusChange }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        const m = {};
        res.data.forEach(p => { m[p._id] = p.description });
        setProductMap(m);
      })
      .catch(err => console.error("Error loading products:", err));
  }, []);

  const toggleExpand = async id => {
    if (expandedId === id) {
      setExpandedId(null);
      return setExpandedData(null);
    }
    setExpandedId(id);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/successOrder/single/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpandedData(res.data);
    } catch (e) {
      console.error(e);
      setExpandedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Orders</h3>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>

        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0
              ? <tr><td colSpan={6} className="text-center p-4">No orders</td></tr>
              : orders.map(o => {
                const qty = (o.items||[]).reduce((sum,i) => sum + (i.quantity||0), 0);
                return (
                  <React.Fragment key={o._id}>
                    <tr className={`hover:bg-gray-50 ${o.actionTaken==="completed"?"bg-green-300":""} ${o.actionTaken==="failed"?"bg-red-300 line-through":""}`}>
                      <td className="border p-2">{o._id}</td>
                      <td className="border p-2">{o.customerId}</td>
                      <td className="border p-2">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="border p-2">{o.totalAmount}</td>
                      <td className="border p-2">{qty}</td>
                      <td className="border p-2 flex flex-col items-center space-y-2">
                        <button
                          onClick={() => onStatusChange(o._id, "Completed")}
                          className="px-2 py-1 bg-green-500 text-white rounded w-32"
                        >
                          {o.actionTaken==="completed"?"Undo Order Done":"Order Done"}
                        </button>
                        <button
                          onClick={() => onStatusChange(o._id, "Failed")}
                          className="px-2 py-1 bg-red-500 text-white rounded w-32"
                        >
                          Mark as Failed
                        </button>
                        <button
                          onClick={() => toggleExpand(o._id)}
                          className="px-2 py-1 bg-blue-500 text-white rounded w-32"
                        >
                          {expandedId===o._id?"Hide Order":"View Order"}
                        </button>
                      </td>
                    </tr>

                    {expandedId === o._id && (
                      <tr>
                        <td colSpan={6} className="p-4 bg-gray-700 text-white">
                          {loading
                            ? "Loading details..."
                            : expandedData
                              ? (
                                <div>
                                  <h4 className="underline">Customer Details</h4>
                                  <p><strong>Name:</strong> {expandedData.successOrder.customerId?.name||"-"}</p>
                                  <p><strong>Phone:</strong> {expandedData.relatedOrder.phoneNo||"-"}</p>
                                  <p><strong>Email:</strong> {expandedData.successOrder.customerId?.email||"-"}</p>
                                  <h4 className="mt-4 underline">Order Items</h4>
                                  <ul className="list-disc pl-6">
                                    {expandedData.successOrder.items.map((it,i)=>(
                                      <li key={i}>
                                        {it.itemType==="Product"
                                          ? <>Product ID: {it.itemId} — {productMap[it.itemId]||"N/A"}</>
                                          : <>
                                              PreBuild Specs:
                                              <ul className="pl-4 list-disc">
                                                {it.specs.map((s,j)=>(
                                                  <li key={j}>{s._id} — {s.label}: {s.value}</li>
                                                ))}
                                              </ul>
                                            </>
                                        }
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                              : "No details found."
                          }
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Main Inventory table + order button + bell + low-stock persistence */
const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory]   = useState("");
  const [searchQuery,    setSearchQuery]      = useState("");
  const [isLoading,      setIsLoading]        = useState(false);
  const navigate = useNavigate();
  

  // 1) Fetch products on mount
  useEffect(() => { fetchProducts() }, []);
  async function fetchProducts() {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data.map(p => ({
        ...p,
        displayedStock: p.displayedStock ?? 0,
        threshold: p.threshold ?? 3
      })));
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  // 2) Fetch orders when modal opens
  useEffect(() => {
    if (!showOrdersModal) return;
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/successOrder/admin/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const arr = Array.isArray(res.data) ? res.data : res.data.orders;
      const map = loadStatusMap();
      setOrders(arr.map(o => ({
        ...o,
        actionTaken: map[o._id] === "Completed" ? "completed"
                     : map[o._id] === "Failed"    ? "failed"
                     : null,
        status: map[o._id] || o.status
      })));
    })
    .catch(err => {
      console.error(err);
      setOrders([]);
    });
  }, [showOrdersModal]);

  // 3) When bell/modal saves new stocks
  const handleSaveProducts = async updatedOnes => {
    // update locally
    setProducts(prev =>
      prev.map(p => {
        const u = updatedOnes.find(x => x._id === p._id);
        return u ? { ...p, displayedStock: u.displayedStock } : p;
      })
    );
    // persist each
    await Promise.all(updatedOnes.map(p =>
      axios.patch(`http://localhost:5000/api/products/${p._id}/inventory`, {
        displayedStock: p.displayedStock
      })
    ));
  };

  // 4) Order status changes + stock adjustments
  const handleStatusChange = (orderId, newStatus) => {
    const old = orders.find(o => o._id === orderId);
    const prev = old.actionTaken;
    let factor = 0;
    if (newStatus==="Completed" && prev!=="completed") factor = -1;
    else if (newStatus==="Completed" && prev==="completed") factor = +1;
    if (factor !== 0) adjustStockForOrder(old, factor);

    const next = orders.map(o => {
      if (o._id !== orderId) return o;
      let at = o.actionTaken;
      if (newStatus==="Completed") at = prev==="completed"? null : "completed";
      else if (newStatus==="Failed") at = prev==="failed"? null : "failed";
      return { ...o, actionTaken: at, status: at? at[0].toUpperCase()+at.slice(1) : o.status };
    });
    setOrders(next);

    const m = loadStatusMap();
    const cur = next.find(o => o._id===orderId);
    if (cur.actionTaken) m[orderId] = cur.status;
    else delete m[orderId];
    saveStatusMap(m);
  };

  const adjustStockForOrder = (order, factor) => {
    const adj = {};
    const specsSet = new Set();
    (order.items||[]).forEach(it => {
      if (it.itemType==="Product") {
        const id = it.itemId._id||it.itemId;
        adj[id] = (adj[id]||0) + factor * (it.quantity||1);
      } else {
        (it.specs||[]).forEach(s => s._id && specsSet.add(s._id));
      }
    });
    specsSet.forEach(id => {
      adj[id] = (adj[id]||0) + factor;
    });
    Object.entries(adj).forEach(([id, qty]) => updateProductStock(id, qty));
  };

  const updateProductStock = (productId, change) => {
    setProducts(prev =>
      prev.map(p => {
        if (p._id !== productId) return p;
  
        // 1) calculate the new stock
        const newStock = Math.max(0, p.displayedStock + change);
  
        // 2) immediately persist it
        axios
          .patch(`http://localhost:5000/api/products/${productId}/inventory`, {
            displayedStock: newStock
          })
          .catch(err => console.error("Failed to persist stock:", err));
  
        // 3) return the updated product for your UI
        return { ...p, displayedStock: newStock };
      })
    );
  };
  
  // inside InventoryTable, alongside your other handlers
const handleMarkOutOfStock = async (productId) => {
  try {
    // Send the update to your /inventory endpoint
    await axios.patch(
      `http://localhost:5000/api/products/${productId}/inventory`,
      {
        displayedStock: 0,
        availability: "out of stock",
      }
    );
    // Update UI immediately
    setProducts(prev =>
      prev.map(p =>
        p._id === productId
          ? { ...p, displayedStock: 0, availability: "out of stock" }
          : p
      )
    );
  } catch (err) {
    console.error("Failed to mark out of stock:", err);
    alert("Could not mark product as out of stock.");
  }
};

  // 5) Filtering/search
  const filtered = products
    .filter(p => filterCategory ? p.category===filterCategory : true)
    .filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-900">Product Inventory</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowOrdersModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Manage Orders
          </button>
          <NotificationBell
            products={products}
            onSaveProducts={handleSaveProducts}
          />
        </div>
      </div>

      {showOrdersModal && (
        <OrdersModal
          orders={orders}
          onClose={() => setShowOrdersModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* search & filter */}
      <input
        type="text"
        placeholder="Search…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={filterCategory}
        onChange={e => setFilterCategory(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">All Categories</option>
        {[...new Set(products.map(p => p.category))].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {isLoading
        ? <p>Loading…</p>
        : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Discount %</th>
                <th className="p-2 border">Discount Price</th>
                <th className="p-2 border">Threshold</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const discPrice = p.discountPrice != null
                  ? p.discountPrice
                  : (p.price - (p.price*(p.discount||0))/100).toFixed(2);
                return (
                  <tr key={p._id}
                      className={`hover:bg-gray-50
                                 ${p.displayedStock<=p.threshold?"bg-red-100":""}
                                 ${p.displayedStock<=0?"bg-yellow-300":""}`}>
                    <td className="p-2 border">{p._id}</td>
                    <td className="p-2 border">{p.description}</td>
                    <td className="p-2 border">{p.price}</td>
                    <td className="p-2 border">{p.discount||0}</td>
                    <td className="p-2 border">{discPrice}</td>
                    <td className="p-2 border">{p.threshold}</td>
                    <td className="p-2 border">{p.displayedStock}</td>
                    <td className="p-2 border space-y-2">
          {p.displayedStock <= 0 && (
            <>
              <button
                onClick={() => handleMarkOutOfStock(p._id)}
                className="w-full py-1 bg-red-600 text-white rounded"
              >
                Mark Out of Stock
              </button>
              <button
                onClick={() => navigate("/dashboard/manage-products")}
                className="w-full py-1 bg-pink-600 text-white rounded"
              >
                Edit Stock
              </button>
            </>
          )}
          {p.displayedStock > 0 && (
            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full py-1 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </td>

                  </tr>
                );
              })}
            </tbody>
            
          </table>
        )
      }

      {selectedProduct && (
        <InventoryProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProductUpdated={upd => {
            if (upd) {
              setProducts(prev =>
                prev.map(p => p._id===upd._id ? upd : p)
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
