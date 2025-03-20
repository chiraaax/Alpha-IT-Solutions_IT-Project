import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProductModal from "./EditProductModal";

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find((p) => p._id === productId);
    setSelectedProductForEdit(productToEdit);
  };

  // Helper function to render specs by normalizing data to an array.
  const renderSpecs = (specs) => {
    if (!specs) return null;
    const normalizeSpecs = (specs) => {
      if (!specs) return [];
      if (Array.isArray(specs)) return specs;
      if (typeof specs === "object") return [specs];
      return [];
    };

    const normalizedSpecs = normalizeSpecs(specs);

    return normalizedSpecs.map((spec, idx) => (
      <div key={idx}>
        {spec.key}: {spec.value}
      </div>
    ));
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  return (
    <>
      {selectedProductForEdit && (
        <EditProductModal
          product={selectedProductForEdit}
          onClose={() => setSelectedProductForEdit(null)}
          onProductUpdated={(updatedProduct) =>
            setProducts((prev) =>
              prev.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
              )
            )
          }
        />
      )}
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Manage Products
        </h2>
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
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
          {isLoading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Product ID</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Name of Product</th>
                  <th className="border p-2">Availability</th>
                  <th className="border p-2">State</th>
                  <th className="border p-2">Specs</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="border p-2">{product._id}</td>
                    <td className="border p-2">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.description}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="border p-2">{product.description}</td>
                    <td className="border p-2">{product.availability}</td>
                    <td className="border p-2">{product.state}</td>
                    <td className="border p-2">{renderSpecs(product.specs)}</td>
                    <td className="border p-2">
                      LKR {Number(product.price).toFixed(2)}
                    </td>
                    <td className="border p-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 mt-8"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 mt-8"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageProducts;
