import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gamingImg from "../../assets/gamingb.jpg";
import budgetImg from "../../assets/budgetb.jpg";

const preBuilds = [
  {
    id: 1,
    name: "Gaming Builds",
    image: gamingImg,
    description: "Ultimate performance for serious gamers. Perfect for 1440p/4K gaming.",
    link: "/gaming-builds",
    modernSuitability: "🔹 Best for 2024 high-end gaming",
    performance: "🔥 High-performance graphics and processing",
    price: "$1,500 - $2,000",
    comparisonDescription: "Dominates AAA titles at max settings 1440p/4K",
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "NVIDIA RTX 4080 16GB",
    ram: "32GB DDR5 6000MHz",
    storage: "2TB NVMe SSD",
    gamingPerformance: "1440p @ 144+ FPS | 4K @ 90+ FPS",
    upgradePotential: "PCIe 5.0 ready, 1000W PSU for future GPUs",
    pros: ["4K gaming ready", "Excellent ray tracing", "Future-proof specs"],
    cons: ["Higher power consumption", "Premium price tag"],
    rating: 4.8,
    energyEfficiency: "850W PSU (80+ Gold)",
    warranty: "3 years parts + labor",
    aesthetics: "Tempered glass RGB case",
    priceToPerformance: 85,
    purchaseLink: "#",
    customizeLink: "#"
  },
  {
    id: 2,
    name: "Budget Builds",
    image: budgetImg,
    description: "Great for esports and productivity. 1080p gaming champion.",
    link: "/budget-builds",
    modernSuitability: "✅ Perfect for 1080p gaming",
    performance: "⚡ Smooth esports performance",
    price: "$600 - $800",
    comparisonDescription: "Excellent 1080p value with upgrade potential",
    cpu: "Intel Core i5-13400F",
    gpu: "AMD Radeon RX 7600 8GB",
    ram: "16GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    gamingPerformance: "1080p @ 100+ FPS | 1440p @ 60+ FPS",
    upgradePotential: "2 RAM slots free, 650W PSU headroom",
    pros: ["Great value", "Energy efficient", "Easy to upgrade"],
    cons: ["Limited ray tracing", "No 4K capability"],
    rating: 4.5,
    energyEfficiency: "550W PSU (80+ Bronze)",
    warranty: "2 years parts only",
    aesthetics: "Minimalist micro-ATX case",
    priceToPerformance: 92,
    purchaseLink: "#",
    customizeLink: "#"
  },
];

const BuildCard = React.memo(({ build, isSelected, onCompare }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 120, damping: 10 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-transform duration-200"
  >
    <Link to={build.link} aria-label={`View ${build.name}`}>
      <img
        src={build.image}
        alt={build.name}
        className="w-full h-48 object-cover rounded-xl mb-5 border border-gray-200 dark:border-gray-700"
        loading="lazy"
      />
    </Link>

    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        {build.name}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{build.description}</p>
      <p className="text-sm font-semibold text-blue-500 dark:text-blue-400">
        {build.modernSuitability}
      </p>
    </div>

    <button
      onClick={() => onCompare(build)}
      className={`w-full py-2 rounded-lg transition-colors duration-200 font-bold ${
        isSelected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
      } text-white`}
    >
      {isSelected ? "Remove Comparison" : "Compare Build"}
    </button>
  </motion.div>
));

const ComparisonCard = ({ build }) => (
  <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">{build.name}</h3>
    
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-1">CPU</p>
        <p className="text-sm">{build.cpu}</p>
      </div>
      
      <div>
        <p className="text-sm font-semibold mb-1">GPU</p>
        <p className="text-sm">{build.gpu}</p>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">RAM</p>
        <p className="text-sm">{build.ram}</p>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Storage</p>
        <p className="text-sm">{build.storage}</p>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Performance</p>
        <p className="text-sm">{build.gamingPerformance}</p>
      </div>
      
      <div>
        <p className="text-sm font-semibold mb-1">Upgrade Potential</p>
        <p className="text-sm">{build.upgradePotential}</p>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Pros</p>
        <ul className="list-disc list-inside space-y-1">
          {build.pros.map((pro, i) => (
            <li key={i} className="text-sm">{pro}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Cons</p>
        <ul className="list-disc list-inside space-y-1">
          {build.cons.map((con, i) => (
            <li key={i} className="text-sm">{con}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Price-to-Performance</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${build.priceToPerformance}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

const CustomPreBuildList = ({ selectedBuilds, setSelectedBuilds }) => {
  const handleCompare = useCallback((build) => {
    setSelectedBuilds(prev => 
      prev.some(b => b.id === build.id) 
        ? prev.filter(b => b.id !== build.id)
        : prev.length < 2 ? [...prev, build] : prev
    );
  }, [setSelectedBuilds]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {preBuilds.map(build => (
          <BuildCard
            key={build.id}
            build={build}
            isSelected={selectedBuilds.some(b => b.id === build.id)}
            onCompare={handleCompare}
          />
        ))}
      </div>

      {selectedBuilds.length === 2 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Detailed Comparison</h2>
          
          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {selectedBuilds.map(build => (
              <ComparisonCard key={build.id} build={build} />
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {selectedBuilds.map(build => (
              <div key={build.id} className="space-y-3">
                <a
                  href={build.purchaseLink}
                  className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Buy {build.name}
                </a>
                <a
                  href={build.customizeLink}
                  className="block w-full py-3 text-center bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Customize {build.name}
                </a>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedBuilds([])}
            className="mt-6 w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Reset Comparison
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(CustomPreBuildList);