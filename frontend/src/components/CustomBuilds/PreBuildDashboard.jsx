import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCustomPreBuildModal from "./EditCustomPreBuild";
import { motion, AnimatePresence } from "framer-motion";

const PreBuildDashboard = () => {
  const [builds, setBuilds] = useState([]);
  const [productsLookup, setProductsLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  // Fetch pre-builds and all products concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch builds
        const buildsResponse = await axios.get("http://localhost:5000/api/prebuilds");
        setBuilds(buildsResponse.data.data);

        // Fetch all products and create a lookup by _id
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        const lookup = {};
        productsResponse.data.forEach((product) => {
          lookup[product._id] = product;
        });
        setProductsLookup(lookup);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this build?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/prebuilds/${id}`);
      setBuilds(builds.filter((build) => build._id !== id));
      alert("Build deleted successfully!");
    } catch (error) {
      console.error("Error deleting build:", error);
      alert("Failed to delete build.");
    }
  };

  // Refresh builds from the API (used after updating a build)
  const refreshBuilds = async () => {
    try {
      const buildsResponse = await axios.get("http://localhost:5000/api/prebuilds");
      setBuilds(buildsResponse.data.data);
    } catch (err) {
      console.error("Error refreshing builds:", err);
    }
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(builds.map(build => build.category))];

  const filteredBuilds = filterCategory === "all" 
    ? builds 
    : builds.filter(build => build.category === filterCategory);

    if (loading) return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-r-4 border-blue-500 border-solid rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-cyan-400 text-xl font-bold">LOADING BUILDS...</p>
        </div>
      </div>
    );
  
    if (error) return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center bg-gray-800 border-2 border-red-500 p-8 rounded-lg shadow-lg max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 text-xl font-bold mb-2">SYSTEM ERROR</p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  
    if (builds.length === 0) return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center bg-gray-800 border-2 border-cyan-500 p-8 rounded-lg shadow-lg max-w-md">
          <svg className="w-16 h-16 text-cyan-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-cyan-400 text-xl font-bold mb-2">NO BUILDS FOUND</p>
          <p className="text-gray-300">Create your first custom build to get started.</p>
        </div>
      </div>
    );

    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white w-auto bg-[url('/images/circuit-bg.png')] bg-fixed bg-opacity-10">
        {/* Notification */}
        <div id="notification" className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg opacity-0 translate-y-10 transition-all duration-300 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Build deleted successfully!
        </div>
        
        {/* Header with gradient and glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-20"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold py-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              PREBUILD DASHBOARD
            </h2>
            <div className="h-1 w-105 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"></div>
          </div>
        </div>

      {/* Filter controls */}
      <div className="flex mb-6 space-x-2 items-center bg-gray-800 p-4 rounded-lg shadow-lg">
        <span className="text-cyan-400 font-semibold">FILTER:</span>
        <div className="flex space-x-2 overflow-hidden pb-2">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 uppercase font-bold text-sm ${
                filterCategory === category 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Table with glass morphism effect */}
      <div className="overflow-x-auto rounded-lg shadow-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-gray-700/50">
              <th className="p-4">Image</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Processor</th>
              <th className="p-4">GPU</th>
              <th className="p-4">RAM</th>
              <th className="p-4">Storage</th>
              <th className="p-4">Power Supply</th>
              <th className="p-4">Casings</th>
              <th className="p-4">Description</th>
              <th className="p-4">Compatibility</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredBuilds.map((build, index) => (
                <motion.tr 
                  key={build._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors`}
                >
                  <td className="p-4">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative">
                        <img 
                          src={build.image} 
                          alt={build.category} 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-600 group-hover:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full font-medium">
                      {build.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-lime-400 font-bold">
                    LKR {build.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.processor]
                      ? productsLookup[build.processor].description
                      : build.processor}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.gpu]
                      ? productsLookup[build.gpu].description
                      : build.gpu}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.ram]
                      ? productsLookup[build.ram].description
                      : build.ram}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.storage]
                      ? productsLookup[build.storage].description
                      : build.storage}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.powerSupply]
                      ? productsLookup[build.powerSupply].description
                      : build.powerSupply}
                  </td>
                  <td className="p-4 text-gray-300">
                    {productsLookup[build.casings]
                      ? productsLookup[build.casings].description
                      : build.casings}
                  </td>
                  <td className="p-4 text-gray-300 max-w-xs truncate">
                    {build.description}
                  </td>
                  <td className="p-4 text-gray-300">
                    {build.compatibility ? (
                      <div className="space-y-1">
                        {Object.entries(build.compatibility).map(([category, prodIds]) => (
                          <div key={category} className="text-sm">
                            <span className="text-cyan-400 font-medium">{category}: </span>
                            <span>
                              {prodIds && prodIds.length > 0
                                ? prodIds
                                    .map((id) =>
                                      productsLookup[id]
                                        ? productsLookup[id].description
                                        : id
                                    )
                                    .join(", ")
                                : "None"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "None"
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedBuild(build)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-bold flex items-center justify-center group"
                      >
                        <span className="group-hover:scale-105 transition-transform duration-300">EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(build._id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-900 transition-all duration-300 font-bold flex items-center justify-center group"
                      >
                        <span className="group-hover:scale-105 transition-transform duration-300">DELETE</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {selectedBuild && (
        <EditCustomPreBuildModal
          build={selectedBuild}
          onClose={() => setSelectedBuild(null)}
          refreshBuilds={refreshBuilds}
          // Pass product options filtered by category using the lookup:
          processorOptions={Object.values(productsLookup).filter((p) => p.category === "processor")}
          gpuOptions={Object.values(productsLookup).filter((p) => p.category === "gpu")}
          ramOptions={Object.values(productsLookup).filter((p) => p.category === "ram")}
          storageOptions={Object.values(productsLookup).filter((p) => p.category === "storage")}
          powerSupplyOptions={Object.values(productsLookup).filter((p) => p.category === "powerSupply")}
          casingsOptions={Object.values(productsLookup).filter((p) => p.category === "casings")}
        />
      )}
    </div>
  );
};

export default PreBuildDashboard;