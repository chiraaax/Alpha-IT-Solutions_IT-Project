import gamingImg from "../../assets/gamingb.jpg";
import budgetImg from "../../assets/budgetb.jpg";
import { Link } from 'react-router-dom';

const preBuilds = [
  {
    id: 1,
    name: "Gaming Builds",
    image: gamingImg,
    description: "Greatest performance and price for most gamers. Perfect for 1080p gaming.",
    link: "/gaming-builds" // Add a link for navigation
  },
  {
    id: 2,
    name: "Budget Builds",
    image: budgetImg,
    description: "Perfect for casual gaming and everyday tasks. Great value for money.",
    link: "/budget-builds" // Add a link for navigation
  },
];

const CustomPreBuildList = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
      {preBuilds.map((build) => (
        <a
          key={build.id}
          href={build.link} // Make the card clickable
          className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl p-4"
          aria-label={`View ${build.name}`} // Accessibility improvement
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
          </div>
        </a>
      ))}
    </div>
  );
};

export default CustomPreBuildList;