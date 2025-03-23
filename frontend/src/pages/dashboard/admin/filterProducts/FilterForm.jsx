import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FilterForm = ({ existingFilter }) => {
  const navigate = useNavigate();

  // Form state
  const [category, setCategory] = useState(existingFilter?.category || "");
  const [priceRange, setPriceRange] = useState(existingFilter?.priceRange || { min: 0, max: 0 });
  const [availability, setAvailability] = useState(existingFilter?.availability || []);
  const [stateValues, setStateValues] = useState(existingFilter?.state || []);
  const [options, setOptions] = useState(existingFilter?.options ? { ...existingFilter.options } : {});

  // Update options dynamically
  const updateOption = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value.split(",").map(v => v.trim()) }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filterData = { category, priceRange, availability, state: stateValues, options };

    try {
      if (existingFilter) {
        await axios.put(`http://localhost:5000/api/filters/${existingFilter._id}`, filterData);
      } else {
        await axios.post("http://localhost:5000/api/filters", filterData);
      }
      navigate("/"); // Redirect to home after success
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-xl mx-auto bg-gray-900 p-8 rounded-lg shadow-2xl"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <h2 className="text-3xl font-bold mb-6 text-sky-200">
        {existingFilter ? "Edit Filter" : "Add New Filter"}
      </h2>
      <div className="mb-6">
        <label className="block text-sky-300 mb-2">Category:</label>
        <input 
          type="text" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          required 
          className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sky-300 mb-2">Price Range:</label>
        <div className="flex space-x-4">
          <input 
            type="number" 
            placeholder="Min" 
            value={priceRange.min} 
            onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })} 
            required 
            className="w-1/2 p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input 
            type="number" 
            placeholder="Max" 
            value={priceRange.max} 
            onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })} 
            required 
            className="w-1/2 p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
<<<<<<< HEAD
      </div>
      <div className="mb-6">
        <label className="block text-sky-300 mb-2">Availability (comma separated):</label>
        <input 
          type="text" 
          value={availability.join(", ")} 
          onChange={e => setAvailability(e.target.value.split(",").map(v => v.trim()))} 
          required 
          className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sky-300 mb-2">State (comma separated):</label>
        <input 
          type="text" 
          value={stateValues.join(", ")} 
          onChange={e => setStateValues(e.target.value.split(",").map(v => v.trim()))} 
          required 
          className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="mb-8">
        <label className="block text-sky-300 mb-4">Dynamic Options:</label>
        <div className="space-y-4">
          {Object.keys(options).map(key => (
            <div key={key}>
              <label className="block text-sky-400 mb-1 font-medium">{key}:</label>
              <input 
                type="text" 
                value={options[key].join(", ")} 
                onChange={e => updateOption(key, e.target.value)} 
                className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
=======
        <div className="mb-6">
          <label className="block text-sky-300 mb-2">Price Range:</label>
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Min (-1 or greater)"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
              required
              className="w-1/2 p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
              required
              className="w-1/2 p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sky-300 mb-2">
            Availability (comma separated):
          </label>
          <input
            type="text"
            placeholder="e.g., in stock, out of stock, pre-order"
            value={availability.join(", ")}
            onChange={(e) =>
              setAvailability(e.target.value.split(",").map((v) => v.trim()))
            }
            required
            className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sky-300 mb-2">
            State (comma separated):
          </label>
          <input
            type="text"
            placeholder="e.g.,new , refurbished"
            value={stateValues.join(", ")}
            onChange={(e) =>
              setStateValues(e.target.value.split(",").map((v) => v.trim()))
            }
            required
            className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-8">
          <label className="block text-sky-300 mb-4">Dynamic Options:</label>
          <div className="space-y-4">
            {Object.keys(options).map((key) => (
              <div key={key}>
                <label className="block text-sky-400 mb-1 font-medium">
                  {key}:
                </label>
                <input
                  type="text"
                  placeholder={`Enter values for ${key} (comma separated)`}
                  value={options[key].join(", ")}
                  onChange={(e) => updateOption(key, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            ))}
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="eg: brand"
                id="newKey"
                className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="text"
                placeholder="msi, asus, acer"
                id="newValue"
                className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newKey = document.getElementById("newKey").value;
                  const newValue = document.getElementById("newValue").value;
                  if (newKey) {
                    updateOption(newKey, newValue);
                    document.getElementById("newKey").value = "";
                    document.getElementById("newValue").value = "";
                  }
                }}
                className="self-start px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Add Option
              </button>
>>>>>>> 8fcbe5d6dd40b0c4c9e04cab396ba44aad730508
            </div>
          ))}
          <div className="flex flex-col space-y-2">
            <input 
              type="text" 
              placeholder="New option key" 
              id="newKey" 
              className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input 
              type="text" 
              placeholder="Values (comma separated)" 
              id="newValue" 
              className="w-full p-3 bg-gray-800 text-sky-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button 
              type="button" 
              onClick={() => {
                const newKey = document.getElementById("newKey").value;
                const newValue = document.getElementById("newValue").value;
                if (newKey) {
                  updateOption(newKey, newValue);
                  document.getElementById("newKey").value = "";
                  document.getElementById("newValue").value = "";
                }
              }}
              className="self-start px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Add Option
            </button>
          </div>
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full py-3 bg-sky-600 text-white font-bold rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {existingFilter ? "Update Filter" : "Create Filter"}
      </button>
    </form>
  );
};

export default FilterForm;
