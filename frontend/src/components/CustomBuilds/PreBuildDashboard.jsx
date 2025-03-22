import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCustomPreBuildModal from "./EditCustomPreBuild";

const PreBuildDashboard = () => {
  const [builds, setBuilds] = useState([]);
  const [productsLookup, setProductsLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);

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

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (builds.length === 0) return <p className="text-center text-white">No builds available.</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white w-auto">
      <h2 className="text-3xl font-bold mb-4">PreBuild Dashboard - All Builds</h2>
      <table className="w-full text-left border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Image</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Processor</th>
            <th className="p-2">GPU</th>
            <th className="p-2">RAM</th>
            <th className="p-2">Storage</th>
            <th className="p-2">Power Supply</th>
            <th className="p-2">Casings</th>
            <th className="p-2">Description</th>
            <th className="p-2">Compatibility</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {builds.map((build) => (
            <tr key={build._id} className="border-b border-gray-700">
              <td className="p-2">
                <img src={build.image} alt={build.category} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="p-2">{build.category}</td>
              <td className="p-2">LKR {build.price.toFixed(2)}</td>
              <td className="p-2">
                {productsLookup[build.processor]
                  ? productsLookup[build.processor].description
                  : build.processor}
              </td>
              <td className="p-2">
                {productsLookup[build.gpu]
                  ? productsLookup[build.gpu].description
                  : build.gpu}
              </td>
              <td className="p-2">
                {productsLookup[build.ram]
                  ? productsLookup[build.ram].description
                  : build.ram}
              </td>
              <td className="p-2">
                {productsLookup[build.storage]
                  ? productsLookup[build.storage].description
                  : build.storage}
              </td>
              <td className="p-2">
                {productsLookup[build.powerSupply]
                  ? productsLookup[build.powerSupply].description
                  : build.powerSupply}
              </td>
              <td className="p-2">
                {productsLookup[build.casings]
                  ? productsLookup[build.casings].description
                  : build.casings}
              </td>
              <td className="p-2">{build.description}</td>
              <td className="p-2">
                {build.compatibility ? (
                  Object.entries(build.compatibility).map(([category, prodIds]) => (
                    <div key={category}>
                      <strong>{category}: </strong>
                      {prodIds && prodIds.length > 0
                        ? prodIds
                            .map((id) =>
                              productsLookup[id]
                                ? productsLookup[id].description
                                : id
                            )
                            .join(", ")
                        : "None"}
                    </div>
                  ))
                ) : (
                  "None"
                )}
              </td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedBuild(build)}
                  className="px-5.5 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 mb-3 font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(build._id)}
                  className="px-3 py-2.5 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
