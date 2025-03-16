import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // Import the useTheme hook
import { FaSun, FaMoon } from 'react-icons/fa'; // Import FontAwesome sun and moon icons

// Import images directly for better path resolution
import ultimateGamingRig from '../../assets/ultimate-gaming-rig.jpg';
import midRangeGamingPc from '../../assets/ultimate-gaming-rig.jpg';
import budgetBuilder from '../../assets/ultimate-gaming-rig.jpg';
import entryLevelPc from '../../assets/ultimate-gaming-rig.jpg';

const builds = {
  gaming: [
    { id: 1, name: "Ultimate Gaming Rig", description: "Top-tier performance for 4K gaming.", components: "Intel i9, RTX 3080, 32GB RAM, 1TB SSD", price: 2500, image: ultimateGamingRig },
    { id: 2, name: "Mid-Range Gaming PC", description: "Great performance for 1440p gaming.", components: "AMD Ryzen 5, RTX 3060, 16GB RAM, 512GB SSD", price: 1200, image: midRangeGamingPc },
  ],
  budget: [
    { id: 1, name: "Budget Builder", description: "Perfect for casual gaming and everyday tasks.", components: "AMD Ryzen 3, Integrated Graphics, 8GB RAM, 256GB SSD", price: 600, image: budgetBuilder },
    { id: 2, name: "Entry Level PC", description: "Great value for money for basic gaming.", components: "Intel i3, Integrated Graphics, 8GB RAM, 1TB HDD", price: 500, image: entryLevelPc },
  ],
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const BuildDetail = () => {
  const { type, id } = useParams();  
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme(); // Get dark mode state and toggle function

  if (!builds[type]) {
    return <div className="text-red-500 text-xl">Build type not found!</div>;
  }

  const build = builds[type].find(b => b.id === parseInt(id));

  if (!build) {
    return <div className="text-red-500 text-xl">Build not found!</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-all duration-300 ease-in-out`}>
      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      <h1 className="text-4xl font-bold mb-4">{build.name}</h1>
      <img src={build.image} alt={build.name} className="w-full h-48 object-cover rounded-lg mb-4" loading="lazy" />
      <p className="text-lg mb-2">{build.description}</p>
      <p className="font-bold">{build.components}</p>
      <p className="text-xl text-blue-600">{formatPrice(build.price)}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white rounded p-2 hover:bg-gray-700 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/custom-build-form')}
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition duration-200"
        >
          Customize this Build
        </button>
      </div>
    </div>
  );
};

export default BuildDetail;
