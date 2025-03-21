import React, { useState, useContext } from "react";
import axios from "axios";
import UploadImage from "./UploadImage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";
import { productTypes, productFields } from "./productConfig";
  
  const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedProductType, setSelectedProductType] = useState("");
    const [product, setProduct] = useState({
      price: "",
      availability: "",
      state: "",
      description: "",
      additionalSpecs: [] // For dynamically added extra specifications
    });
    
    const [newSpec, setNewSpec] = useState({ key: "", value: "" });
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    // Handle selection of product type
    const handleProductTypeSelect = (type) => {
      setSelectedProductType(type);
      setProduct((prev) => ({
        ...prev,
        category: type,
      }));
    };
  
    // Update product state based on user input
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    // Add a new additional specification
    const handleAddSpec = () => {
      if (newSpec.key && newSpec.value) {
        setProduct((prev) => ({
          ...prev,
          additionalSpecs: [...prev.additionalSpecs, newSpec],
        }));
        setNewSpec({ key: "", value: "" }); // Reset the input fields
      }
    };
  
    // Delete an additional specification by its index
    const handleDeleteSpec = (index) => {
      setProduct((prev) => ({
        ...prev,
        additionalSpecs: prev.additionalSpecs.filter((_, i) => i !== index),
      }));
    };
  
    // Submit product data to the backend
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      // Fields that are common and not part of the specs
      const commonFields = ["price", "availability", "state", "description", "category"];
  
      // Build the specs array from productFields (derived specs)
      const specsFromFields = productFields[selectedProductType]?.reduce((acc, field) => {
        if (!commonFields.includes(field.name)) {
          if (product[field.name]) {
            acc.push({
              key: field.name,
              value: product[field.name],
            });
          }
        }
        return acc;
      }, []) || [];
  
      // Combine with the additional specifications that were manually added
      const combinedSpecs = [...specsFromFields, ...product.additionalSpecs];
  
      // Prepare the product data object
      const productData = {
        price: product.price,
        availability: product.availability,
        state: product.state,
        description: product.description,
        category: product.category,
        image, // from the separate image state
        specs: combinedSpecs,
      };
  
      try {
        const response = await axios.post("http://localhost:5000/api/products", productData);
        if (response.status === 201) {
          alert("Product added successfully!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("❌ Error:", error);
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
            // Product type selection buttons
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {productTypes.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => handleProductTypeSelect(pt.value)}
                  className="px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
                >
                  {pt.label}
                </button>
              ))}
            </div>
          ) : (
            // Render the form with fields for the selected product type
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-700 underline decoration-4 decoration-blue-500">
                {selectedProductType}
              </h3>
              {/* Dynamically render fields based on selected product type */}
              {productFields[selectedProductType]?.map((field, idx) =>
                field.type === "select" ? (
                  <div key={idx} className="space-y-2">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <select
                      id={field.name}
                      name={field.name}
                      value={product[field.name] || ""}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div key={idx} className="space-y-2">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder || ""}
                      value={product[field.name] || ""}
                      onChange={handleChange}
                      className={inputClass}
                      min={field.min}
                      max={field.max}
                    />
                  </div>
                )
              )}
  
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
                {/* Inputs to add a new additional specification */}
                <div className="flex space-x-2 mt-4">
                  <input
                    type="text"
                    placeholder="Spec name: Weight"
                    value={newSpec.key}
                    onChange={(e) =>
                      setNewSpec((prev) => ({ ...prev, key: e.target.value }))
                    }
                    className="flex-1 bg-gray-50 border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Spec description: 2.5 kg"
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
  
              {/* Product Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="eg: MSI MODERN 15 F13MG INTEL CORE I7"
                  value={product.description}
                  onChange={handleChange}
                  className={textAreaClass}
                ></textarea>
              </div>
  
              {/* Image Upload */}
              <UploadImage name="image" setImage={setImage} />
  
              {/* Form Buttons */}
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