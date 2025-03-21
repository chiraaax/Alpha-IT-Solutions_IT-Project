import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

// API URL for budget builds
const API_URL = "http://localhost:5000/api/prebuilds/category/Budget";

// Function to format price correctly
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const BudgetBuilds = () => {
  const { isDark, toggleTheme } = useTheme();
  const [budgetBuilds, setBudgetBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching budget builds data from API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
        if (response.data && Array.isArray(response.data.data)) {
          setBudgetBuilds(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Invalid API response format.");
          setBudgetBuilds([]); // Prevent mapping errors
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching budget builds:", err);
        setError("Unable to load budget builds. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Navigate to budget build details
  const handleNavigate = useCallback((id) => {
    navigate(`/budget-builds/${id}`);
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

      <h1 className="text-4xl font-bold mb-4 text-center">Budget Builds</h1>
      <p className="text-lg text-gray-500 mb-8 text-center">
        Discover Premium Budget Builds Perfect for Everyday Work!
      </p>
      <p className="text-lg mb-10 text-center">
        Click on a build to view more details and customize it to your liking.
      </p>

      {/* Loading, Error, and Empty States */}
      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : budgetBuilds.length === 0 ? (
        <p className="text-center text-xl">No budget builds available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgetBuilds.map((build) => (
            <div
              key={build._id}
              onClick={() => handleNavigate(build._id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetBuilds;
