import React from "react";
import CustomPreBuildList from "./CustomPreBuildList";

const CustomPreBuilds = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: 'linear-gradient(to top, #070000, #0e375f, #ffffff)' }}>

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400 mb-6">
        Custom Pre-Builds
      </h1>
      <p className="text-gray-700 text-center mb-8 text-xl max-w-4xl">
        Browse our exclusive collection of pre-configured PCs! Build the ultimate machine with high-quality components tailored to your needs.
      </p>

      {/* Custom Pre-Builds List */}
      <CustomPreBuildList />
    </div>
  );
};

export default CustomPreBuilds;

