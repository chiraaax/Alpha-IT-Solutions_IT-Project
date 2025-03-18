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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const GamingBuilds = () => {
  const { isDark, toggleTheme } = useTheme(); // Get dark mode state and toggle function

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 ${isDark ? 'bg-gray-900 text-rose-600' : 'bg-white text-black'} transition-all duration-300 ease-in-out`}>
      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

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
