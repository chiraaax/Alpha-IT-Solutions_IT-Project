import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadImage from "../addProduct/UploadImage";

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [configData, setConfigData] = useState(null);
  const [formData, setFormData] = useState({
    price: product.price,
    availability: product.availability,
    state: product.state,
    description: product.description,
    image: product.image || "",
    // dynamic fields will be added once config is fetched
  });
  const [additionalSpecs, setAdditionalSpecs] = useState([]);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch configuration for the product's category
  useEffect(() => {
    if (product.category) {
      axios
        .get(`http://localhost:5000/api/filters/${product.category}`)
        .then((res) => {
          setConfigData(res.data);
        })
        .catch((err) =>
          console.error("Error fetching filter configuration:", err)
        );
    }
  }, [product.category]);

  // Initialize dynamic fields and separate additional specs once configData is available
  useEffect(() => {
    if (configData && configData.options) {
      const dynamicKeys = Object.keys(configData.options);
      const dynamicValues = {};
      const additional = [];

      // Go through the product's specs and divide them
      product.specs.forEach((spec) => {
        if (dynamicKeys.includes(spec.key)) {
          dynamicValues[spec.key] = spec.value;
        } else {
          additional.push(spec);
        }
      });

      setFormData((prev) => ({ ...prev, ...dynamicValues }));
      setAdditionalSpecs(additional);
    }
  }, [configData, product.specs]);

  // Update common and dynamic fields in formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new additional spec
  const handleAddSpec = () => {
    if (newSpec.key && newSpec.value) {
      setAdditionalSpecs((prev) => [...prev, newSpec]);
      setNewSpec({ key: "", value: "" });
    }
  };

  // Remove an additional spec
  const handleDeleteSpec = (index) => {
    setAdditionalSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  // When saving, combine the dynamic specs (from configData.options) and additional specs
  const handleSave = async () => {
    setIsLoading(true);

    const dynamicSpecs =
      configData && configData.options
        ? Object.keys(configData.options).reduce((acc, key) => {
            if (formData[key]) {
              acc.push({ key, value: formData[key] });
            }
            return acc;
          }, [])
        : [];

    const combinedSpecs = [...dynamicSpecs, ...additionalSpecs];

    const updatedProduct = {
      ...product,
      price: formData.price,
      availability: formData.availability,
      state: formData.state,
      description: formData.description,
      image: formData.image,
      specs: combinedSpecs,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/products/${product._id}`,
        updatedProduct
      );
      if (response.status === 200) {
        onProductUpdated(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 border rounded-md";

  if (!configData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-md">
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-8 rounded-md w-7/12 max-h-screen overflow-auto">
        <h3 className="text-2xl font-bold mb-4">Edit Product</h3>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Price:
          </label>
          <input
            name="price"
            type="number"
            placeholder={`Min: ${configData.priceRange.min} - Max: ${configData.priceRange.max}`}
            value={formData.price}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Availability:
          </label>
          <select
            name="availability"
            value={formData.availability}
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

        {/* State */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            State:
          </label>
          <select
            name="state"
            value={formData.state}
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

        {/* Dynamic Fields from configuration */}
        {configData.options &&
          Object.keys(configData.options).map((optionKey) => (
            <div key={optionKey} className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                {optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}:
              </label>
              <select
                name={optionKey}
                value={formData[optionKey] || ""}
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

        {/* Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className={inputClass}
          ></textarea>
        </div>

        {/* Additional Specifications */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-700">
            Additional Specifications
          </h4>
          {additionalSpecs.map((spec, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 mt-2"
            >
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
                setNewSpec((prev) => ({
                  ...prev,
                  key: e.target.value,
                }))
              }
              className="flex-1 bg-gray-50 border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Spec description: e.g., 2.5 kg"
              value={newSpec.value}
              onChange={(e) =>
                setNewSpec((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
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

        {/* Image Upload */}
        <div className="mb-4">
          <UploadImage
            name="image"
            setImage={(img) =>
              setFormData((prev) => ({ ...prev, image: img }))
            }
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Product"
              className="mt-2 h-32 object-cover rounded-md border"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
