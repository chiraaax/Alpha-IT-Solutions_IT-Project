// client/src/components/CustomBuilds/BuildDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const builds = {
  gaming: [
    {
      id: 1,
      name: "Ultimate Gaming Rig",
      description: "Top-tier performance for 4K gaming.",
      components: "Intel i9, RTX 3080, 32GB RAM, 1TB SSD",
      price: "$2500",
      image: "path/to/your/image1.jpg", // Replace with actual image path
    },
    {
      id: 2,
      name: "Mid-Range Gaming PC",
      description: "Great performance for 1440p gaming.",
      components: "AMD Ryzen 5, RTX 3060, 16GB RAM, 512GB SSD",
      price: "$1200",
      image: "path/to/your/image2.jpg", // Replace with actual image path
    },
    {
      id: 3,
      name: "Budget Gaming Build",
      description: "Affordable gaming without compromising performance.",
      components: "Intel i5, GTX 1650, 8GB RAM, 256GB SSD",
      price: "$800",
      image: "path/to/your/image3.jpg", // Replace with actual image path
    },
  ],
  budget: [
    {
      id: 1,
      name: "Budget Builder",
      description: "Perfect for casual gaming and everyday tasks.",
      components: "AMD Ryzen 3, Integrated Graphics, 8GB RAM, 256GB SSD",
      price: "$600",
      image: "path/to/your/image4.jpg", // Replace with actual image path
    },
    {
      id: 2,
      name: "Entry Level PC",
      description: "Great value for money for basic gaming.",
      components: "Intel i3, Integrated Graphics, 8GB RAM, 1TB HDD",
      price: "$500",
      image: "path/to/your/image5.jpg", // Replace with actual image path
    },
  ],
};

const BuildDetail = () => {
  const { type, id } = useParams(); // Get the type (gaming/budget) and id from the URL
  const navigate = useNavigate();

  console.log('Type:', type); // Debugging log
  console.log('ID:', id); // Debugging log

  // Check if the type exists in the builds object
  if (!builds[type]) {
    return <div>Build type not found!</div>;
  }

  const build = builds[type].find(b => b.id === parseInt(id)); // Find the specific build

  if (!build) {
    return <div>Build not found!</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4">{build.name}</h1>
      <img src={build.image} alt={build.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <p className="text-lg mb-2">{build.description}</p>
      <p className="font-bold">{build.components}</p>
      <p className="text-xl text-blue-600">{build.price}</p>
      <button
        onClick={() => navigate('/custom-build-form')} // Navigate to the CustomBuildForm
        className="mt-4 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition duration-200"
      >
        Customize this Build
      </button>
    </div>
  );
};

export default BuildDetail;