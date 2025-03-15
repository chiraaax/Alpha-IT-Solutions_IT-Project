// client/src/components/CustomBuilds/BudgetBuilds.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const budgetBuilds = [
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
];

const BudgetBuilds = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4">Budget Builds</h1>
      <p className="text-gray-700 mb-8">Discover our affordable and efficient budget builds!</p>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {budgetBuilds.map(build => (
          <Link key={build.id} to={`/budget-builds/${build.id}`} className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <img src={build.image} alt={build.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{build.name}</h2>
            <p>{build.description}</p>
            <p className="font-bold">{build.components}</p>
            <p className="text-xl text-blue-600">{build.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BudgetBuilds;