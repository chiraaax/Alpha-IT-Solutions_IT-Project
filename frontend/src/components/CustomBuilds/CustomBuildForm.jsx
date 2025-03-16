import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import FontAwesome sun and moon icons
import { useTheme } from './ThemeContext'; // Import the useTheme hook

const CustomBuildForm = () => {
  const { isDark, toggleTheme } = useTheme(); // Get dark mode state and toggle function

  const [formData, setFormData] = useState({
    cpu: 'Intel i9',
    gpu: 'RTX 3080',
    ram: '16GB',
    storage: '512GB SSD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(formData).includes('')) {
      toast.error('Please complete all fields!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      toast.success('Custom Build Created Successfully!');
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ToastContainer />

      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:bg-gray-700 focus:outline-none"
      >
        {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
      </button>

      {submitted ? (
        <div className="text-xl font-semibold text-green-600">
          Build saved successfully! 🎉
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Customize Your Build</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg">CPU</label>
              <select
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Choose your CPU"
              >
                <option>Intel i9</option>
                <option>Intel i7</option>
                <option>AMD Ryzen 5</option>
              </select>
            </div>

            <div>
              <label className="block text-lg">GPU</label>
              <select
                name="gpu"
                value={formData.gpu}
                onChange={handleChange}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Choose your GPU"
              >
                <option>RTX 3080</option>
                <option>RTX 3070</option>
                <option>AMD RX 6700 XT</option>
              </select>
            </div>

            <div>
              <label className="block text-lg">RAM</label>
              <select
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Choose your RAM"
              >
                <option>16GB</option>
                <option>32GB</option>
              </select>
            </div>

            <div>
              <label className="block text-lg">Storage</label>
              <select
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Choose your Storage"
              >
                <option>512GB SSD</option>
                <option>1TB HDD</option>
              </select>
            </div>

            <h2 className="text-lg font-semibold mt-4">Your Selected Build:</h2>
            <div
              className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {Object.entries(formData).map(([key, value]) => (
                <p key={key} className="text-lg">
                  <strong>{key.toUpperCase()}:</strong> {value}
                </p>
              ))}
            </div>

            <button
              type="submit"
              className={`mt-4 bg-green-600 text-white rounded p-2 transition duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Custom Build'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomBuildForm;
