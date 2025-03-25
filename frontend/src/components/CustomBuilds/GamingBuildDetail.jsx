import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";

const GamingBuildDetail = () => {
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Retrieve cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for storing validation messages
  const [validationMessages, setValidationMessages] = useState([]);

  // Products lookup state for mapping product IDs to details
  const [productsLookup, setProductsLookup] = useState({});
  // Modal state for editing build details
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Compatibility options fetched based on the build's compatibility field
  const [compatibilityOptions, setCompatibilityOptions] = useState({
    processor: [],
    gpu: [],
    ram: [],
    storage: [],
    powerSupply: [],
    casings: [],
  });
  // Local state for the edited build. Initially, we use the fetched build data.
  const [editedBuild, setEditedBuild] = useState(null);
  // Local state for temporary messages (confirmation or warning)
  const [message, setMessage] = useState("");

  // Fetch build details and products lookup concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch build details (global prebuild data)
        const buildResponse = await axios.get(`http://localhost:5000/api/prebuilds/${id}`);
        const fetchedBuild = buildResponse.data.data || buildResponse.data;
        if (fetchedBuild) {
          setBuild(fetchedBuild);
          // Initialize editedBuild with the current build values for a user-specific copy.
          setEditedBuild({ ...fetchedBuild });
        } else {
          setError("No data found for this build.");
        }

        // Fetch all products and create a lookup by _id
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        const lookup = {};
        productsResponse.data.forEach((product) => {
          lookup[product._id] = product;
        });
        setProductsLookup(lookup);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load build details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // When the edit modal opens, fetch compatibility options from the backend
  useEffect(() => {
    if (isEditModalOpen && build && build.compatibility) {
      axios
        .get(`http://localhost:5000/api/prebuilds/${id}/compatibility`)
        .then((response) => {
          setCompatibilityOptions(response.data.data);
        })
        .catch((err) => {
          console.error("Error fetching compatibility options:", err);
        });
    }
  }, [isEditModalOpen, build, id]);

  // Helper: Given a product id and options, return its price
  const getProductPrice = (id, options) => {
    const prod = options.find((p) => p._id === id);
    return prod ? Number(prod.price) : 0;
  };

  // Recalculate the total price based on current selections (user-specific)
  const recalcPrice = () => {
    if (!editedBuild || !compatibilityOptions) return;
    const total =
      getProductPrice(editedBuild.processor, compatibilityOptions.processor) +
      getProductPrice(editedBuild.gpu, compatibilityOptions.gpu) +
      getProductPrice(editedBuild.ram, compatibilityOptions.ram) +
      getProductPrice(editedBuild.storage, compatibilityOptions.storage) +
      getProductPrice(editedBuild.powerSupply, compatibilityOptions.powerSupply) +
      getProductPrice(editedBuild.casings, compatibilityOptions.casings);
    setEditedBuild((prev) => ({ ...prev, price: total }));
  };

  // Recalculate price whenever any selection changes
  useEffect(() => {
    if (editedBuild && compatibilityOptions) {
      recalcPrice();
    }
  }, [
    editedBuild?.processor,
    editedBuild?.gpu,
    editedBuild?.ram,
    editedBuild?.storage,
    editedBuild?.powerSupply,
    editedBuild?.casings,
    compatibilityOptions
  ]);

  // Handler to update editedBuild when a dropdown changes
  const handleEditChange = (field, selectedId) => {
    setEditedBuild((prev) => ({ ...prev, [field]: selectedId }));
  };
  
  // Save the changes from the edit modal locally (without updating the global prebuild)
  const handleSaveChanges = () => {
    setBuild(editedBuild);
    setIsEditModalOpen(false);
  };

  // Helper to format price as LKR
  const formatPrice = (price) => {
    return price
      ? price.toLocaleString("en-US", { style: "currency", currency: "LKR" })
      : "N/A";
  }; 

  // Handler for generating PDF report (order detail)
  const handleDownloadPdf = () => {
    if (!build) return;
    
    const doc = new jsPDF();

    // Add title and build details
    doc.setFontSize(18);
    doc.text("Order Detail Report", 14, 22);

    doc.setFontSize(12);
    let yPos = 30;
    const details = [
      { label: "Category", value: build.category },
      { label: "Description", value: build.description },
      { label: "Price", value: formatPrice(build.price) },
    ];
    details.forEach((detail) => {
      doc.text(`${detail.label}: ${detail.value}`, 14, yPos);
      yPos += 10;
    });

    // Optionally, list specifications
    yPos += 5;
    doc.text("Specifications:", 14, yPos);
    yPos += 10;
    const specs = [
      { label: "Processor", value: productsLookup[build.processor] ? productsLookup[build.processor].description : build.processor },
      { label: "GPU", value: productsLookup[build.gpu] ? productsLookup[build.gpu].description : build.gpu },
      { label: "RAM", value: productsLookup[build.ram] ? productsLookup[build.ram].description : build.ram },
      { label: "Storage", value: productsLookup[build.storage] ? productsLookup[build.storage].description : build.storage },
      { label: "Power Supply", value: productsLookup[build.powerSupply] ? productsLookup[build.powerSupply].description : build.powerSupply },
      { label: "Casings", value: productsLookup[build.casings] ? productsLookup[build.casings].description : build.casings },
    ];
    specs.forEach((spec) => {
      doc.text(`${spec.label}: ${spec.value}`, 14, yPos);
      yPos += 10;
    });

    // Save the PDF
    doc.save("OrderDetailReport.pdf");
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center">{error}</p>;
  if (!build)
    return <p className="text-center text-red-500">Build not found.</p>;

  // Display specifications using productsLookup (for non-edit mode)
  const specs = [
    {
      id: "spec-processor",
      label: "Processor",
      value: productsLookup[build.processor]
        ? productsLookup[build.processor].description
        : build.processor,
    },
    {
      id: "spec-gpu",
      label: "GPU",
      value: productsLookup[build.gpu]
        ? productsLookup[build.gpu].description
        : build.gpu,
    },
    {
      id: "spec-ram",
      label: "RAM",
      value: productsLookup[build.ram]
        ? productsLookup[build.ram].description
        : build.ram,
    },
    {
      id: "spec-storage",
      label: "Storage",
      value: productsLookup[build.storage]
        ? productsLookup[build.storage].description
        : build.storage,
    },
    {
      id: "spec-powerSupply",
      label: "Power Supply",
      value: productsLookup[build.powerSupply]
        ? productsLookup[build.powerSupply].description
        : build.powerSupply,
    },
    {
      id: "spec-casings",
      label: "Casings",
      value: productsLookup[build.casings]
        ? productsLookup[build.casings].description
        : build.casings,
    },
  ];

  // Check if the current gaming build (prebuild) is already in the cart
  const isGamingBuildInCart = () => {
    return cartItems.some((item) => item._id === build?._id);
  };

  // Add to Cart functionality using prebuild fields: _id, price, image, description.
  const handleAddToCart = () => {
    if (isGamingBuildInCart()) {
      setMessage("Build is already in cart. Adjust quantity in the shopping cart.");
      setTimeout(() => {
        navigate('/ShoppingCart');
        setMessage('');
      }, 2000);
      return;
    }

    const { _id, description, price, image } = build;
    dispatch({
      type: "ADD_TO_CART",
      payload: { _id, description, price, image, quantity: 1 },
    });
    setMessage("Build added to cart!");
    setTimeout(() => {
      navigate('/ShoppingCart');
      setMessage('');
    }, 2000);
  };

  return (
    <div className={`min-h-screen py-10 px-4 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      {/* Message display */}
      {message && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fadeIn">
          {message}
        </div>
      )}

      <div className={`max-w-6xl mx-auto p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6 transition-all ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
        {/* Left Column – Image */}
        <div className="w-full md:w-1/2">
          <img
            src={build.image || "https://via.placeholder.com/600"}
            alt={build.category}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right Column – Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/30 backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-bold text-center sm:text-left mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-md">{build.description}</h1>
            <p className="text-lg mb-4 text-cyan-300 font-mono tracking-wide"> Build Type :- {build.category} <span className="inline-block animate-pulse"></span>Build</p>
            
            {/* Price & Availability */}
            <div className="mt-6 p-4 bg-black/40 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
              <p className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <span className="text-base text-gray-400 font-mono">PRICE:</span>
                {formatPrice(build.price)}
              </p>
              <p className="text-sm text-green-400 font-semibold flex items-center gap-2 mt-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> 
                AVAILABLE NOW
              </p>
            </div>
            
            {/* Specification Table */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3 text-cyan-300 font-mono uppercase tracking-wider flex items-center">
                <span className="w-1 h-6 bg-purple-500 mr-2 inline-block"></span>
                Specifications
              </h2>
              <div className="overflow-hidden rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                <table className="w-full border-collapse">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr 
                        key={spec.id} 
                        className={`border-b border-cyan-900/50 hover:bg-cyan-900/20 transition-colors ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/40'}`}
                      >
                        <td className="p-3 font-mono text-cyan-400 text-sm">{spec.label}</td>
                        <td className="p-3 text-gray-300 font-medium">{spec.value || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleAddToCart}
                disabled={isGamingBuildInCart()}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700 ${isGamingBuildInCart() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                🛒 Add to Cart
              </button>
          
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-md hover:from-purple-500 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg shadow-purple-700/30 flex items-center justify-center gap-2 group"
              >
                <span className="text-purple-300 group-hover:scale-110 transition-transform">🛠️</span> 
                <span>CUSTOMIZE BUILD</span>
              </button>
          
              {/* Button to download the order detail PDF */}
              <button
                onClick={handleDownloadPdf}
                className="bg-gradient-to-r from-green-700 to-green-800 text-white px-6 py-3 rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium border border-cyan-500/30 shadow-lg shadow-gray-900/30 flex items-center justify-center gap-2 group"
              >
                <span className="text-cyan-300 group-hover:scale-110 transition-transform">📄</span> 
                <span>DOWNLOAD ORDER REPORT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className={`text-center p-8 ${
        isDark ? "text-gray-400" : "text-gray-500"
      } italic border-2 border-dashed ${
        isDark ? "border-gray-700" : "border-gray-300"
      } rounded-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p className="text-lg">No reviews yet. Be the first to leave a review!</p>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editedBuild && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-800 to-purple-800 bg-opacity-75 flex items-center justify-center z-50">
          <div 
            className={`relative w-full max-w-lg border border-cyan-500 rounded-lg shadow-2xl overflow-hidden
              ${isDark ? "bg-gray-900 text-white" : "bg-gray-800 text-gray-100"}`}
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 rounded-lg"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            {/* Header with futuristic design */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-cyan-600">
              <div className="flex items-center">
                <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                <div className="mr-2 w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="mr-4 w-3 h-3 rounded-full bg-green-500"></div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                  CUSTOMIZE YOUR BUILD
                </h2>
              </div>
            </div>
            
            {/* Modal content with tech styling */}
            <div className="relative p-6 max-h-[70vh] overflow-y-auto">
              {/* Component selection form */}
              {[
                { field: "processor", label: "PROCESSOR", options: compatibilityOptions.processor, icon: "⚡" },
                { field: "gpu", label: "GRAPHICS", options: compatibilityOptions.gpu, icon: "🎮" },
                { field: "ram", label: "RAM", options: compatibilityOptions.ram, icon: "💾" },
                { field: "storage", label: "STORAGE", options: compatibilityOptions.storage, icon: "💿" },
                { field: "powerSupply", label: "PSU", options: compatibilityOptions.powerSupply, icon: "⚡" },
                { field: "casings", label: "CASING", options: compatibilityOptions.casings, icon: "🖥️" },
              ].map(({ field, label, options, icon }) => (
                <div key={field} className="mb-5 group">
                  <label className="flex items-center font-bold text-sm tracking-wider mb-2 text-cyan-400">
                    <span className="mr-2">{icon}</span>
                    {label}
                  </label>
                  {options && options.length ? (
                    <div className="relative">
                      <select
                        value={editedBuild[field] || ""}
                        onChange={(e) => handleEditChange(field, e.target.value)}
                        className="w-full p-3 pl-4 pr-10 bg-gray-800 border border-gray-700 focus:border-cyan-500 
                          rounded text-gray-200 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500
                          transition-all duration-300 hover:border-cyan-400"
                      >
                        <option value="">{`Select ${label}`}</option>
                        {options.map((option) => (
                          <option key={option._id} value={option._id}>
                            {option.description} - (LKR {option.price})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400 italic bg-gray-800 bg-opacity-50 p-3 rounded border border-red-900">
                      No components available in this category
                    </p>
                  )}
                </div>
              ))}
              
              {/* Price display with tech styling */}
              <div className="mb-6 relative group">
                <label className="flex items-center font-bold text-sm tracking-wider mb-2 text-cyan-400">
                  <span className="mr-2">💰</span>
                  TOTAL COST
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatPrice(editedBuild.price)}
                    readOnly
                    className="w-full p-3 bg-gray-800 text-cyan-300 font-mono text-lg tracking-wider rounded border border-gray-700
                      focus:outline-none focus:ring-1 focus:ring-cyan-500 text-right pr-12"
                  />
                  <div className="absolute right-3 inset-y-0 flex items-center text-cyan-400 font-bold">
                    LKR
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons with gaming style */}
            <div className="relative p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2 rounded bg-gray-800 text-gray-300 font-bold tracking-wide 
                  hover:bg-gray-700 transition-all duration-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                CANCEL
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold 
                  tracking-wide hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 flex items-center
                  shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                SAVE BUILD
              </button>
            </div>
          </div>
        </div>  
      )}
    </div>
  );
};

export default GamingBuildDetail;