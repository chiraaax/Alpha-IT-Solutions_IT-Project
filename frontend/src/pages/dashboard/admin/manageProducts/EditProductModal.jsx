import { useState } from "react";
import axios from "axios";
import { productFields, stateField } from "../addProduct/productConfig";
import UploadImage from "../addProduct/UploadImage";

// Normalize specs to an array of key/value objects
const normalizeSpecs = (specs) => {
  if (!specs) return [];
  if (Array.isArray(specs)) return specs;
  if (typeof specs === "object") return [specs];
  return [];
};

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  // Use product.category (e.g., "laptop") to look up field configuration
  const productTypeFields = productFields[product.category] || [];

  // Get the availability field configuration from the product type config.
  const availabilityFieldConfig = productTypeFields.find(
    (field) => field.name === "availability"
  );

  // Set up state
  const [description, setDescription] = useState(product.description);
  const [availability, setAvailability] = useState(product.availability);
  const [stateValue, setStateValue] = useState(product.state);
  const [price, setPrice] = useState(product.price);
  const [specs, setSpecs] = useState(normalizeSpecs(product.specs));
  const [image, setImage] = useState(product.image || "");
  const [isLoading, setIsLoading] = useState(false);

  // Exclude common fields that are managed separately (price, availability, state)
  const specFieldOptions = productTypeFields.filter(
    (field) =>
      field.name !== "price" &&
      field.name !== "availability" &&
      field.name !== "state"
  );

  // Find field config for a given spec key.
  const getFieldConfigForKey = (key) =>
    specFieldOptions.find((field) => field.name === key);

  const handleSpecChange = (index, field, value) => {
    setSpecs((prevSpecs) => {
      const updated = [...prevSpecs];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {

    // Prepare updated product data
    const updatedProduct = {
      ...product,
      description,
      availability,
      state: stateValue,
      price,
      specs,
      image,
    };

    try {
      //  used product._id to target the correct document
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
  <div className="bg-white p-8 rounded-md w-7/12 max-h-screen overflow-auto">

        <h3 className="text-2xl font-bold mb-4">Edit Product</h3>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Description:
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Availability:
          </label>
          {availabilityFieldConfig && availabilityFieldConfig.type === "select" ? (
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {availabilityFieldConfig.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          )}
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            State:
          </label>
          <select
            value={stateValue}
            onChange={(e) => setStateValue(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {stateField.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Specs */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Specs:
          </label>
          {specs.map((spec, idx) => {
            const fieldConfig = getFieldConfigForKey(spec.key);
            return (
              <div key={spec._id || idx} className="flex space-x-2 mb-2 items-center">
                {/* Editable spec key */}
                <input
                  type="text"
                  value={spec.key || ""}
                  onChange={(e) =>
                    handleSpecChange(idx, "key", e.target.value)
                  }
                  placeholder="Key"
                  className="w-1/2 p-2 border rounded-md"
                />

                {/* Spec value: dropdown if configured, or text input */}
                {fieldConfig && fieldConfig.type === "select" ? (
                  <select
                    value={spec.value || ""}
                    onChange={(e) =>
                      handleSpecChange(idx, "value", e.target.value)
                    }
                    className="w-1/2 p-2 border rounded-md"
                  >
                    <option value="">Select Option</option>
                    {fieldConfig.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value || ""}
                    onChange={(e) =>
                      handleSpecChange(idx, "value", e.target.value)
                    }
                    className="w-1/2 p-2 border rounded-md"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white p-0 rounded-md w-7/12">

        {/* Image Upload Using UploadImage Component */}
        <div className="mb-4">
          <UploadImage name="product-image" setImage={setImage} />
          {image && (
            <img src={image} alt="Product" className="mt-2 h-32 object-cover rounded-md border" />
          )}
        </div>

       
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
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
