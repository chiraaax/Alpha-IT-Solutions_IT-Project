// client/src/components/CustomBuilds/CustomBuildForm.jsx
import React, { useState } from 'react';

const CustomBuildForm = () => {
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedComponents({ ...selectedComponents, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the submission of the selected components
    console.log('Selected Components:', selectedComponents);
    // You can also send this data to your backend if needed
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Customize Your Build</h2>
      <div className="mb-4">
        <label className="block mb-2">CPU:</label>
        <select name="cpu" value={selectedComponents.cpu} onChange={handleChange} className="border rounded p-2 w-full">
          <option value="">Select CPU</option>
          <option value="Intel i5">Intel i5</option>
          <option value="Intel i7">Intel i7</option>
          <option value="AMD Ryzen 5">AMD Ryzen 5</option>
          <option value="AMD Ryzen 7">AMD Ryzen 7</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">GPU:</label>
        <select name="gpu" value={selectedComponents.gpu} onChange={handleChange} className="border rounded p-2 w-full">
          <option value="">Select GPU</option>
          <option value="NVIDIA RTX 3060">NVIDIA RTX 3060</option>
          <option value="NVIDIA RTX 3070">NVIDIA RTX 3070</option>
          <option value="AMD RX 6700 XT">AMD RX 6700 XT</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">RAM:</label>
        <select name="ram" value={selectedComponents.ram} onChange={handleChange} className="border rounded p-2 w-full">
          <option value="">Select RAM</option>
          <option value="8GB">8GB</option>
          <option value="16GB">16GB</option>
          <option value="32GB">32GB</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Storage:</label>
        <select name="storage" value={selectedComponents.storage} onChange={handleChange} className="border rounded p-2 w-full">
          <option value="">Select Storage</option>
          <option value="256GB SSD">256GB SSD</option>
          <option value="512GB SSD">512GB SSD</option>
          <option value="1TB HDD">1TB HDD</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition duration-200">
        Create Build
      </button>
    </form>
  );
};

export default CustomBuildForm;