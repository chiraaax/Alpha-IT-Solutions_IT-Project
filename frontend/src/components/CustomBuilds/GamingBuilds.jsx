import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

// API URL for gaming builds
const API_URL = "http://localhost:5000/api/prebuilds/category/Gaming";

// Function to format price correctly
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

// API URL for gaming builds
const API_URL = "http://localhost:5000/api/prebuilds/category/Gaming";

// Function to format price correctly
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useTheme } from './ThemeContext'; // Import the useTheme hook
import { FaSun, FaMoon } from 'react-icons/fa'; // Import FontAwesome sun and moon icons

const gamingBuilds = [
  {
    id: 1,
    name: "Ultimate Gaming Rig",
    description: "Top-tier performance for 4K gaming.",
    components: "Intel i9, RTX 3080, 32GB RAM, 1TB SSD",
    price: 2500, // Store price as a number for formatting
    image: "../../assets/ultimate-gaming-rig.jpg", // Replace with actual image path
  },
  {
    id: 2,
    name: "Mid-Range Gaming PC",
    description: "Great performance for 1440p gaming.",
    components: "AMD Ryzen 5, RTX 3060, 16GB RAM, 512GB SSD",
    price: 1200,
    image: "../../assets/ultimate-gaming-rig.jpg", // Replace with actual image path
  },
  {
    id: 3,
    name: "Budget Gaming Build",
    description: "Affordable gaming without compromising performance.",
    components: "Intel i5, GTX 1650, 8GB RAM, 256GB SSD",
    price: 800,
    image: "../../assets/ultimate-gaming-rig.jpg", // Replace with actual image path
  },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
  }).format(price);
};

