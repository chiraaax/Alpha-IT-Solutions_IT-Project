import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gamingImg from "../../assets/gamingb.jpg";
import budgetImg from "../../assets/budgetb.jpg";

const preBuilds = [
  {
    id: 1,
    name: "Gaming Builds",
    image: gamingImg,
    description: "Greatest performance and price for most gamers. Perfect for 1080p gaming.",
    link: "/gaming-builds",
  },
  {
    id: 2,
    name: "Budget Builds",
    image: budgetImg,
    description: "Perfect for casual gaming and everyday tasks. Great value for money.",
    link: "/budget-builds",
  },
];

const CustomPreBuildList = React.memo(() => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8 px-4">
      {preBuilds.map((build) => (
        <motion.div
          key={build.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <Link
            to={build.link}           
            aria-label={`View ${build.name}`}
            role="link"
          >
            {/* Image Section */}
            <motion.img
              src={build.image}
              alt={build.name}
              className="w-full h-52 object-cover rounded-xl mb-5 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:opacity-90"
              loading="lazy"
              whileHover={{ scale: 1.02 }}
            />

            {/* Content Section */}
            <div className="text-center">
              <motion.h2
                className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 transition-all duration-300 hover:text-blue-500"
                whileHover={{ y: -3 }}
              >
                {build.name}
              </motion.h2>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {build.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
});

export default CustomPreBuildList;
