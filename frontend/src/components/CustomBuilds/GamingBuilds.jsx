import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

// API URL for gaming builds
const API_URL = "http://localhost:5000/api/prebuilds/category/Gaming";

// Function to format price correctly
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const GamingBuilds = () => {
  const { isDark, toggleTheme } = useTheme();
  const [gamingBuilds, setGamingBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilds, setSelectedBuilds] = useState([]); // Track selected builds
  const navigate = useNavigate();

  // Fetching gaming builds data from API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setGamingBuilds(response.data.data);
        } else {
          setError("Invalid API response format.");
          setGamingBuilds([]); // Prevent mapping errors
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to load gaming builds. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle the comparison button click
  const handleCompareClick = (build) => {
    setSelectedBuilds((prevSelected) => {
      if (prevSelected.some((selected) => selected._id === build._id)) {
        // If already selected, remove it from the selection
        return prevSelected.filter((selected) => selected._id !== build._id);
      } else if (prevSelected.length < 2) {
        // If less than 2 builds are selected, add it to the selection
        return [...prevSelected, build];
      }
      return prevSelected; // Keep the previous builds if 2 are already selected
    });
  };

  const isBuildSelected = (buildId) => {
    return selectedBuilds.some((build) => build._id === buildId);
  };

  // Navigate to gaming build details
  const handleNavigate = useCallback((id) => {
    navigate(`/gaming-builds/${id}`);
  }, [navigate]);

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      <h1 className="text-4xl font-bold mb-4 text-center">Gaming Builds</h1>
      <p className="text-lg text-gray-500 mb-8 text-center">
        Discover Premium Gaming Builds Tailored for High Performance!
      </p>
      <p className="text-lg mb-10 text-center">
        Click on a build to view more details and customize it to your liking.
      </p>

      {/* Loading, Error, and Empty States */}
      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : gamingBuilds.length === 0 ? (
        <p className="text-center text-xl">No gaming builds available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gamingBuilds.map((build) => (
            <div
              key={build._id}
              onClick={() => handleNavigate(build._id)} // Adding the navigation here
              className={`cursor-pointer p-4 rounded-lg shadow-lg transition-all hover:shadow-2xl ${
                isDark ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <img
                src={build.image || "https://via.placeholder.com/300"}
                alt={build.category}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-semibold">{build.category}</h2>
              <p>{build.description}</p>
              <p className="text-xl font-bold text-blue-600">{formatPrice(build.price)}</p>

              {/* Comparison Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation on button click
                  handleCompareClick(build);
                }}
                className={`mt-4 p-2 rounded-full transition-all ${isBuildSelected(build._id) ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
              >
                {isBuildSelected(build._id) ? "Selected" : "Compare"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Show comparison window if two builds are selected */}
      {selectedBuilds.length === 2 && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-indigo-700 p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-3xl font-bold mb-4 text-center">Comparison</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedBuilds.map((build) => (
                <div key={build._id} className="text-center">
                  <img
                    src={build.image || "https://via.placeholder.com/300"}
                    alt={build.category}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h1 className="text-3xl font-semibold">{build.description}</h1>
                  <p className="mt-3 text-xl font-bold text-green-400">{formatPrice(build.price)}</p>

                  {/* Displaying Specifications */}
                  <div className="mt-5 text-2xl text-balance">
                    <p className="text-xl font-semibold underline">Specifications</p>
                    <p><strong>CPU:</strong> {build.processor}</p>
                    <p><strong>GPU:</strong> {build.gpu}</p>
                    <p><strong>RAM:</strong> {build.ram}</p>
                    <p><strong>Storage:</strong> {build.storage}</p>
                    <p><strong>Power Supply:</strong> {build.powerSupply}</p>
                    <p><strong>Casing:</strong> {build.casings}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedBuilds([])} // Reset the comparison
                className="bg-red-500 text-white p-2 rounded-full"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamingBuilds;
