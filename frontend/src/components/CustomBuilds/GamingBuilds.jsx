import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

// Fixed API URL
const API_URL = "http://localhost:5000/api/prebuilds/category/Gaming";

// Price Formatting Function
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const GamingBuilds = () => {
  const { isDark, toggleTheme } = useTheme();
  const [gamingBuilds, setGamingBuilds] = useState([]); // Ensure it's initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data); // Debug API response
        if (response.data && Array.isArray(response.data.data)) {
          setGamingBuilds(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setGamingBuilds([]); // Prevent .map() errors
          setError("Invalid API response format.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gaming builds:", err);
        setGamingBuilds([]); // Ensure state is always an array
        setError("Unable to load gaming builds. Please try again later.");
        setLoading(false);
      });
  }, []);

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
        Discover the Ultimate Gaming Builds for Every Gamer!
      </p>
      <p className="text-lg mb-10 text-center">
        Click on a build to view more details and customize it to your liking.
      </p>

      {/* Handling Loading, Error, and Empty States */}
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
              onClick={() => navigate(`/gaming-builds/${build._id}`)}
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

export default GamingBuilds;
