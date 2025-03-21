import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GamingBuildDetail = () => {
  const { id } = useParams(); // Get the build ID from URL
  const navigate = useNavigate(); // For navigation
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
        
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
            <h1 className="text-3xl font-bold mb-3">{build.category} Build</h1>
            <p className="text-gray-700 text-lg">{build.description}</p>
            
            {/* Price & Availability */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-600">
                ${build.price ? build.price.toLocaleString() : "N/A"}
              </p>
              <p className="text-sm text-green-600 font-semibold">✅ In Stock</p>
            </div>

            {/* Specification Table */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {[
                    { label: "CPU", value: build.cpu },
                    { label: "GPU", value: build.gpu },
                    { label: "RAM", value: build.ram },
                    { label: "Storage", value: build.storage },
                    { label: "PSU", value: build.psu },
                    { label: "Casing", value: build.casing },
                  ].map((spec, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-semibold text-gray-700">{spec.label}</td>
                      <td className="p-2">{spec.value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
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
      <div className="max-w-5xl mx-auto bg-white mt-8 p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <p className="text-gray-600 italic">No reviews yet. Be the first to leave a review!</p>
      </div>
    </div>
  );
};

export default GamingBuildDetail;