const GamingBuilds = () => {
  const { isDark, toggleTheme } = useTheme();
  const [gamingBuilds, setGamingBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilds, setSelectedBuilds] = useState([]);
  const [productsLookup, setProductsLookup] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
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
          setGamingBuilds([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to load gaming builds. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Fetch products data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        const lookup = {};
        response.data.forEach((product) => {
          lookup[product._id] = product;
        });
        setProductsLookup(lookup);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle the comparison button click
  const handleCompareClick = (build) => {
    setSelectedBuilds((prevSelected) => {
      if (prevSelected.some((selected) => selected._id === build._id)) {
        return prevSelected.filter((selected) => selected._id !== build._id);
      } else if (prevSelected.length < 2) {
        return [...prevSelected, build];
      }
      return prevSelected;
    });
  };

  const isBuildSelected = (buildId) => {
    return selectedBuilds.some((build) => build._id === buildId);
  };

  // Navigate to gaming build details
  const handleNavigate = useCallback(
    (id) => {
      navigate(`/gaming-builds/${id}`);
    },
    [navigate]
  );

  // Helper: Retrieve product description from the lookup if available
  const getProductDescription = (productId, fallback) => {
    return productsLookup[productId]
      ? productsLookup[productId].description
      : fallback;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  const { isDark, toggleTheme } = useTheme(); // Get dark mode state and toggle function

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-r from-purple-900 to-blue-900" : "bg-gradient-to-r from-blue-800 to-purple-900"} py-20`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-transparent opacity-10" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1593305841991-05c297ba4575')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">                      
      <div className="text-8xl flex flex-col items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 mb-4">
      <span className="font-bold bg-clip-text bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 mb-10">



        Gaming Builds </span>
        </div>

          <p className="text-xl text-center text-white/90 mb-6 max-w-3xl mx-auto  ">
            Discover Premium Gaming Builds Tailored for High Performance Gaming Excellence
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" })}
              className="bg-white text-blue-600 hover:bg-purple-200 transition-all duration-300 font-semibold px-8 py-3 rounded-full shadow-lg"
            >
              Explore Builds
            </button>
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all hover:bg-blue-700 focus:outline-none"
          aria-label="Scroll to top"
        >
          <FaChevronUp />
        </button>
      )}

      <div className="container mx-auto px-6 py-16">
        {/* Loading States */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        ) : gamingBuilds.length === 0 ? (
          <div className="text-center p-10 bg-gray-100 rounded-lg">
            <p className="text-xl font-semibold text-gray-600">No gaming builds available at the moment.</p>
            <p className="mt-2 text-gray-500">Please check back later for new builds.</p>
          </div>
        ) : (
          <motion.div 
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mx-auto mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {gamingBuilds.map((build) => (
              <motion.div
                key={build._id}
                variants={itemVariants}
                className=
                {`cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                  isDark ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
                }`}
                onClick={(e) => handleNavigate(build._id)()}
                
              >
                <div className="relative overflow-hidden">
                  <img
                    src={build.image || "https://via.placeholder.com/800x600?text=Gaming+Build"}
                    alt={build.category}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div 
                    className={`absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-white`}
                    onClick={(e) => handleNavigate(build._id)()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(build._id);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2 transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompareClick(build);
                      }}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        isBuildSelected(build._id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                    >
                      {isBuildSelected(build._id) ? "Selected" : "Compare"}
                    </button>
                  </div>
                      <button                      
                      className={`px-6 py-2 rounded-lg transition-all ${
                        isBuildSelected(build._id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                    >
                      {isBuildSelected(build._id) ? "" : ""}
                    </button>
                </div>
                
                <div className="text-xl p-6" onClick={() => handleNavigate(build._id)}>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold">{build.description}</h2>
                    <span className="text-xl font-mono font text-blue-600">{formatPrice(build.price)}</span>
                  </div>
                  <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{build.category}</p>
                  
                  <div className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <span className="font-medium">Processor:</span>
                        <p className="truncate">{getProductDescription(build.processor, "High-performance CPU")}</p>
                      </div>
                      <div className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <span className="font-medium">GPU:</span>
                        <p className="truncate">{getProductDescription(build.gpu, "Gaming Graphics")}</p>
                      </div>                      
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
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
                className={`mt-4 p-2 rounded-full transition-all ${
                  isBuildSelected(build._id) ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {isBuildSelected(build._id) ? "Selected" : "Compare"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {selectedBuilds.length === 2 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-6 rounded-xl shadow-2xl w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-gradient-to-br from-gray-900 to-sky-600 p-6 rounded-xl border border-sky-500/30-gray-900" : "bg-gradient-to-br from-sky-500 to-gray-800 p-6 rounded-xl border border-sky-500/30"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Build Comparison</h2>
              <button
                onClick={() => setSelectedBuilds([])}
                className="p-2 rounded-full bg-bg-gray-200 hover:bg-red-600 transition-colors"
                aria-label="Close comparison"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {selectedBuilds.map((build) => (
                <div 
                  key={build._id}
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <img
                    src={build.image || "https://via.placeholder.com/800x600?text=Gaming+Build"}
                    alt={build.category}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-2xl font-bold mb-2">{build.description}</h3>
                    <p className="text-xl font-mono font-bold text-green-500 mb-6">{formatPrice(build.price)}</p>

                    <div className={`p-4 rounded-lg mb-4 ${isDark ? "bg-gray-700" : "bg-sky-200"}`}>
                      <h4 className="text-xl font-bold mb-3 border-b pb-2">Specifications</h4>
                      
                      {[
                        { label: "Processor :", value: getProductDescription(build.processor, build.processor) },
                        { label: "GPU :", value: getProductDescription(build.gpu, build.gpu) },
                        { label: "RAM :", value: getProductDescription(build.ram, build.ram) },
                        { label: "Storage :", value: getProductDescription(build.storage, build.storage) },
                        { label: "Power Supply :", value: getProductDescription(build.powerSupply, build.powerSupply) },
                        { label: "Casing :", value: getProductDescription(build.casings, build.casings) }
                      ].map((spec, index) => (
                        <div key={index} className="flex mb-3 mt-5 ">
                          <span className={`font-black ${isDark ? "text-purple-200" : "text-gray-700"}`}>{spec.label}</span>                          
                          <div key={index} className="flex mb-3 ml-3">
                          <span className={isDark ? "text-gray-200" : "text-gray-600"}>{spec.value}</span>
                        </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleNavigate(build._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      View Build Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">Gaming Builds</h1>
      <p className="text-gray-700 mb-8">Explore our range of high-performance gaming builds!</p>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gamingBuilds.map(build => (
          <Link 
            key={build.id} 
            to={`/gaming-builds/gaming/${build.id}`} // Updated path here
            className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <img src={build.image} alt={build.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{build.name}</h2>
            <p>{build.description}</p>
            <p className="font-bold">{build.components}</p>
            <p className="text-xl text-blue-600">{formatPrice(build.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamingBuilds;