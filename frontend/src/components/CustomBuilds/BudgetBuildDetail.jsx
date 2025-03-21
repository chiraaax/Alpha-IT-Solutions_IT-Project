import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./ThemeContext"; // Assuming you have this context
import { FaSun, FaMoon } from "react-icons/fa"; // For theme toggle icons

const BudgetBuildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/prebuilds/${id}`)
      .then((response) => {
        if (response.data) {
          setBuild(response.data.data || response.data);
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

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!build) return <p className="text-center text-red-500">Build not found.</p>;

  // Helper function to format price
  const formatPrice = (price) => {
    return price ? price.toLocaleString() : "N/A";
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

      <div className={`max-w-6xl mx-auto p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6 transition-all ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
        {/* Left Column - Image */}
        <div className="w-full md:w-1/2">
          <img
            src={build.image || "https://via.placeholder.com/600"}
            alt={build.category}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right Column - Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-center sm:text-left mb-3">{build.category} Build</h1>
            <p className="text-lg mb-4">{build.description}</p>

            {/* Price & Availability */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-500">{formatPrice(build.price)}</p>
              <p className="text-sm text-green-500 font-semibold">✅ In Stock</p>
            </div>

            {/* Specification Table */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <table className={`w-full border-collapse border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                <tbody>
                  {[
                    { label: "CPU", value: build.cpu },
                    { label: "GPU", value: build.gpu },
                    { label: "RAM", value: build.ram },
                    { label: "Storage", value: build.storage },
                    { label: "PSU", value: build.psu },
                    { label: "Casing", value: build.casing },
                  ].map((spec, index) => (
                    <tr key={index} className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                      <td className={`p-2 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {spec.label}
                      </td>
                      <td className={`p-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{spec.value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              🛒 Add to Cart
            </button>
            <button
              onClick={() => navigate(`/customize-build/${id}`)}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              🛠️ Customize Build
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className={`max-w-6xl mx-auto mt-8 p-6 shadow-lg rounded-lg transition-all ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <p className={isDark ? "text-gray-300 italic" : "text-gray-600 italic"}>No reviews yet. Be the first to leave a review!</p>
      </div>
    </div>
  );
};

export default BudgetBuildDetail;
