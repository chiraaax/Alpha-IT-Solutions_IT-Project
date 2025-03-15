import React from "react";

// Sample PC Builds with added specs and ratings
const preBuilds = [
  {
    id: 1,
    name: "Gaming PC - Entry Level",
    price: "$800",
    image: "/assets/entry_level_pc.jpg",
    rating: 4.2,
    description: "Perfect for casual gaming and everyday tasks.",
    specs: "Intel Core i5, 16GB RAM, GTX 1650",
  },
  {
    id: 2,
    name: "Gaming PC - Mid Range",
    price: "$1200",
    image: "/assets/mid_range_pc.jpg",
    rating: 4.8,
    description: "A balance of performance and price for most gamers.",
    specs: "Intel Core i7, 16GB RAM, RTX 3060",
  },
];

const CustomPreBuildList = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
      {preBuilds.map((build) => (
        <div
          key={build.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl p-4"
        >
          {/* Product Image */}
          <img
            src={build.image}
            alt={build.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{build.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{build.description}</p>

            {/* Product Price */}
            <p className="text-lg font-bold text-primary-color mb-2">{build.price}</p>

            {/* Rating */}
            <div className="flex justify-center items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${index < build.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.212-6 5.853 1.416 8.167-7.416-3.9-7.416 3.9 1.416-8.167-6-5.853 8.332-1.212z"></path>
                </svg>
              ))}
            </div>

            {/* Specs */}
            <div className="text-gray-600 text-sm mb-4">
              <p>{build.specs}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                View Details
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomPreBuildList;
