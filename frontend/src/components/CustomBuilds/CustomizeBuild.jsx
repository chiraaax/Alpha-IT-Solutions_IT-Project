import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";

const CustomizeBuild = () => {
  const { id } = useParams(); // Get build ID from URL
  const navigate = useNavigate(); // For navigation
  const { isDark, toggleTheme } = useTheme();
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customBuild, setCustomBuild] = useState({
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    psu: "",
    casing: "",
  });

  // Component options (This could later be pulled from the API for dynamic updates)
  const componentOptions = {
    cpu: ["Intel Core i9", "AMD Ryzen 9", "Intel Core i7", "AMD Ryzen 7"],
    gpu: ["NVIDIA RTX 4090", "NVIDIA RTX 4080", "AMD Radeon RX 7900"],
    ram: ["16GB", "32GB", "64GB"],
    storage: ["512GB SSD", "1TB SSD", "2TB SSD"],
    psu: ["650W", "750W", "850W"],
    casing: ["Mid Tower", "Full Tower", "Compact"],
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/prebuilds/${id}`)
      .then((response) => {
        if (response.data) {
          setBuild(response.data.data || response.data);
          setCustomBuild({
            ...response.data.data,
          }); // Initialize custom build with selected options
        } else {
          setError("No data found for this build.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching build details:", err);
        setError("Unable to load build details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  // Function to handle component changes
  const handleChange = (component, value) => {
    setCustomBuild({ ...customBuild, [component]: value });
  };

  // Function to reset the form
  const handleReset = () => {
    setCustomBuild({
      cpu: build.cpu,
      gpu: build.gpu,
      ram: build.ram,
      storage: build.storage,
      psu: build.psu,
      casing: build.casing,
    });
  };

  // Function to handle adding the custom build to cart
  const handleAddToCart = () => {
    // Here you can send the custom build data to the backend or local storage
    console.log("Added to Cart:", customBuild);
    handleReset(); // Reset form after adding to cart
    alert("Build added to cart successfully!");
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!build) return <p className="text-center text-red-500">Build not found.</p>;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} py-10 px-4`}>
      <div className={`max-w-4xl mx-auto ${isDark ? "bg-gray-800" : "bg-white"} p-6 shadow-lg rounded-lg`}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
        >
          {isDark ? "🌞" : "🌙"}
        </button>

        <h1 className="text-3xl font-bold mb-4">Customize Your {build.category} Build</h1>

        {/* CPU Selection */}
        <div className="mb-4">
          <label className="block font-semibold">CPU</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.cpu}
            onChange={(e) => handleChange("cpu", e.target.value)}
          >
            {componentOptions.cpu.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* GPU Selection */}
        <div className="mb-4">
          <label className="block font-semibold">GPU</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.gpu}
            onChange={(e) => handleChange("gpu", e.target.value)}
          >
            {componentOptions.gpu.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* RAM Selection */}
        <div className="mb-4">
          <label className="block font-semibold">RAM</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.ram}
            onChange={(e) => handleChange("ram", e.target.value)}
          >
            {componentOptions.ram.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Storage Selection */}
        <div className="mb-4">
          <label className="block font-semibold">Storage</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.storage}
            onChange={(e) => handleChange("storage", e.target.value)}
          >
            {componentOptions.storage.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* PSU Selection */}
        <div className="mb-4">
          <label className="block font-semibold">PSU</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.psu}
            onChange={(e) => handleChange("psu", e.target.value)}
          >
            {componentOptions.psu.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Casing Selection */}
        <div className="mb-4">
          <label className="block font-semibold">Casing</label>
          <select
            className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={customBuild.casing}
            onChange={(e) => handleChange("casing", e.target.value)}
          >
            {componentOptions.casing.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ✅ Save & Add to Cart
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeBuild;
