import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UploadImage from "./UploadImage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedProductType, setSelectedProductType] = useState("");
  const [configData, setConfigData] = useState(null); // Dynamic config from DB
  const [product, setProduct] = useState({
    price: "",
    availability: "",
    state: "",
    description: "",
    additionalSpecs: [],
    // Other dynamic spec fields will be added as user inputs values
  });
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch configuration for the selected product type from the backend
  useEffect(() => {
    if (selectedProductType) {
      axios
        .get(`http://localhost:5000/api/filters/${selectedProductType}`)
        .then((res) => {
          setConfigData(res.data);
        })
        .catch((err) =>
          console.error("Error fetching filter configuration:", err)
        );
    }
  }, [selectedProductType]);
  

  const handleProductTypeSelect = (type) => {
    setSelectedProductType(type);
    setProduct((prev) => ({
      ...prev,
      category: type,
    }));
  };

  // Update product state as fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new additional specification manually
  const handleAddSpec = () => {
    if (newSpec.key && newSpec.value) {
      setProduct((prev) => ({
        ...prev,
        additionalSpecs: [...prev.additionalSpecs, newSpec],
      }));
      setNewSpec({ key: "", value: "" });
    }
  };

  // Remove a manually added specification
  const handleDeleteSpec = (index) => {
    setProduct((prev) => ({
      ...prev,
      additionalSpecs: prev.additionalSpecs.filter((_, i) => i !== index),
    }));
  };

  // Submit the product to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // These fields are handled separately and are not part of the specs
    const commonFields = ["price", "availability", "state", "description", "category"];

    // Filtering logic: iterate over dynamic options from configData
    // and add a spec if a value exists in product state.
    const specsFromFields =
      configData && configData.options
        ? Object.keys(configData.options).reduce((acc, key) => {
            // We assume every key in configData.options is a spec field.
            if (product[key]) {
              acc.push({
                key: key,
                value: product[key],
              });
            }
            return acc;
          }, [])
        : [];

    // Combine specs derived from configData with any manually added specs.
    const combinedSpecs = [...specsFromFields, ...product.additionalSpecs];

    const productData = {
      price: product.price,
      availability: product.availability,
      state: product.state,
      description: product.description,
      category: product.category,
      image,
      specs: combinedSpecs,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/products", productData);
      if (response.status === 201) {
        alert("Product added successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Error adding product:", error);
      alert("Error adding product.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const textAreaClass =
    "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl text-center font-bold text-gray-800 mb-6">Add New Product</h2>
        {!selectedProductType ? (
          // Product type selection buttons (you can adjust these as needed)
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {["laptop", "motherboard", "processor", "ram", "gpu", "powerSupply", "casings", "monitors", "cpuCoolers", "keyboard", "mouse", "soundSystems", "cablesConnectors", "storage", "externalStorage"].map((type) => (
              <button
                key={type}
                onClick={() => handleProductTypeSelect(type)}
                className="px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          // Render the form for the selected product type
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 underline decoration-4 decoration-blue-500">
              {selectedProductType}
            </h3>
            {configData ? (
              <>
                {/* Price input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    name="price"
                    type="number"
                    placeholder={`Min: ${configData.priceRange.min} - Max: ${configData.priceRange.max}`}
                    value={product.price}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                {/* Availability dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <select
                    name="availability"
                    value={product.availability}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Availability</option>
                    {configData.availability.map((avail) => (
                      <option key={avail} value={avail}>
                        {avail}
                      </option>
                    ))}
                  </select>
                </div>
                {/* State dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    name="state"
                    value={product.state}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select State</option>
                    {configData.state.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dynamically render select inputs for each option (e.g. brand, laptopCPU, etc.) */}
                {configData.options &&
                  Object.keys(configData.options).map((optionKey) => (
                    <div key={optionKey} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}
                      </label>
                      <select
                        name={optionKey}
                        value={product[optionKey] || ""}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select {optionKey}</option>
                        {configData.options[optionKey].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                {/* Additional Specifications Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">Additional Specifications</h4>
                  {product.additionalSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-4 mt-2">
                      <span className="text-gray-700">
                        {spec.key}: {spec.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpec(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2 mt-4">
                    <input
                      type="text"
                      placeholder="Spec name: e.g., Weight"
                      value={newSpec.key}
                      onChange={(e) =>
                        setNewSpec((prev) => ({ ...prev, key: e.target.value }))
                      }
                      className="flex-1 bg-gray-50 border rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Spec description: e.g., 2.5 kg"
                      value={newSpec.value}
                      onChange={(e) =>
                        setNewSpec((prev) => ({ ...prev, value: e.target.value }))
                      }
                      className="flex-1 bg-gray-50 border rounded-lg px-4 py-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* Product name/description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <textarea
                    name="description"
                    placeholder="e.g., MSI MODERN 15 F13MG INTEL CORE I7"
                    value={product.description}
                    onChange={handleChange}
                    className={textAreaClass}
                  ></textarea>
                </div>
                {/* Image Upload Component */}
                <UploadImage name="image" setImage={setImage} />
              </>
            ) : (
              <p>Loading configuration...</p>
            )}
            {/* Form buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductType("")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400 transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
