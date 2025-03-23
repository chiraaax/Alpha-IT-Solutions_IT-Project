import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const GamingBuildDetail = () => {
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  // Retrieve cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Products lookup state for mapping product IDs to details
  const [productsLookup, setProductsLookup] = useState({});
  // Modal state for editing build details
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Compatibility options fetched based on the build's compatibility field
  const [compatibilityOptions, setCompatibilityOptions] = useState({
    processor: [],
    gpu: [],
    ram: [],
    storage: [],
    powerSupply: [],
    casings: [],
  });
  // Local state for the edited build. Initially, we use the fetched build data.
  const [editedBuild, setEditedBuild] = useState(null);
  // Local state for temporary messages (confirmation or warning)
  const [message, setMessage] = useState("");

  // Fetch build details and products lookup concurrently (from prebuilds DB)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch build details (global prebuild data)
        const buildResponse = await axios.get(`http://localhost:5000/api/prebuilds/${id}`);
        const fetchedBuild = buildResponse.data.data || buildResponse.data;
        if (fetchedBuild) {
          setBuild(fetchedBuild);
          // Initialize editedBuild with the current build values for a user-specific copy.
          setEditedBuild({ ...fetchedBuild });
        } else {
          setError("No data found for this build.");
        }

        // Fetch all products and create a lookup by _id (if needed for specifications)
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        const lookup = {};
        productsResponse.data.forEach((product) => {
          lookup[product._id] = product;
        });
        setProductsLookup(lookup);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load build details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // When the edit modal opens, fetch compatibility options from the backend
  useEffect(() => {
    if (isEditModalOpen && build && build.compatibility) {
      axios
        .get(`http://localhost:5000/api/prebuilds/${id}/compatibility`)
        .then((response) => {
          setCompatibilityOptions(response.data.data);
        })
        .catch((err) => {
          console.error("Error fetching compatibility options:", err);
        });
    }
  }, [isEditModalOpen, build, id]);

  // Helper: Given a product id and options, return its price
  const getProductPrice = (id, options) => {
    const prod = options.find((p) => p._id === id);
    return prod ? Number(prod.price) : 0;
  };

  // Recalculate the total price based on current selections (user-specific)
  const recalcPrice = () => {
    if (!editedBuild) return;
    const total =
      getProductPrice(editedBuild.processor, compatibilityOptions.processor) +
      getProductPrice(editedBuild.gpu, compatibilityOptions.gpu) +
      getProductPrice(editedBuild.ram, compatibilityOptions.ram) +
      getProductPrice(editedBuild.storage, compatibilityOptions.storage) +
      getProductPrice(editedBuild.powerSupply, compatibilityOptions.powerSupply) +
      getProductPrice(editedBuild.casings, compatibilityOptions.casings);
    setEditedBuild((prev) => ({ ...prev, price: total }));
  };

  // Recalculate price whenever any selection changes
  useEffect(() => {
    recalcPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editedBuild?.processor,
    editedBuild?.gpu,
    editedBuild?.ram,
    editedBuild?.storage,
    editedBuild?.powerSupply,
    editedBuild?.casings,
  ]);

  // Handler to update editedBuild when a dropdown changes
  const handleEditChange = (field, selectedId) => {
    setEditedBuild((prev) => ({ ...prev, [field]: selectedId }));
  };

  // Save the changes from the edit modal locally (without updating the global prebuild)
  const handleSaveChanges = () => {
    setBuild(editedBuild);
    setIsEditModalOpen(false);
  };

  // Helper to format price as USD
  const formatPrice = (price) => {
    return price
      ? price.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "N/A";
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center">{error}</p>;
  if (!build)
    return <p className="text-center text-red-500">Build not found.</p>;

  // Display specifications using productsLookup (for non-edit mode)
  const specs = [
    {
      id: "spec-processor",
      label: "Processor",
      value: productsLookup[build.processor]
        ? productsLookup[build.processor].description
        : build.processor,
    },
    {
      id: "spec-gpu",
      label: "GPU",
      value: productsLookup[build.gpu]
        ? productsLookup[build.gpu].description
        : build.gpu,
    },
    {
      id: "spec-ram",
      label: "RAM",
      value: productsLookup[build.ram]
        ? productsLookup[build.ram].description
        : build.ram,
    },
    {
      id: "spec-storage",
      label: "Storage",
      value: productsLookup[build.storage]
        ? productsLookup[build.storage].description
        : build.storage,
    },
    {
      id: "spec-powerSupply",
      label: "Power Supply",
      value: productsLookup[build.powerSupply]
        ? productsLookup[build.powerSupply].description
        : build.powerSupply,
    },
    {
      id: "spec-casings",
      label: "Casings",
      value: productsLookup[build.casings]
        ? productsLookup[build.casings].description
        : build.casings,
    },
  ];

  // Check if the current gaming build (prebuild) is already in the cart
  const isGamingBuildInCart = () => {
    return cartItems.some((item) => item._id === build?._id);
  };

  // Add to Cart functionality using prebuild fields: _id, price, image, description.
  const handleAddToCart = () => {
    if (isGamingBuildInCart()) {
      setMessage("Build is already in cart. Adjust quantity in the shopping cart.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const { _id, description, price, image } = build;
    dispatch({
      type: "ADD_TO_CART",
      payload: { _id, description, price, image, quantity: 1 },
    });
    setMessage("Build added to cart!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className={`min-h-screen py-10 px-4 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      <div className={`max-w-6xl mx-auto p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6 transition-all ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
        {/* Left Column – Image */}
        <div className="w-full md:w-1/2">
          <img
            src={build.image || "https://via.placeholder.com/600"}
            alt={build.category}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right Column – Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-center sm:text-left mb-3">{build.category} Build</h1>
            <p className="text-lg mb-4">{build.description}</p>

            {/* Price & Availability */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-500">{formatPrice(build.price)}</p>
              <p className="text-sm text-green-500 font-semibold">✅ In Stock</p>
            </div>

            {/* Specification Table */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <table className={`w-full border-collapse border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.id} className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                      <td className={`p-2 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{spec.label}</td>
                      <td className={`p-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{spec.value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={handleAddToCart}
              disabled={isGamingBuildInCart()}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700 ${isGamingBuildInCart() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              🛠️ Customize Build
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className={`max-w-6xl mx-auto mt-8 p-6 shadow-lg rounded-lg transition-all ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <p className={isDark ? "text-gray-300 italic" : "text-gray-600 italic"}>
          No reviews yet. Be the first to leave a review!
        </p>
      </div>

      {/* Temporary message for Add to Cart actions */}
      {message && (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded shadow-md">
          {message}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editedBuild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-gray-900 p-6 rounded-lg max-w-md w-full ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <h2 className="text-2xl mb-4">Edit Build</h2>
            {[
              { field: "processor", label: "Processor", options: compatibilityOptions.processor },
              { field: "gpu", label: "GPU", options: compatibilityOptions.gpu },
              { field: "ram", label: "RAM", options: compatibilityOptions.ram },
              { field: "storage", label: "Storage", options: compatibilityOptions.storage },
              { field: "powerSupply", label: "Power Supply", options: compatibilityOptions.powerSupply },
              { field: "casings", label: "Casings", options: compatibilityOptions.casings },
            ].map(({ field, label, options }) => (
              <div key={field} className="mb-4">
                <label className="block font-semibold mb-1">{label}</label>
                {options.length ? (
                  <select
                    value={editedBuild[field]}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">{`Select ${label}`}</option>
                    {options.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.description} - (LKR {option.price})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500">No options available</p>
                )}
              </div>
            ))}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Price</label>
              <input
                type="text"
                value={formatPrice(editedBuild.price)}
                readOnly
                className="w-full p-2 bg-gray-200 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamingBuildDetail;
