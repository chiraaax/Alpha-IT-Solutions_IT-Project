import { useState, useEffect } from "react";
import axios from "axios";
import InventoryProductModal from "./InventoryManagement";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // Filter products based on selected category.
  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Inventory Table</h2>
      
      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Filter by Category:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map(
            (cat, idx) => (
              <option key={idx} value={cat}>
                {cat.toUpperCase()}
              </option>
            )
          )}
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
              
              // Calculate discount price:
              // 1. Compute the discount price either from the provided discountPrice or via calculation.
              // 2. If the computed discount price equals the product price, set it to 0.
              const computedDiscountPrice = product.discountPrice
                ? product.discountPrice
                : product.price - (product.price * (product.discount || 0)) / 100;
              const discountPrice =
                Number(computedDiscountPrice) === Number(product.price)
                  ? 0
                  : computedDiscountPrice.toFixed(2);

              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border p-2">{product._id}</td>
                  <td className="border p-2">{product.description}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">{product.discount || 0}</td>
                  <td className="border p-2">{discountPrice}</td>
                  <td className="border p-2">{product.stockCount || 10}</td>
                  <td className="border p-2">1</td>
                  <td className="border p-2">{displayedStock}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Edit
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
