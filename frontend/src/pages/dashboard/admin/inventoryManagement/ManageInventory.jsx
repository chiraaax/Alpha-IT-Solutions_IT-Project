import { useState, useEffect } from "react";
import axios from "axios";
import InventoryProductModal from "./InventoryManagement";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New State for Search Bar
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // Fetch products from the backend.
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate a successful order for a specific product.
  const simulateOrder = async (product) => {
    try {
      const response = await axios.post("http://localhost:5000/api/successorder", {
        orderId: "ORDER123", // sample orderId
        products: [{ productId: product._id, quantity: 1 }],
      });
      if (response.status === 200) {
        // Update the products list by decreasing the stock count for the specified product.
        setProducts((prev) =>
          prev.map((p) => {
            if (p._id === product._id) {
              const newStock = (p.stockCount || 10) - 1;
              return { ...p, stockCount: newStock };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("Error simulating order:", error);
      alert("Error simulating order. Check console for details.");
    }
  };

  // Filter products based on selected category and search query.
  const filteredProducts = products
    .filter((p) => (filterCategory ? p.category === filterCategory : true))
    .filter((p) => p.description.toLowerCase().includes(searchQuery.toLowerCase()));



  return (
    
    <div className="p-4">
          {/* Navigation Button */}
    
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-900">Product Inventory Table</h2>
        <NotificationBell products={products} />
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name of product stored in the manage product table..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map((cat, idx) => (
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
            {filteredProducts.map((product) => {
              // Calculate customer-visible stock.
              const displayedStock = Math.floor((product.stockCount || 10) / 2);

              // Calculate discount price.
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
          onProductUpdated={(updatedProduct) => {
            if (updatedProduct) {
              setProducts((prev) =>
                prev.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p
                )
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
