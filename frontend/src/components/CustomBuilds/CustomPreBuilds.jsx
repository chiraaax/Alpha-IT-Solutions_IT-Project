import React, { useState } from "react";
import CustomPreBuildList from "./CustomPreBuildList";

const CustomPreBuilds = () => {
  const [selectedBuilds, setSelectedBuilds] = useState([]); // For comparison feature

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-t from-gray-900 via-blue-900 to-white dark:from-black dark:via-gray-800 dark:to-gray-900">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400 mb-6">
        Custom Pre-Builds
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-center mb-8 text-xl max-w-4xl">
        Browse our exclusive collection of pre-configured PCs! Build the ultimate machine with high-quality components tailored to your needs.
      </p>

      {/* Custom Pre-Builds List */}
      <CustomPreBuildList selectedBuilds={selectedBuilds} setSelectedBuilds={setSelectedBuilds} />

      {/* Build Comparison Feature */}
      {selectedBuilds.length === 2 && (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Build Comparison</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedBuilds[0].name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedBuilds[0].description}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{selectedBuilds[0].modernSuitability}</p>
            </div>

            <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedBuilds[1].name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedBuilds[1].description}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{selectedBuilds[1].modernSuitability}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPreBuilds;
